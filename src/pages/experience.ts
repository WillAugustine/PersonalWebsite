import { experienceTemplate } from "../components/cards";
import { footerTemplate, navTemplate } from "../components/layout";
import { experienceItems } from "../data/profile";

export function renderExperience(): string {
  return `
    ${navTemplate("/experience")}
    <main class="content-page">
      <section class="page-intro">
        <p class="eyebrow">Experience</p>
        <h1>Production web engineering, product ownership, and teaching.</h1>
        <p>
          My work has centered on Microsoft production experiences, automated testing, service reliability, and making technical work understandable across product, UX, and engineering teams.
        </p>
      </section>
      <section class="timeline-section">
        ${experienceItems.map(experienceTemplate).join("")}
      </section>
    </main>
    ${footerTemplate()}
  `;
}
