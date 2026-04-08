# Apply-tude

A personal job-application tracker. Save the postings you care about, track their status from "saved" all the way to "accepted" or "rejected", tag them with your own free-form categories, and filter and sort everything from a sidebar.

![Apply-tude logo](public/logo.png)

## Tech stack

- **Framework**: [React Router 7](https://reactrouter.com/) (SSR, file-based routing, loaders/actions)
- **UI**: [shadcn/ui](https://ui.shadcn.com/) on top of [Tailwind CSS 4](https://tailwindcss.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Build tool**: [Vite](https://vite.dev/)
- **Language**: TypeScript

## Prerequisites

- **Node.js 20.6 or newer** (the seed script uses Node's built-in `--env-file` flag, which landed in 20.6 — Node 22 LTS is recommended)
- **A MongoDB instance** to connect to. You have two options for local development:
  - The bundled `docker-compose.yaml` spins up Mongo 7 in a container (recommended)
  - An existing local Mongo install on `mongodb://localhost:27017`
- **A MongoDB Atlas cluster** for production (free tier is enough)
- A **Vercel account** if you want to deploy

## Quick start

```bash
# 1. Clone and install
git clone https://github.com/QBERT18/Apply-tude.git
cd Apply-tude
npm install

# 2. Start a local MongoDB (skip if you already have one running on :27017)
docker compose up -d

# 3. Create your .env from the template
cp .env.example .env
# then open .env and fill in MONGODB_URI with your Atlas string
# (MONGODB_URI_DEV stays at the default localhost value)

# 4. Run the dev server
npm run dev
```

The app will be available at **http://localhost:5173**.

## Environment variables

The project distinguishes between local development and production via two named MongoDB URIs:

| Variable | When it's used | Where it lives |
|---|---|---|
| `MONGODB_URI_DEV` | Local development (`NODE_ENV !== "production"`) | Your local `.env` file |
| `MONGODB_URI` | Production (`NODE_ENV === "production"`) | **Vercel dashboard** (and optionally your local `.env` for testing) |

The selection happens in [`app/lib/db.server.ts`](app/lib/db.server.ts):

```ts
const isProduction = process.env.NODE_ENV === "production";
const MONGODB_URI = requireEnv(
  isProduction ? "MONGODB_URI" : "MONGODB_URI_DEV"
);
```

`.env` is gitignored. Never commit it. See [`.env.example`](.env.example) for the expected shape.

## Available scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start the React Router dev server with HMR on `:5173`. Loads `.env` automatically. |
| `npm run build` | Build the production bundle into `build/`. |
| `npm run start` | Serve the production build with `react-router-serve`. |
| `npm run typecheck` | Run `react-router typegen` and then `tsc` to verify the whole project. |

## Seeding the database

[`scripts/seed.js`](scripts/seed.js) inserts 20 sample applications with varied statuses and categories. It uses the same `NODE_ENV`-based selection as the main app, so by default it writes to your **local** dev database.

```bash
# Seed local dev DB (default)
node --env-file=.env scripts/seed.js

# Seed the production DB instead (use with caution)
NODE_ENV=production node --env-file=.env scripts/seed.js
```

## Local MongoDB via Docker

The repo ships with a minimal `docker-compose.yaml` that runs Mongo 7 with a bind-mounted volume so your data survives container restarts:

```bash
# Start Mongo in the background
docker compose up -d

# Check it's running
docker compose ps

# Tail the logs
docker compose logs -f mongo

# Stop it
docker compose down
```

The data lives in `./mongo-data/` which is gitignored.

## Deploying to Vercel

The app is set up to run on Vercel out of the box. Steps:

1. **Push your repo to GitHub** (or GitLab / Bitbucket).
2. **Import the project** in the [Vercel dashboard](https://vercel.com/new).
3. Vercel auto-detects the React Router framework — no build settings to change.
4. **Add your environment variable**:
   - Settings → Environment Variables
   - Name: `MONGODB_URI`
   - Value: your MongoDB Atlas connection string
   - Scope: **Production** (and optionally **Preview** if you want PR deploys to use the same DB)
5. **Deploy**.

You do **not** need to add `MONGODB_URI_DEV` on Vercel — production code never reads it. Vercel sets `NODE_ENV=production` automatically, which makes the app pick `MONGODB_URI` from the dashboard env vars.

Make sure your **MongoDB Atlas cluster allows connections from `0.0.0.0/0`** (or from Vercel's IP range) under Network Access, otherwise the app won't be able to connect.

## Self-hosted deployment (Docker)

If you'd rather host the app yourself, the included [`Dockerfile`](Dockerfile) builds a multi-stage production image:

```bash
docker build -t apply-tude .
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e MONGODB_URI="your-atlas-connection-string" \
  apply-tude
```

## Project structure

```
app/
├── components/
│   ├── form/                # Form-only components (chip input, etc.)
│   ├── layout/              # AppSidebar and its sibling .types.ts
│   ├── ui/                  # shadcn primitives (Field, Sidebar, ...)
│   ├── application-card.tsx # Card shown on the home grid
│   └── application-form.tsx # The shared create/edit form
├── hooks/                   # Custom hooks (use-mobile, ...)
├── lib/
│   ├── constants/           # Status enum, badge classes, sort options
│   ├── models/              # Mongoose schema, query helpers, shared types
│   ├── schemas/             # Zod schemas (one file = the form schema only)
│   ├── utils/               # slug + date helpers
│   └── db.server.ts         # Mongoose connection (env-driven)
└── routes/
    ├── layout.tsx           # Root layout: SidebarProvider + AppSidebar + Outlet
    ├── home.tsx             # Index route, reads filters from URL search params
    ├── new.tsx              # Create form
    ├── edit.$id.tsx         # Edit form
    └── applications.$slug.tsx  # Detail page
```

## Code conventions

A few rules the codebase follows that aren't obvious from a glance:

- **No type or interface declarations in `.tsx` files.** Component prop types live in sibling `*.types.ts` files (e.g. `app-sidebar.types.ts`). Domain types live in [`app/lib/models/application.types.ts`](app/lib/models/application.types.ts). Constants live in [`app/lib/constants/`](app/lib/constants/). Zod schemas live in [`app/lib/schemas/`](app/lib/schemas/) and that file holds *only* the schema and its inferred types.
- **Database calls only in `.server.ts` files.** Routes never call Mongoose directly — they go through helpers in [`app/lib/models/application.queries.server.ts`](app/lib/models/application.queries.server.ts).
- **Filter and sort state lives in URL search params**, not React state. The home loader reads `category`/`status`/`sort`/`dir` from the request URL and passes them into the query layer.

## License

See [LICENSE](LICENSE).
