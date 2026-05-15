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
    body: "A transparent build log covering TypeScript, Fluent UI, cloud hosting, CI/CD, data modeling, and future backend choices.",
  },
  "/sprint": {
    eyebrow: "Sprint Planning",
    title: "Portfolio Work Items",
    body: "A public view of upcoming work, current priorities, and completed enhancements for the website.",
  },
  "/chat": {
    eyebrow: "Chat",
    title: "Ask About Me",
    body: "A future chatbot page that answers questions using approved resume, project, and experience content.",
  },
};
