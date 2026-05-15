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

## Cloudflare Pages

Use these Cloudflare Pages settings:

```txt
Framework preset: Vite
Build command: npm run build
Build output directory: dist
Root directory: /
Node version: 20
```

The SPA fallback for short routes such as `/experience`, `/projects`, and `/resume` lives in `public/_redirects`. Vite copies it into `dist/_redirects` during the production build.

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
