# CLAUDE.md

Notes for Claude Code (and future-me) on how this codebase is shaped.

## What it is

Apply-tude is a self-hostable job-application tracker. Users sign up, save job postings, track them through a status pipeline (saved → applied → interviewing → offer → accepted/rejected/withdrawn/ghosted), tag with free-form categories, and view a charted dashboard. A local Ollama model (`gemma3:4b`) can pre-fill new entries from pasted job-posting text.

## Stack

- **React Router 7** SSR (file-based routing, loaders/actions) on Vite 8
- **React 19** + **TypeScript** (strict)
- **Tailwind CSS 4** + **shadcn/ui** (Radix primitives)
- **Recharts** for the dashboard
- **Mongoose 9** → MongoDB 7
- **ioredis** → Redis 7 (cache-aside)
- **Ollama** (`gemma3:4b`) for AI generation
- **Zod 4** for validation
- **bcryptjs** + React Router cookie sessions for auth
- **No test framework.** `npm run typecheck` is the only static check.

## Running it

| Mode | Command | URL |
|---|---|---|
| Local dev (host app + containerised services) | `make dev-services && npm run dev` | http://localhost:5173 |
| Full prod stack in Docker | `make docker-up` | http://localhost:3000 |
| Typecheck | `make typecheck` or `npm run typecheck` | — |

`make` with no args lists every target.

## Key files

- [app/lib/db.server.ts](app/lib/db.server.ts) — Mongoose connection, global pooling. Picks `MONGODB_URI` in production, `MONGODB_URI_DEV` otherwise.
- [app/lib/redis.server.ts](app/lib/redis.server.ts) — `getCached(key, fetcher, ttl)` cache-aside wrapper + `invalidateCache(pattern)`. Both silently fall back to the fetcher on Redis failure.
- [app/lib/ollama.server.ts](app/lib/ollama.server.ts) — `generateApplication(prompt)` calls `${OLLAMA_URL}/api/generate` with a 120s timeout. On failure returns a hardcoded fallback app. Never blocks the request path.
- [app/lib/auth.server.ts](app/lib/auth.server.ts) — cookie sessions (`__session`, 7-day). Use `requireUserId(request)` in protected loaders/actions.
- [app/lib/models/](app/lib/models/) — Mongoose schemas + query helpers. Routes call the `*.queries.server.ts` helpers, never Mongoose directly.
- [app/routes/](app/routes/) — file-based routes. Dashboard is nested under `app/routes/dashboard/`.

## Hard conventions

1. **No `type`/`interface` in `.tsx` files.** Component prop types go in sibling `*.types.ts`. Domain types in [app/lib/models/application.types.ts](app/lib/models/application.types.ts). Zod schemas + their inferred types live in [app/lib/schemas/](app/lib/schemas/). (Enforced by user preference — non-negotiable.)
2. **Database calls only in `.server.ts` files.** The `.server.ts` suffix tells the bundler to exclude the file from the client bundle. Never import a `.server.ts` file from client code.
3. **Filter/sort state lives in URL search params**, not React state. Loaders parse `category`/`status`/`sort`/`dir` from `request.url`.
4. **Every application mutation must invalidate cache**: `invalidateCache(\`user:${userId}:*\`)` after any create/update/delete in the query helpers.
5. **Ollama failures must not block.** Wrap in try/catch, fall back to hardcoded data. Don't surface transient LLM errors to the user.

## Environment variables

| Var | Used when | Notes |
|---|---|---|
| `MONGODB_URI_DEV` | `NODE_ENV !== "production"` | Local dev |
| `MONGODB_URI` | `NODE_ENV === "production"` | Self-host / prod |
| `SESSION_SECRET` | Always | 32+ random bytes, hex |
| `OLLAMA_URL` | Always | Default `http://localhost:11435` (containerised ollama-dev); `11434` if Ollama is native |
| `REDIS_URL` | Always | Falls back to `redis://localhost:6379` if unset |

## Directory map

```
app/
├── components/          # ui/, form/, layout/, charts/, landing/ + shared cards
├── hooks/
├── lib/
│   ├── auth.server.ts
│   ├── db.server.ts
│   ├── ollama.server.ts
│   ├── redis.server.ts
│   ├── constants/       # status enum, badge classes, sort options
│   ├── models/          # Mongoose models + *.queries.server.ts + *.types.ts
│   ├── schemas/         # Zod schemas (form + AI generation)
│   └── utils/           # slug + date helpers
├── routes/
│   ├── landing.tsx
│   ├── login.tsx · signup.tsx · logout.tsx
│   └── dashboard/
│       ├── layout.tsx               # SidebarProvider + AppSidebar shell
│       ├── home.tsx                 # Overview + charts
│       ├── applications.tsx         # Grid/list with filters
│       ├── applications.$slug.tsx   # Detail view
│       ├── new.tsx                  # Create (+ AI generate dialog)
│       └── edit.$id.tsx             # Edit
├── app.css
└── root.tsx
```

## Scripts

- [scripts/seed.js](scripts/seed.js) — inserts 20 sample applications. Reads `MONGODB_URI_DEV` by default; set `NODE_ENV=production` to target `MONGODB_URI`.
