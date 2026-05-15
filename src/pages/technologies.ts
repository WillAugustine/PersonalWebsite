import { footerTemplate, navTemplate } from "../components/layout";
import { componentBreakdowns, technologyTiers } from "../data/technologies";
import type { ComponentBreakdown, TechnologyTier } from "../types";

export function renderTechnologies(): string {
  return `
    ${navTemplate("/technologies")}
    <main class="content-page">
      <section class="page-intro">
        <p class="eyebrow">Technologies</p>
        <h1>How this website is built and where it is going.</h1>
        <p>
          This portfolio is intentionally lightweight today: a TypeScript front end deployed through Cloudflare Workers with room to add APIs, storage, authentication, and AI-backed features as the site grows.
        </p>
      </section>

      <section class="architecture-section">
        <div class="section-heading">
          <p class="eyebrow">Architecture</p>
          <h2>Front end, middle tier, and back end.</h2>
        </div>
        <div class="architecture-grid">
          ${technologyTiers.map(technologyTierTemplate).join("")}
        </div>
      </section>

      <section class="component-breakdown-section">
        <div class="section-heading">
          <p class="eyebrow">Component Breakdown</p>
          <h2>Features, tools, and implementation notes.</h2>
          <p>
            This section tracks what powers each major part of the website, including planned components that will eventually introduce API and storage layers.
          </p>
        </div>
        <div class="component-grid">
          ${componentBreakdowns.map(componentBreakdownTemplate).join("")}
        </div>
      </section>
    </main>
    ${footerTemplate()}
  `;
}

function technologyTierTemplate(tier: TechnologyTier): string {
  return `
    <fluent-card class="architecture-card">
      <h3>${tier.title}</h3>
      <p>${tier.summary}</p>
      <div class="tech-list compact">
        ${tier.technologies.map((technology) => `<fluent-badge appearance="filled">${technology}</fluent-badge>`).join("")}
      </div>
      <ul>
        ${tier.details.map((detail) => `<li>${detail}</li>`).join("")}
      </ul>
    </fluent-card>
  `;
}

function componentBreakdownTemplate(component: ComponentBreakdown): string {
  const statusAppearance = component.status === "Live" ? "accent" : "filled";

  return `
    <fluent-card class="component-card">
      <div class="component-card-heading">
        <h3>${component.name}</h3>
        <fluent-badge appearance="${statusAppearance}">${component.status}</fluent-badge>
      </div>
      <p>${component.purpose}</p>
      <div class="tech-list compact">
        ${component.tools.map((tool) => `<fluent-badge appearance="filled">${tool}</fluent-badge>`).join("")}
      </div>
      <ul>
        ${component.notes.map((note) => `<li>${note}</li>`).join("")}
      </ul>
    </fluent-card>
  `;
}
