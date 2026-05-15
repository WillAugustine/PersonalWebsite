import type { BugType, UserStory } from "../types";

export const userStories: UserStory[] = [
  {
    id: "US-CHAT-001",
    title: "Make the portfolio chatbot operational",
    persona: "site visitor",
    goal: "ask questions about Will's background, experience, projects, and skills",
    benefit: "I can quickly understand whether his experience matches what I am looking for.",
    acceptanceCriteria: [
      "The chatbot answers only from approved resume, experience, project, and website content.",
      "The browser never receives provider API keys or privileged prompt configuration.",
      "The chatbot communicates when it does not have enough information instead of inventing answers.",
      "The feature includes basic abuse controls such as request validation, rate limiting, and bounded input length.",
      "A failure state gives visitors a useful message without exposing stack traces or provider details.",
    ],
    tasks: [
      {
        id: "TASK-CHAT-001",
        title: "Create approved profile knowledge source for chatbot answers",
        status: "To do",
        owner: "Will",
      },
      {
        id: "TASK-CHAT-002",
        title: "Add Cloudflare Worker API endpoint for chat requests",
        status: "To do",
        owner: "Will",
      },
      {
        id: "TASK-CHAT-003",
        title: "Integrate AI provider from the Worker so secrets stay server-side",
        status: "To do",
        owner: "Will",
      },
      {
        id: "TASK-CHAT-004",
        title: "Build chat UI with loading, error, empty, and retry states",
        status: "To do",
        owner: "Will",
      },
      {
        id: "TASK-CHAT-005",
        title: "Add validation, rate limiting, and answer guardrails",
        status: "To do",
        owner: "Will",
      },
      {
        id: "TASK-CHAT-006",
        title: "Test chatbot responses against resume and project content",
        status: "To do",
        owner: "Will",
      },
    ],
  },
];

export const bugTypes: BugType[] = [
  { label: "Broken link", value: "broken-link" },
  { label: "Incorrect information", value: "incorrect-information" },
  { label: "Layout or visual issue", value: "layout-visual" },
  { label: "Mobile/responsive issue", value: "mobile-responsive" },
  { label: "Performance problem", value: "performance" },
  { label: "Accessibility issue", value: "accessibility" },
  { label: "Download or file problem", value: "download-file" },
  { label: "Form submission problem", value: "form-submission" },
  { label: "Security/privacy concern", value: "security-privacy" },
  { label: "Other", value: "other" },
];
