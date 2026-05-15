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
    summary: "The live site does not yet need an application API, but the deployment path leaves room for Workers-based services.",
    technologies: ["Cloudflare Workers", "Wrangler", "Static Assets", "SPA fallback routing", "Future API routes"],
    details: [
      "Wrangler deploys the site as a Cloudflare Worker with static assets served from the Vite `dist` directory.",
      "Worker static asset routing is configured with `not_found_handling: single-page-application` for routes such as `/resume` and `/experience`.",
      "Future middle-tier routes can live beside the static site for features such as authenticated work-item editing or chatbot requests.",
      "This tier is the natural place to protect API keys, validate requests, enforce authentication, and avoid exposing privileged logic to browsers.",
    ],
  },
  {
    title: "Back End",
    summary: "The current back end is intentionally minimal: no database or server-side persistence is required for the first public version.",
    technologies: ["Cloudflare global network", "GitHub repository", "Workers Builds", "Future storage options"],
    details: [
      "Cloudflare serves the production build globally with low operational overhead.",
      "GitHub is the source of truth for the codebase and triggers Cloudflare builds when changes are pushed.",
      "The resume PDF and browser icon are static assets copied into the deployed build.",
      "When persistent features are added, likely options include Cloudflare D1 for relational data, KV for simple key-value content, or R2 for larger files.",
    ],
  },
];

export const componentBreakdowns: ComponentBreakdown[] = [
  {
    name: "Landing Page",
    status: "Live",
    purpose: "Introduce Will Augustine, summarize engineering focus areas, and provide clear paths into resume, projects, sprint planning, and future pages.",
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
    name: "Sprint Planning Board",
    status: "Live",
    purpose: "Expose a public roadmap of work items while reserving editing for a future authenticated workflow.",
    tools: ["Typed work-item data", "Fluent UI badges", "Static rendering", "Future Cloudflare Worker API"],
    notes: [
      "The current board is read-only and source-controlled.",
      "A future admin surface can add login, API validation, and persistent storage.",
    ],
  },
  {
    name: "Chat Bot",
    status: "Planned",
    purpose: "Allow visitors to ask questions about Will's background using approved resume, experience, and project content.",
    tools: ["TypeScript", "Cloudflare Worker API", "OpenAI API or Azure OpenAI", "Profile content store", "Future authentication/abuse controls"],
    notes: [
      "The browser should call a Worker endpoint rather than talking directly to an AI provider.",
      "The Worker can keep API keys private, constrain answers to approved profile data, and log lightweight usage metrics.",
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
