# Personal Portfolio

Personal portfolio website for `william-augustine.com`, built with TypeScript, Vite, and Fluent UI Web Components.

## Run Locally

Install dependencies, then start the Vite dev server.

```powershell
npm install
npm run dev
```

Open the local URL that Vite prints, usually `http://localhost:5173`.

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
