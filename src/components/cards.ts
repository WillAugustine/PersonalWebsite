import type { ExperienceItem, SkillGroup, WorkItem } from "../types";

export function workItemTemplate(item: WorkItem): string {
  const badgeAppearance = item.status === "In progress" ? "accent" : "filled";

  return `
    <fluent-card class="work-card">
      <div class="work-card-topline">
        <span>${item.id}</span>
        <fluent-badge appearance="${badgeAppearance}">${item.status}</fluent-badge>
      </div>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <span class="estimate">${item.estimate}</span>
    </fluent-card>
  `;
}

export function skillGroupTemplate(group: SkillGroup): string {
  return `
    <fluent-card class="skill-card">
      <h3>${group.label}</h3>
      <div class="tech-list compact">
        ${group.skills.map((skill) => `<fluent-badge appearance="filled">${skill}</fluent-badge>`).join("")}
      </div>
    </fluent-card>
  `;
}

export function experienceTemplate(item: ExperienceItem): string {
  return `
    <fluent-card class="experience-card">
      <div class="experience-heading">
        <div>
          <h2>${item.role}</h2>
          <p>${item.organization}</p>
        </div>
        <span>${item.period}</span>
      </div>
      <ul>
        ${item.bullets.map((bullet) => `<li>${bullet}</li>`).join("")}
      </ul>
    </fluent-card>
  `;
}
