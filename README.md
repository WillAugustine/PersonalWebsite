# Personal Portfolio

Personal portfolio website for `william-augustine.com`, built with TypeScript, Vite, and Fluent UI Web Components.

## Run Locally

Install dependencies, then start the Vite dev server for front-end-only work.

```powershell
npm install
npm run dev
```

Open the local URL that Vite prints, usually `http://localhost:5173`.

Routes under `/api/*` are Cloudflare Worker routes, so Vite alone will return `404` for them. To test the chat bot or bug-report API locally, build the static assets and run Wrangler instead:

```powershell
npm run dev:worker
```

Wrangler usually serves the Worker at `http://localhost:8787`. Use `http://localhost:8787/chat` when testing W.I.L.L. locally.

## Build

```powershell
npm run build
```

The production site is emitted to `dist/`.

## Cloudflare Workers Builds

Use these settings when connecting the GitHub repository to Cloudflare Workers Builds:

```txt
Framework preset: Vite
Build command: npm run build
Deploy command: npx wrangler deploy
Non-production branch deploy command: npx wrangler versions upload
Root directory: /
Node version: 22
```

## Bug Report Email

The Agile Workboard includes a bug-report form that posts to `/api/bug-report`. The Worker validates the submission, rejects unsafe text and oversized media, and sends the report through Resend.

Configure these Cloudflare Worker values before expecting live emails:

```txt
RESEND_API_KEY    Secret. Create this in Resend and add it as a Cloudflare Worker secret.
BUG_REPORT_FROM   Variable. A verified sender, such as bug-reports@william-augustine.com.
BUG_REPORT_TO     Variable. Optional; defaults to willaugustine64@outlook.com.
```

Suggested setup:

```powershell
npx wrangler secret put RESEND_API_KEY
```

Then add `BUG_REPORT_FROM` and `BUG_REPORT_TO` in the Cloudflare Worker dashboard under settings for variables/secrets. The sender domain must be verified with Resend.

## W.I.L.L. Chat Bot

The Chat page posts to `/api/chat`. The Worker labels the assistant as `W.I.L.L.` (`Will-Informed Language Liaison`), keeps the AI API key server-side, limits each response to approved portfolio knowledge, and checks a Workers KV quota before calling OpenAI.

Recommended low-cost settings:

```txt
OPENAI_API_KEY       Secret. Create this in OpenAI and add it as a Cloudflare Worker secret.
OPENAI_MODEL         Variable. Optional; defaults to gpt-5.4-nano for low-cost portfolio Q&A.
CHAT_MAX_MESSAGES    Variable. Optional; defaults to 6.
CHAT_WINDOW_SECONDS  Variable. Optional; defaults to 900.
CHAT_RATE_LIMIT      KV namespace binding used for per-connection chat caps.
CHAT_DEBUG_TOKEN     Secret. Optional; enables the protected `/api/chat-health` diagnostic route.
```

Create the secret:

```powershell
npx wrangler secret put OPENAI_API_KEY
```

Create a KV namespace:

```powershell
npx wrangler kv namespace create CHAT_RATE_LIMIT
```

Then add the returned namespace ID to `wrangler.jsonc`:

```jsonc
"kv_namespaces": [
  {
    "binding": "CHAT_RATE_LIMIT",
    "id": "paste-the-production-namespace-id-here"
  }
]
```

The code intentionally refuses to call OpenAI when the KV binding is missing, so a deployment mistake cannot bypass the chat cap.

For local Wrangler testing, create a `.dev.vars` file that is not committed:

```txt
OPENAI_API_KEY=your-local-openai-key
```

Do not add real secrets to `wrangler.jsonc` or any committed source file.

If production returns a generic `502`, use Cloudflare Worker logs first. The Worker logs OpenAI's sanitized status, error code, error type, error message, model, and request ID. For a direct diagnostic check, add a `CHAT_DEBUG_TOKEN` Worker secret, redeploy, and call:

```powershell
Invoke-WebRequest -Method Post `
  -Uri https://www.william-augustine.com/api/chat-health `
  -Headers @{ Authorization = "Bearer your-debug-token" } `
  -ContentType "application/json"
```

Remove or rotate `CHAT_DEBUG_TOKEN` after troubleshooting.

SPA fallback for short routes such as `/experience`, `/projects`, and `/resume` is configured in `wrangler.jsonc`:

```jsonc
{
  "assets": {
    "directory": "./dist/",
    "not_found_handling": "single-page-application"
  }
}
```

Do not add a Pages-style `_redirects` file when deploying through Workers Builds. Workers static assets handle SPA fallback through `assets.not_found_handling`.

## Domain

In Cloudflare Pages, add these custom domains to the project:

- `william-augustine.com`
- `www.william-augustine.com`

Recommended DNS approach:

1. Add `william-augustine.com` to Cloudflare.
2. Copy the nameservers Cloudflare assigns.
3. In Squarespace, replace the domain's nameservers with Cloudflare's nameservers.
4. In Cloudflare Pages, attach both custom domains.
5. Set the canonical redirect preference in Cloudflare so `www.william-augustine.com` redirects to `william-augustine.com`.

Alternative DNS approach:

Keep DNS in Squarespace and add the DNS records Cloudflare Pages gives you during custom-domain setup. This works, but Cloudflare-managed DNS is usually less overhead over time.

## Current Routes

- `/`
- `/experience`
- `/projects`
- `/technologies`
- `/sprint`
- `/chat`
- `/resume`

## Direction

The sprint board is public and read-only in this first version. The recommended next step is an authenticated admin page backed by an API so work items can be created, edited, reordered, and completed without exposing write access to visitors.
