import type { AppPath, PageSummary } from "../types";

export const pageSummaries: Record<Exclude<AppPath, "/" | "/experience" | "/resume">, PageSummary> = {
  "/projects": {
    eyebrow: "Projects",
    title: "Selected Work",
    body: "A project gallery for case studies, architecture notes, demos, repositories, and implementation details.",
  },
  "/technologies": {
    eyebrow: "Technologies",
    title: "How This Site Is Built",
    body: "A transparent build log covering TypeScript, Fluent UI, Cloudflare Workers, Worker API routes, AI integration, rate limiting, and security controls.",
  },
  "/chat": {
    eyebrow: "AI Bot",
    title: "Chat With W.I.L.L.",
    body: "A portfolio chatbot that answers from approved resume, project, and experience content.",
  },
  "/help": {
    eyebrow: "Help",
    title: "Contact, FAQs, and Reports",
    body: "A help page for common questions, contact paths, bug reports, and missing-information reports.",
  },
};
