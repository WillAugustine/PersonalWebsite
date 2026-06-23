import { projects } from "./projects";
import { experienceItems, skillGroups, technologies } from "./profile";

export const chatBotName = "W.I.L.L.";
export const chatBotExpansion = "Will-Informed Language Liaison";

export const chatKnowledge = [
  "Will Augustine is a software engineer based in Philadelphia, Pennsylvania.",
  "Will works at Microsoft and builds customer-facing production web experiences.",
  "Will is the lead engineer and product owner for the Outlook Quarantine page front end, a Microsoft Defender for Office 365 security experience.",
  "Will has Microsoft internship experience in C# service testing and Python-based Azure capacity services.",
  "Will was a teaching assistant at Montana Technological University for programming and data structures courses.",
  "Will is pursuing an MBA in Organizational Management with a Project Management focus at Eastern University, expected July 2027.",
  "Will earned a Bachelor of Science in Computer Science from Montana Technological University in December 2023, with minors in Business Administration, Statistics, Mathematics, and Data Science.",
  "Will's contact email is willaugustine64@outlook.com.",
  "Will's LinkedIn is https://www.linkedin.com/in/willaugustine64.",
  "Will's GitHub profile is https://github.com/WillAugustine.",
  "Will likes building useful web things, solving messy problems, travel, movies, and spending time with Amelia, Milo, and Otis.",
  `Core technologies: ${technologies.join(", ")}.`,
  ...skillGroups.map((group) => `${group.label}: ${group.skills.join(", ")}.`),
  ...experienceItems.flatMap((item) => [
    `${item.role}, ${item.organization}, ${item.period}.`,
    ...item.bullets.map((bullet) => `${item.organization}: ${bullet}`),
  ]),
  ...projects.flatMap((project) => [
    `${project.name} (${project.course}): ${project.summary}`,
    `Project technologies for ${project.name}: ${project.technologies.join(", ")}.`,
    `Project link for ${project.name}: ${project.url}.`,
    ...project.highlights.map((highlight) => `${project.name}: ${highlight}`),
  ]),
].join("\n");

