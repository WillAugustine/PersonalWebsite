import type { ExperienceItem, SkillGroup } from "../types";

export const technologies = [
  "TypeScript",
  "JavaScript",
  "React",
  "Node.js",
  "C#",
  "Python",
  "C++",
  "SQL",
  "KQL",
  "Azure",
  "Azure DevOps",
  "Fluent UI",
  "Cosmos DB",
  "Kusto",
  "Jest",
  "Playwright",
  "GitHub",
  "CI/CD",
  "Automated Testing",
  "AI-assisted engineering",
  "Agile Scrum",
];

export const skillGroups: SkillGroup[] = [
  {
    label: "Languages & Web",
    skills: ["TypeScript", "JavaScript", "React", "Node.js", "HTML", "CSS", "C#", "Python", "C++", "SQL", "KQL"],
  },
  {
    label: "Front End & UX",
    skills: ["Fluent UI", "Component design", "REST API integration", "Accessibility", "Telemetry-driven UX", "Performance optimization"],
  },
  {
    label: "Back End, Data & Cloud",
    skills: [".NET/C# services", "REST patterns", "Cosmos DB", "Kusto", "SQLite", "Azure", "Azure DevOps", "ECS deployment rings"],
  },
  {
    label: "Testing & Reliability",
    skills: ["Jest", "Playwright", "qTest", "Unit testing", "Regression prevention", "On-call triage", "RCA"],
  },
  {
    label: "AI Engineering",
    skills: ["Microsoft Copilot", "GitHub Copilot", "Claude", "Codex workflows", "AI-assisted debugging", "Test generation", "PR summaries"],
  },
  {
    label: "Engineering Practices",
    skills: [
      "Production web applications",
      "Front-end architecture",
      "Service reliability",
      "Code reviews",
      "Agile Scrum",
      "User stories and estimates",
      "On-call support",
      "Technical debt reduction",
      "Stakeholder collaboration",
      "Technical one-pagers",
      "Implementation planning",
    ],
  },
];

export const experienceItems: ExperienceItem[] = [
  {
    role: "Software Engineer",
    organization: "Microsoft",
    period: "Jan 2024 - Present",
    bullets: [
      "Own the Outlook Quarantine front end within security.microsoft.com, a React and TypeScript experience in a large Microsoft Defender for Office 365 platform serving millions of daily users.",
      "Lead UX components, API integration, telemetry, accessibility, testing, and performance for customer-facing security workflows.",
      "Build Fluent UI and internal-component experiences that consume C#/.NET REST APIs backed by Cosmos DB and Kusto; contribute C# fixes for front-end related issues.",
      "Implemented support for quarantined password-protected attachments, including password-entry and view flows, API handoff, scan-state handling, and user-facing resolution states.",
      "Improve diagnostics and supportability with telemetry TagIds, KQL queries, and dashboards that track usage metrics, bugs, and escalation patterns.",
      "Reduce delivery and operational risk through front-end PR reviews, deployment ring validation, on-call triage, outage mitigation, customer escalation support, and root cause analysis.",
      "Use AI-assisted engineering tools for code generation, debugging, test creation, PR preparation and review, design planning, and user story breakdown while maintaining human validation.",
    ],
  },
  {
    role: "Software Engineering Intern",
    organization: "Microsoft",
    period: "Summer 2023",
    bullets: [
      "Identified a gap in automated coverage for a C# service and redirected internship work toward strengthening unit tests and regression protection.",
      "Expanded service-level test coverage to reduce redundant behavior, prevent future breakage, and improve confidence in release validation.",
    ],
  },
  {
    role: "Software Engineering Intern",
    organization: "Microsoft",
    period: "Summer 2022",
    bullets: [
      "Supported Azure capacity services in a Python-based environment.",
      "Wrote automated unit tests for cloud service logic to improve reliability and reduce regression risk during code changes.",
    ],
  },
  {
    role: "Teaching Assistant",
    organization: "Montana Technological University",
    period: "Throughout College",
    bullets: [
      "Supported Fundamentals of Programming and Data Structures & Algorithms courses for roughly 25-50 students.",
      "Taught Python, C++, debugging, data structures, algorithms, and Git/GitHub workflows; created a hands-on GitHub lab and graded technical assignments.",
    ],
  },
];
