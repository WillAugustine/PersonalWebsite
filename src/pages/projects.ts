import { footerTemplate, navTemplate } from "../components/layout";
import { projects } from "../data/projects";
import type { ProjectItem } from "../types";

export function renderProjects(): string {
  return `
    ${navTemplate("/projects")}
    <main class="content-page">
      <section class="page-intro">
        <p class="eyebrow">Projects</p>
        <h1>Portfolio infrastructure, public labs, and early engineering work.</h1>
        <p>
          This section includes the public portfolio build and selected GitHub repositories from Montana Tech coursework. Together they show TypeScript, Cloudflare Workers, Git workflows, data structures, algorithms, and software engineering process.
        </p>
        <div class="hero-actions">
          <a class="action-button primary" href="https://github.com/WillAugustine" target="_blank" rel="noreferrer">View GitHub Profile</a>
          <a class="action-button secondary" href="/technologies" data-route>How I Made This Website</a>
        </div>
      </section>

      <section class="section-block">
        <div class="section-heading">
          <p class="eyebrow">GitHub Repositories</p>
          <h2>Selected public repos.</h2>
        </div>
        <div class="grid grid-2">
          ${projects.map(projectTemplate).join("")}
        </div>
      </section>
    </main>
    ${footerTemplate()}
  `;
}

function projectTemplate(project: ProjectItem): string {
  return `
    <fluent-card class="panel project-card">
      <div class="split-heading project-heading">
        <div>
          <span>${project.course}</span>
          <h3>${project.name}</h3>
        </div>
        ${project.status ? `<fluent-badge appearance="filled">${project.status}</fluent-badge>` : ""}
      </div>
      <p>${project.summary}</p>
      <div class="tech-list compact">
        ${project.technologies.map((technology) => `<fluent-badge appearance="filled">${technology}</fluent-badge>`).join("")}
      </div>
      <ul>
        ${project.highlights.map((highlight) => `<li>${highlight}</li>`).join("")}
      </ul>
      <a class="project-link" href="${project.url}" target="_blank" rel="noreferrer">Open GitHub repository</a>
    </fluent-card>
  `;
}
