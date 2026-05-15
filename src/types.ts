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

export type AgileTaskStatus = "To do" | "In progress" | "Done";

export type AgileTask = {
  id: string;
  title: string;
  status: AgileTaskStatus;
  owner: string;
};

export type UserStory = {
  id: string;
  title: string;
  persona: string;
  goal: string;
  benefit: string;
  acceptanceCriteria: string[];
  tasks: AgileTask[];
};

export type BugType = {
  label: string;
  value: string;
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

export type TechnologyTier = {
  title: string;
  summary: string;
  technologies: string[];
  details: string[];
};

export type ComponentBreakdown = {
  name: string;
  status: "Live" | "Planned" | "In progress";
  purpose: string;
  tools: string[];
  notes: string[];
};

export type ProjectItem = {
  name: string;
  course: string;
  summary: string;
  url: string;
  technologies: string[];
  highlights: string[];
  status?: string;
};
