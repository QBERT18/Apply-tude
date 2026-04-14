# AI-Powered Application Generation

## Problem

Users manually fill 9+ fields when creating a job application. When they have a job posting or even a rough description, the app should extract structured data automatically and pre-fill the form.

## Solution

"Generate" button on the applications page opens a dialog with a textarea. User pastes job posting text or a freeform description. Server sends it to a local Ollama instance (gemma3:4b), parses the structured JSON response, and redirects to the new-application form pre-filled with the extracted data. User reviews, edits, and saves normally.

---

## User Flow

```
Applications page → click "Generate" button (left of ViewToggle)
    ↓
Centered dialog opens (backdrop, ~md width)
    ↓
User pastes/types text into textarea
    ↓
"Generate" button enables (disabled when empty)
    ↓
User clicks Generate → loading state (spinner, button disabled)
    ↓
Server calls Ollama → parses JSON response
    ↓
Redirect to /dashboard/new with form pre-filled
    ↓
User reviews fields, edits if needed, clicks "Create"
    ↓
Normal application creation flow (existing)
```

---

## UI Changes

### Applications Page Header

Current:
```
                              [ViewToggle]  [+ New application]
```

New:
```
[✨ Generate]                 [ViewToggle]  [+ New application]
```

- `Wand2` icon from lucide-react
- Default button variant (theme primary color)
- Left-aligned, separated from right-aligned controls

### Generate Dialog

- Component: `@base-ui/react/dialog` via shadcn (`npx shadcn@latest add dialog`)
- Centered, max-w-md, dark backdrop (matches existing AlertDialog pattern)
- Contents:
  - Title: "Generate Application"
  - Description: "Paste a job listing or describe the position you're applying for."
  - Textarea: min 4 rows, autofocus, placeholder text
  - Footer: Cancel button (outline) + Generate button (default, disabled when textarea empty)
  - Loading state: spinner icon replaces Wand2, "Generating..." label, all inputs disabled
  - Error state: inline error message below textarea if Ollama fails

---

## Server Architecture

### Ollama Client — `app/lib/ollama.server.ts`

Single function: `generateApplication(prompt: string): Promise<Partial<ApplicationInput>>`

**Ollama API call:**
```
POST ${OLLAMA_URL}/api/generate
{
  "model": "gemma3:4b",
  "prompt": "<user text>",
  "system": "<system prompt>",
  "stream": false,
  "format": "json"
}
```

- `stream: false` — wait for complete response (simpler than streaming for structured output)
- `format: "json"` — Ollama's JSON mode constrains output to valid JSON
- Environment variable `OLLAMA_URL` controls endpoint:
  - Development: `http://localhost:11434` (default)
  - Production (Docker): `http://ollama:11434`

**System prompt:**
```
You are a data extraction assistant for a job application tracker.
The user will provide either a job posting, a job listing URL's content, or a brief description of a position they want to apply to.

Your task: extract structured data and return it as a JSON object.

Required JSON fields:
- "jobName" (string): the job title or position name
- "companyName" (string): the company or organization name
- "companyWebpage" (string): company website URL starting with "https://"
- "applicationEmail" (string): email address to apply or that appeared in the listing
- "contactName" (string): name of the hiring manager or recruiter
- "contactPhone" (string): phone number of the contact
- "contactEmail" (string): contact person's email address
- "categories" (string[]): 1-5 relevant tags like "frontend", "remote", "react", "startup"

Rules:
1. Extract real data from the text whenever present.
2. For any field not found in the text, generate a plausible realistic value that fits the context. For example, if the company is "Google", generate a google.com email and URL.
3. If the input is too vague or nonsensical to extract anything, invent a complete realistic fake application.
4. Return ONLY the JSON object. No markdown fencing, no explanation, no extra text.
```

Note: `status` is always set to `"applied"` server-side, not by the model.

**Response parsing:**
1. Parse Ollama response JSON → extract `response` field (the model's text output)
2. Parse model output as JSON
3. Validate with a lenient Zod schema (`applicationGenerateSchema`) — all fields optional strings, categories optional array
4. Merge with defaults for any missing fields
5. On any failure (network error, invalid JSON, timeout): return a hardcoded fake application as fallback

**Lenient schema** (new file `app/lib/schemas/application-generate.schema.ts`):
```typescript
export const applicationGenerateSchema = z.object({
  jobName: z.string().optional().default("Software Engineer"),
  companyName: z.string().optional().default("Acme Corp"),
  companyWebpage: z.string().optional().default("https://example.com"),
  applicationEmail: z.string().optional().default("careers@example.com"),
  contactName: z.string().optional().default("Jane Doe"),
  contactPhone: z.string().optional().default("+1 555-0100"),
  contactEmail: z.string().optional().default("hr@example.com"),
  categories: z.array(z.string()).optional().default([]),
});
```

### Action Handler — `app/routes/dashboard/applications.tsx`

New intent `"generate"` in the existing action:

```typescript
if (intent === "generate") {
  const prompt = formData.get("prompt") as string;
  if (!prompt?.trim()) return { error: "Prompt cannot be empty" };
  
  const generated = await generateApplication(prompt);
  const session = await getSession(request);
  session.flash("generatedApplication", JSON.stringify(generated));
  
  return redirect("/dashboard/new", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}
```

### Pre-fill Loader — `app/routes/dashboard/new.tsx`

Loader reads flash data from session:

```typescript
const session = await getSession(request);
const flashData = session.get("generatedApplication");
const generatedDefaults = flashData ? JSON.parse(flashData) : null;

// Must return Response with Set-Cookie header to clear the flash
return Response.json(
  { allCategories, generatedDefaults },
  { headers: { "Set-Cookie": await commitSession(session) } }
);
```

Component passes `generatedDefaults` as `defaultValues` to `ApplicationForm`. Note: this changes the loader return from a plain object to a `Response`, which React Router v7 handles transparently.

### Session Flash Helpers

Export `getSession` and `commitSession` from `app/lib/auth.server.ts` (sessionStorage is already defined there, just not exported for flash use).

---

## Docker Compose

### New Services

```yaml
# Production — internal to Docker network, no port exposed
ollama:
  image: ollama/ollama
  container_name: apply-tude-ollama
  restart: unless-stopped
  entrypoint: ["/bin/sh", "-c", "ollama serve & sleep 5 && ollama pull gemma3:4b && wait"]
  volumes:
    - ollama-data:/root/.ollama
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:11434/api/tags"]
    interval: 15s
    timeout: 10s
    retries: 5
    start_period: 60s
  networks:
    - apply-tude-network

# Development — port exposed for local dev
ollama-dev:
  image: ollama/ollama
  container_name: apply-tude-ollama-dev
  restart: unless-stopped
  entrypoint: ["/bin/sh", "-c", "ollama serve & sleep 5 && ollama pull gemma3:4b && wait"]
  ports:
    - "11434:11434"
  volumes:
    - ollama-dev-data:/root/.ollama
```

### New Volumes

```yaml
volumes:
  ollama-data:
  ollama-dev-data:
```

### App Service Update

Add to `app` service environment:
```yaml
OLLAMA_URL: http://ollama:11434
```

Add to `app` service depends_on:
```yaml
ollama:
  condition: service_healthy
```

### Entrypoint Explanation

`ollama serve & sleep 5 && ollama pull gemma3:4b && wait`

1. Start Ollama server in background
2. Wait 5s for server to be ready
3. Pull gemma3:4b model (no-op if already pulled)
4. `wait` keeps container running (waits for background `ollama serve`)

Model is cached in the volume, so pull only downloads on first run.

---

## Environment Variables

Add to `.env.example`:
```
# Ollama API endpoint (default: http://localhost:11434 for local dev)
OLLAMA_URL=http://localhost:11434
```

`ollama.server.ts` reads `OLLAMA_URL` with fallback to `http://localhost:11434`.

---

## New Files

| File | Purpose |
|------|---------|
| `app/components/ui/dialog.tsx` | shadcn Dialog component (`npx shadcn@latest add dialog`) |
| `app/components/generate-application-dialog.tsx` | Generate dialog: textarea + submit, loading/error states |
| `app/components/generate-application-dialog.types.ts` | Props type for the dialog component |
| `app/lib/ollama.server.ts` | Ollama REST client, system prompt, response parsing, fallback |
| `app/lib/schemas/application-generate.schema.ts` | Lenient Zod schema for AI-generated output |

## Modified Files

| File | Change |
|------|--------|
| `app/routes/dashboard/applications.tsx` | Add Generate button + dialog trigger, `"generate"` intent in action |
| `app/routes/dashboard/new.tsx` | Loader reads session flash, passes as defaultValues |
| `app/lib/auth.server.ts` | Export `getSession` and `commitSession` helpers |
| `docker-compose.yaml` | Add ollama + ollama-dev services, volumes, app depends_on |
| `.env.example` | Add `OLLAMA_URL` |

---

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Ollama unreachable | Return fallback fake application, show toast/warning that AI was unavailable |
| Model returns invalid JSON | Parse what we can, fill rest with defaults from lenient schema |
| Model returns nonsense | Lenient schema defaults kick in → plausible fake application |
| Empty prompt | Generate button disabled client-side; server returns error if somehow empty |
| Timeout (>30s) | AbortController on fetch, return fallback |

---

## Verification

1. `docker compose up ollama-dev` — verify model pulls and API responds at `localhost:11434`
2. Navigate to `/dashboard/applications` — "Generate" button visible, left-aligned
3. Click Generate — dialog opens with textarea, Generate button disabled
4. Type text — Generate button enables
5. Paste job posting → click Generate — loading state shows, redirects to `/dashboard/new` with fields pre-filled
6. Paste vague text ("developer job") — still works, fills with plausible data
7. Submit empty → button stays disabled
8. Kill Ollama → try generate → fallback fake application loads in form
9. Full Docker compose up — verify app connects to ollama service via internal network
