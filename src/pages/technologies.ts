import { footerTemplate, navTemplate } from "../components/layout";
import { componentBreakdowns, technologyTiers } from "../data/technologies";
import type { ComponentBreakdown, TechnologyTier } from "../types";

export function renderTechnologies(): string {
  return `
    ${navTemplate("/technologies")}
    <main class="content-page">
      <section class="page-intro">
        <p class="eyebrow">Technologies</p>
        <h1>How this website is built and operated.</h1>
        <p>
          This portfolio is a TypeScript front end deployed through Cloudflare Workers with Worker API routes for bug reporting, W.I.L.L. chat, rate limiting, secure AI calls, and automated notifications.
        </p>
      </section>

      <section class="section-block">
        <div class="section-heading">
          <p class="eyebrow">Architecture</p>
          <h2>Front end, middle tier, and back end.</h2>
        </div>
        <div class="grid grid-3">
          ${technologyTiers.map(technologyTierTemplate).join("")}
        </div>
      </section>

      <section class="section-block">
        <div class="section-heading">
          <p class="eyebrow">Component Breakdown</p>
          <h2>Features, tools, and implementation notes.</h2>
          <p>
            This section tracks what powers each major part of the website, including the live API routes, static assets, security controls, and AI-backed chatbot.
          </p>
        </div>
        <div class="grid grid-2">
          ${componentBreakdowns.map(componentBreakdownTemplate).join("")}
        </div>
      </section>
    </main>
    ${footerTemplate()}
  `;
}

function technologyTierTemplate(tier: TechnologyTier): string {
  return `
    <fluent-card class="panel detail-card">
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
    <fluent-card class="panel detail-card">
      <div class="split-heading detail-heading">
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
