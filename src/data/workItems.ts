import type { WorkItem } from "../types";

export const workItems: WorkItem[] = [
  {
    id: "WEB-101",
    status: "Ready",
    title: "Publish landing page foundation",
    description: "Create the first public-facing page with clean routing, visual identity, and portfolio sections.",
    estimate: "3 pts",
  },
  {
    id: "WEB-114",
    status: "In progress",
    title: "Shape experience timeline",
    description: "Draft the work experience page around outcomes, responsibilities, and technologies used.",
    estimate: "5 pts",
  },
  {
    id: "WEB-128",
    status: "Backlog",
    title: "Design portfolio chatbot",
    description: "Plan a secure profile-aware assistant that can answer questions from approved personal content.",
    estimate: "8 pts",
  },
];
