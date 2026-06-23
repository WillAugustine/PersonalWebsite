import { experienceTemplate } from "../components/cards";
import { footerTemplate, navTemplate } from "../components/layout";
import { experienceItems } from "../data/profile";

export function renderExperience(): string {
  return `
    ${navTemplate("/experience")}
    <main class="content-page">
      <section class="page-intro">
        <p class="eyebrow">Experience</p>
        <h1>AI-assisted engineering, production UX, and customer-focused delivery.</h1>
        <p>
          My work centers on Outlook Quarantine front-end ownership, telemetry-informed decisions, automated testing, accessibility, reliability, and translating customer needs into shipped product improvements.
        </p>
      </section>
      <section class="section-block grid stack">
        ${experienceItems.map(experienceTemplate).join("")}
      </section>
    </main>
    ${footerTemplate()}
  `;
}
