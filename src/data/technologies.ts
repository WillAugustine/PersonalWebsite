import type { ComponentBreakdown, TechnologyTier } from "../types";

export const technologyTiers: TechnologyTier[] = [
  {
    title: "Front End",
    summary: "The public website is a Vite-built TypeScript app with Fluent UI Web Components and a small client-side router.",
    technologies: ["TypeScript", "Vite", "Fluent UI Web Components", "HTML", "CSS", "Web Components"],
    details: [
      "TypeScript provides typed route, resume, technology, and work-item data so the site is easier to refactor safely.",
      "Vite handles local development and production bundling into the static `dist` output used by Cloudflare.",
      "Fluent UI Web Components provide the buttons, cards, badges, and dividers used throughout the interface.",
      "CSS custom properties define the green visual system, layout, responsive behavior, and page-specific sections.",
      "The app intentionally avoids a heavy UI framework for now so the portfolio stays small, fast, and inexpensive to host.",
    ],
  },
  {
    title: "Middle Tier",
    summary: "Cloudflare Worker routes power bug reporting, W.I.L.L. chat, rate limiting, missing-information notifications, and static asset delivery.",
    technologies: ["Cloudflare Workers", "Wrangler", "Static Assets", "SPA fallback routing", "Worker API routes", "Workers KV"],
    details: [
      "Wrangler deploys the site as a Cloudflare Worker with static assets served from the Vite `dist` directory.",
      "Worker static asset routing is configured with `not_found_handling: single-page-application` for routes such as `/resume` and `/experience`.",
      "The Worker exposes `/api/bug-report`, `/api/chat`, and a protected `/api/chat-health` diagnostic route.",
      "This tier protects API keys, validates requests, enforces chat rate limits, applies security headers, and avoids exposing privileged logic to browsers.",
    ],
  },
  {
    title: "Back End",
    summary: "The back end stays intentionally small: Worker secrets, KV chat throttling, Resend email, and source-controlled profile data cover the current needs.",
    technologies: ["Cloudflare global network", "GitHub repository", "Workers Builds", "Workers KV", "Resend", "OpenAI Responses API"],
    details: [
      "Cloudflare serves the production build globally with low operational overhead.",
      "GitHub is the source of truth for the codebase and triggers Cloudflare builds when changes are pushed.",
      "The resume PDF and browser icon are static assets copied into the deployed build.",
      "Workers KV stores short-lived per-connection chat counters, while approved chatbot knowledge remains source-controlled for reviewability.",
    ],
  },
];

export const componentBreakdowns: ComponentBreakdown[] = [
  {
    name: "Landing Page",
    status: "Live",
    purpose: "Introduce Will Augustine, summarize engineering focus areas, and provide clear paths into resume, projects, help, and W.I.L.L. chat.",
    tools: ["TypeScript", "Vite", "Fluent UI Web Components", "CSS", "Client-side routing"],
    notes: [
      "Built as the first page of the portfolio with a clean, image-free visual system.",
      "Uses shared navigation and footer components with page-specific TypeScript render modules.",
    ],
  },
  {
    name: "Resume Page",
    status: "Live",
    purpose: "Present resume content directly on the website while also linking to the downloadable PDF.",
    tools: ["TypeScript data models", "Fluent cards and badges", "Static PDF asset", "Responsive CSS"],
    notes: [
      "Resume details are stored as typed data and rendered into skill, experience, contact, and education sections.",
      "The PDF lives in `public/WillAugustine_Resume.pdf` and is copied into the production build.",
    ],
  },
  {
    name: "Experience Page",
    status: "Live",
    purpose: "Show role-by-role experience with a focus on production web engineering, Microsoft work, testing, and teaching.",
    tools: ["TypeScript", "Shared experience card component", "Resume-backed profile data"],
    notes: [
      "Uses the same source data as the Resume page so updates stay consistent.",
      "Highlights Microsoft Defender for Office 365, Outlook Quarantine, Azure service testing, and teaching experience.",
    ],
  },
  {
    name: "Help & Contact",
    status: "Live",
    purpose: "Give visitors a practical place for FAQs, contact links, bug reporting, and missing-information reports.",
    tools: ["Typed FAQ data", "Fluent cards", "Cloudflare Worker API", "Resend email API", "Server-side validation"],
    notes: [
      "The page points visitors to Tech Used, Chat, Resume, and direct contact paths.",
      "The existing bug-report flow now lives here instead of on a public Agile workboard.",
    ],
  },
  {
    name: "Bug Reporting",
    status: "Live",
    purpose: "Collect visitor bug reports with affected pages, bug type, optional media, follow-up email, and plain-text details.",
    tools: ["TypeScript form validation", "Cloudflare Worker API", "Multipart form data", "Resend email API", "Server-side validation"],
    notes: [
      "The browser validates required fields, file count, file type, and upload size before submission.",
      "The Worker repeats validation server-side, strips unsafe angle brackets from plain text, rejects HTML-like input, and sends the report by email when Resend secrets are configured.",
    ],
  },
  {
    name: "Chat Bot",
    status: "Live",
    purpose: "Allow visitors to ask questions about Will's background using approved resume, experience, and project content.",
    tools: ["TypeScript", "Cloudflare Worker API", "OpenAI Responses API", "Workers KV", "Profile content store"],
    notes: [
      "The browser calls a Worker endpoint rather than talking directly to the AI provider.",
      "The Worker keeps the API key private, constrains answers to approved profile data, formats safe Markdown, checks a KV-backed per-connection quota, and emails Will when approved knowledge is missing.",
    ],
  },
  {
    name: "AI Assistance",
    status: "Live",
    purpose: "Use Codex as an engineering assistant for scaffolding, refactoring, content extraction, deployment setup, and verification.",
    tools: ["Codex", "TypeScript", "PowerShell", "npm", "Vite", "Browser verification"],
    notes: [
      "Codex helped create the initial landing page, convert the project to TypeScript, configure Cloudflare Workers deployment, extract resume content, and split the code by page.",
      "Builds are verified with `npm run build`, and key routes are checked locally before deployment.",
    ],
  },
  {
    name: "Cloudflare Deployment",
    status: "Live",
    purpose: "Deploy the Vite build to william-augustine.com with low hosting overhead.",
    tools: ["Cloudflare Workers Builds", "Wrangler", "Node 22", "Vite `dist` output", "Custom domain"],
    notes: [
      "Wrangler deploys the compiled static assets from `dist`.",
      "The domain `william-augustine.com` is connected through Cloudflare after being purchased through Squarespace.",
    ],
  },
];
