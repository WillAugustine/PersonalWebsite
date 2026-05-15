import type { ExperienceItem, SkillGroup } from "../types";

export const technologies = [
  "TypeScript",
  "JavaScript",
  "React",
  "C#",
  "Python",
  "C++",
  "Azure",
  "Azure DevOps",
  "GitHub",
  "CI/CD",
  "Automated Testing",
  "Agile Scrum",
];

export const skillGroups: SkillGroup[] = [
  {
    label: "Languages & Web",
    skills: ["TypeScript", "JavaScript", "React", "HTML", "CSS", "C#", "Python", "C++"],
  },
  {
    label: "Cloud & Tools",
    skills: ["Azure", "Azure DevOps", "Git", "GitHub", "Visual Studio", "Visual Studio Code", "CI/CD workflows"],
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
    ],
  },
];

export const experienceItems: ExperienceItem[] = [
  {
    role: "Software Engineer",
    organization: "Microsoft",
    period: "Jan 2024 - Present",
    bullets: [
      "Lead engineer and product owner for the Outlook Quarantine page front end, owning UI/UX direction for a production security experience within Microsoft Defender for Office 365.",
      "Build, maintain, and support customer-facing web features using React, TypeScript, C#, Git, Azure DevOps, Visual Studio, and Visual Studio Code.",
      "Partner with product, UX, and engineering teams to scope features, evaluate tradeoffs, write user stories, estimate work, and release improvements through Agile Scrum.",
      "Review code and coordinate implementation across teams, including knowledge sharing with an international engineering group.",
      "Contribute to service quality through debugging, on-call support, incident coordination, and engineering improvements that reduce regression risk.",
    ],
  },
  {
    role: "Software Engineering Intern",
    organization: "Microsoft",
    period: "Summer 2023",
    bullets: [
      "Identified a gap in automated coverage for a C# service and redirected internship work toward strengthening unit tests and regression protection.",
      "Expanded service-level test coverage to reduce redundant behavior, prevent breakage, and improve release confidence.",
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
      "Taught Python, C++, debugging, and core software engineering concepts; created a GitHub lab to help students learn version control.",
    ],
  },
];
