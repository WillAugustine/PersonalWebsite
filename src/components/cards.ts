import type { ExperienceItem, SkillGroup } from "../types";

export function skillGroupTemplate(group: SkillGroup): string {
  return `
    <fluent-card class="panel">
      <h3>${group.label}</h3>
      <div class="tech-list compact">
        ${group.skills.map((skill) => `<fluent-badge appearance="filled">${skill}</fluent-badge>`).join("")}
      </div>
    </fluent-card>
  `;
}

export function experienceTemplate(item: ExperienceItem): string {
  return `
    <fluent-card class="panel experience-card">
      <div class="split-heading experience-heading">
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
