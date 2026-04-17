# Apply-tude

![Apply-tude logo](public/logo.png)

Self-hostable job-application tracker. Save the postings you care about, track them from *saved* → *applied* → *interviewing* → *offer* → *accepted* / *rejected* / *withdrawn* / *ghosted*, tag with free-form categories, and filter and sort everything from the sidebar. A local [Ollama](https://ollama.com/) model pre-fills new applications from pasted job-posting text. Dashboard charts show your pipeline, success funnel, activity heatmap, and category mix.

No SaaS, no external LLM calls, no telemetry. Everything runs on your box.

## Tech stack

- **Framework**: [React Router 7](https://reactrouter.com/) (SSR, file-based routing, loaders/actions)
- **UI**: [shadcn/ui](https://ui.shadcn.com/) on [Tailwind CSS 4](https://tailwindcss.com/), [Recharts](https://recharts.org/) for charts
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Cache**: [Redis](https://redis.io/) via [ioredis](https://github.com/redis/ioredis) (cache-aside, graceful fallback)
- **AI**: [Ollama](https://ollama.com/) running `gemma3:4b` locally
- **Auth**: React Router cookie sessions + [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **Validation**: [Zod](https://zod.dev/)
- **Build**: [Vite](https://vite.dev/) + TypeScript (strict)

## Prerequisites

- **[Docker](https://www.docker.com/) + Docker Compose** — the recommended path (one command, works identically on macOS / Linux / Windows)
- **[Node.js](https://nodejs.org/) 20.6+** (22 LTS recommended) — only needed for the local-dev path. `20.6` is required because `scripts/seed.js` uses Node's built-in `--env-file` flag.
- **[GNU Make](https://www.gnu.org/software/make/)** — *optional but nice.* Install via `choco install make` on Windows, or use Git Bash with msys-make. Without `make`, run the underlying npm/docker commands directly (see the [scripts table](#scripts)).

## Quick start — Docker (recommended)

Spins up the app plus Mongo, Redis, and Ollama (which auto-pulls `gemma3:4b` on first run — allow ~2 min on a fresh machine).

```bash
git clone https://github.com/QBERT18/Apply-tude.git
cd Apply-tude

cp .env.example .env      # then open .env and set SESSION_SECRET
make docker-up            # or: docker compose up -d app mongo redis ollama
```

Visit **http://localhost:3000**. Logs: `make docker-logs`. Stop: `make docker-down`. Nuke data too: `make docker-clean`.

## Quick start — Local development

Run the app on your host with Vite's HMR on `:5173`, but containerise the backing services so you don't have to install Mongo/Redis/Ollama.

```bash
git clone https://github.com/QBERT18/Apply-tude.git
cd Apply-tude

cp .env.example .env      # set SESSION_SECRET
npm install

make dev-services         # starts mongo-dev (:27017), redis-dev (:6379), ollama-dev (:11435)
make seed                 # optional — inserts 20 sample applications
npm run dev               # or: make dev
```

Visit **http://localhost:5173**. Stop the containers with `make dev-services-down`.

**About the Ollama port**: `ollama-dev` maps container `11434` → host **`11435`** (so it can't collide with a natively-installed Ollama on `11434`). `.env.example` ships with `OLLAMA_URL=http://localhost:11435` to match. If you run Ollama natively instead, change it to `11434`.

## Environment variables

| Variable | Used when | Notes |
|---|---|---|
| `MONGODB_URI_DEV` | `NODE_ENV !== "production"` | Local dev. Defaults to `mongodb://localhost:27017/applytude`. |
| `MONGODB_URI` | `NODE_ENV === "production"` | Production. Set for `make docker-up` or self-hosted deploys. |
| `SESSION_SECRET` | Always | Cookie signing key. Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. |
| `OLLAMA_URL` | Always | `http://localhost:11435` for containerised ollama-dev; `11434` for native Ollama. |
| `REDIS_URL` | Always | Falls back to `redis://localhost:6379` if unset. Redis failures degrade gracefully — queries still hit Mongo. |

The dev-vs-prod Mongo URI selection lives in [`app/lib/db.server.ts`](app/lib/db.server.ts):

```ts
const isProduction = process.env.NODE_ENV === "production";
const MONGODB_URI = requireEnv(
  isProduction ? "MONGODB_URI" : "MONGODB_URI_DEV"
);
```

`.env` is gitignored. Never commit it. See [`.env.example`](.env.example) for the full shape.

## Scripts

Every `make` target maps to an underlying npm/docker command. Run `make` with no arguments to see the full list.

| Make target | npm / docker equivalent | What it does |
|---|---|---|
| `make install` | `npm install` | Install dependencies |
| `make env` | `cp .env.example .env` | Create `.env` if missing |
| `make dev` | `npm run dev` | Dev server on `:5173` (HMR) |
| `make dev-services` | `docker compose up -d mongo-dev redis-dev ollama-dev` | Start host-exposed backing services |
| `make dev-services-down` | `docker compose stop mongo-dev redis-dev ollama-dev` | Stop them |
| `make seed` | `node --env-file=.env scripts/seed.js` | Insert 20 sample applications |
| `make build` | `npm run build` | Build prod bundle into `build/` |
| `make start` | `npm run start` | Serve `build/` with `react-router-serve` |
| `make typecheck` | `npm run typecheck` | `react-router typegen && tsc` |
| `make docker-build` | `docker compose build app` | Build the production image |
| `make docker-up` | `docker compose up -d app mongo redis ollama` | Start the full prod stack |
| `make docker-down` | `docker compose down` | Stop everything |
| `make docker-logs` | `docker compose logs -f app` | Tail app logs |
| `make docker-clean` | `docker compose down -v` | Stop **and delete all volumes** (destroys data) |
| `make clean` | `rm -rf build .react-router node_modules` | Nuke build output + deps |

## Using `make` — common workflows

The Makefile bundles the common flows. Each snippet below is a complete copy-pasteable recipe.

### First-time setup — Docker path

Zero-to-running in three commands:

```bash
make env          # create .env from .env.example
# edit .env — set SESSION_SECRET (see the generate command in the file)
make docker-up    # builds the app image, starts app + mongo + redis + ollama
make docker-logs  # follow the startup; expect ~2 min on first run (Ollama pulls gemma3:4b)
```

Then visit **http://localhost:3000**. Stop with `make docker-down`.

### First-time setup — local dev path

Host-run Node with containerised backing services:

```bash
make env
# edit .env — set SESSION_SECRET
make install
make dev-services # mongo-dev, redis-dev, ollama-dev (ollama-dev pulls gemma3:4b on first run)
make seed         # optional: 20 sample applications
make dev          # http://localhost:5173 with HMR
```

### Day-to-day dev loop

```bash
make dev-services # once per session
make dev          # in another terminal
# ... edit code, hot-reload ...
make typecheck    # before committing
```

When you're done for the day:

```bash
make dev-services-down
```

### After pulling new code

```bash
git pull
make install      # if dependencies changed
make typecheck    # catch breaking type changes early
```

If `docker-compose.yaml` or the `Dockerfile` changed:

```bash
make docker-build # rebuild the app image
make docker-up    # restart the stack
```

### Shipping a production build locally

Useful for smoke-testing the SSR bundle without Docker:

```bash
make build        # writes to build/
make start        # serves on :3000
```

### Resetting state

| Goal | Command |
|---|---|
| Stop containers, keep data | `make docker-down` |
| Stop containers **and delete all data** (Mongo, Redis, Ollama model cache) | `make docker-clean` |
| Wipe `build/`, `.react-router/`, `node_modules/` | `make clean` |

### Without `make`

Every target maps to the underlying npm / docker command — see the [Scripts table](#scripts) above and run those directly. No `make` target does anything you can't do by hand.

## Seeding the database

[`scripts/seed.js`](scripts/seed.js) inserts 20 sample applications with varied statuses and categories. By default it writes to the dev database (`MONGODB_URI_DEV`).

```bash
make seed                                                  # local dev DB
NODE_ENV=production node --env-file=.env scripts/seed.js   # prod DB (careful)
```

## Docker services

[`docker-compose.yaml`](docker-compose.yaml) defines two parallel sets of services:

- **Production stack** (`app`, `mongo`, `redis`, `ollama`) — internal-only network, no host ports except `:3000` for the app. Used by `make docker-up`.
- **Dev services** (`mongo-dev`, `redis-dev`, `ollama-dev`) — expose ports to the host (`27017`, `6379`, `11435`) so an app running on your host (via `npm run dev`) can reach them. Used by `make dev-services`.

On first run, the `ollama` / `ollama-dev` containers pull `gemma3:4b` (~3 GB) — this is a one-time cost, cached in the `ollama-data` / `ollama-dev-data` Docker volumes.

## Deployment

Self-host with Docker Compose on any VPS:

```bash
git clone https://github.com/QBERT18/Apply-tude.git
cd Apply-tude
cp .env.example .env
# set SESSION_SECRET and (optionally) override MONGODB_URI to point to managed Mongo
make docker-up
```

Put something like Caddy, Nginx, or Traefik in front of `:3000` for TLS.

The Ollama container runs `gemma3:4b` on CPU; if you have an NVIDIA GPU, extend the `ollama` service in `docker-compose.yaml` with the [Ollama GPU config](https://hub.docker.com/r/ollama/ollama).

## Project structure

```
app/
├── components/
│   ├── ui/                              # shadcn primitives
│   ├── form/                            # chip input, etc.
│   ├── layout/                          # AppSidebar + types
│   ├── charts/                          # Recharts dashboard components
│   ├── landing/                         # landing-page sections
│   ├── application-card.tsx
│   ├── application-form.tsx
│   └── generate-application-dialog.tsx  # Ollama-backed prefill
├── hooks/
├── lib/
│   ├── auth.server.ts                   # cookie sessions, requireUserId()
│   ├── db.server.ts                     # Mongoose connection, env-driven URI
│   ├── ollama.server.ts                 # generateApplication() with fallback
│   ├── redis.server.ts                  # getCached() + invalidateCache()
│   ├── constants/                       # status enum, badge classes, sort options
│   ├── models/                          # Mongoose schemas + *.queries.server.ts
│   ├── schemas/                         # Zod: form + AI generation
│   └── utils/                           # slug + date helpers
└── routes/
    ├── landing.tsx                      # /
    ├── login.tsx  signup.tsx  logout.tsx
    └── dashboard/
        ├── layout.tsx                   # SidebarProvider shell
        ├── home.tsx                     # /dashboard — overview + charts
        ├── applications.tsx             # list/grid + filters
        ├── applications.$slug.tsx       # detail view
        ├── new.tsx                      # create (+ AI generate dialog)
        └── edit.$id.tsx                 # edit
```

## Code conventions

- **No `type` / `interface` declarations in `.tsx` files.** Component prop types live in sibling `*.types.ts` (e.g. `app-sidebar.types.ts`). Domain types live in [`app/lib/models/application.types.ts`](app/lib/models/application.types.ts). Zod schemas + their inferred types live in [`app/lib/schemas/`](app/lib/schemas/).
- **Database calls only in `.server.ts` files.** Routes call helpers in [`app/lib/models/application.queries.server.ts`](app/lib/models/application.queries.server.ts), never Mongoose directly. The `.server.ts` suffix excludes the file from the client bundle.
- **Filter and sort state lives in URL search params**, not React state. Loaders read `category` / `status` / `sort` / `dir` from `request.url`.
- **Every application mutation must invalidate cache** — `invalidateCache(\`user:${userId}:*\`)` after each create/update/delete.
- **Ollama failures must not block** — fall back to hardcoded data rather than surfacing transient LLM errors.

## License

See [LICENSE](LICENSE).
