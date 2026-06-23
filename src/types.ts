export type AppPath =
  | "/"
  | "/experience"
  | "/projects"
  | "/technologies"
  | "/chat"
  | "/help"
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
