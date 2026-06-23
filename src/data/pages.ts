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
    eyebrow: "Agile Workboard",
    title: "User Stories, Tasks, and Bugs",
    body: "A public workboard for planned portfolio improvements, implementation tasks, and bug reporting.",
  },
  "/chat": {
    eyebrow: "AI Bot",
    title: "Chat With W.I.L.L.",
    body: "A portfolio chatbot that answers from approved resume, project, and experience content.",
  },
};
