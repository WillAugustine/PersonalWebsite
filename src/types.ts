export type AppPath =
  | "/"
  | "/experience"
  | "/projects"
  | "/technologies"
  | "/sprint"
  | "/chat"
  | "/resume";

export type NavItem = {
  label: string;
  path: AppPath;
};

export type PageSummary = {
  eyebrow: string;
  title: string;
  body: string;
};

export type WorkItemStatus = "Ready" | "In progress" | "Backlog";

export type WorkItem = {
  id: string;
  status: WorkItemStatus;
  title: string;
  description: string;
  estimate: string;
};

export type ExperienceItem = {
  role: string;
  organization: string;
  period: string;
  bullets: string[];
};

export type SkillGroup = {
  label: string;
  skills: string[];
};
