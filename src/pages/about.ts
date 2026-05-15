import { workItemTemplate } from "../components/cards";
import { footerTemplate, navTemplate } from "../components/layout";
import { navItems } from "../data/navigation";
import { technologies } from "../data/profile";
import { workItems } from "../data/workItems";

export function renderAbout(): string {
  return `
    ${navTemplate("/")}
    <main>
      <section class="hero">
        <div class="hero-media" aria-hidden="true"></div>
        <div class="hero-overlay" aria-hidden="true"></div>
        <div class="hero-content">
          <p class="eyebrow">Microsoft engineer | React | TypeScript | Azure</p>
          <h1>Building reliable web experiences for production teams.</h1>
          <p class="hero-copy">
            I am a software engineer with Microsoft experience building and supporting customer-facing web applications, with a focus on usability, reliability, automated testing, and Agile delivery.
          </p>
          <div class="hero-actions">
            <fluent-button appearance="accent" href="/projects" data-route>View Projects</fluent-button>
            <fluent-button appearance="outline" href="/resume" data-route>Resume</fluent-button>
          </div>
        </div>
      </section>

      <section class="intro-section">
        <div class="section-heading">
          <p class="eyebrow">Focus</p>
          <h2>Practical engineering shaped by production work.</h2>
        </div>
        <div class="intro-grid">
          <fluent-card class="focus-card">
            <span class="card-kicker">Frontend</span>
            <h3>React and TypeScript</h3>
            <p>Customer-facing web features, front-end architecture, UI/UX tradeoffs, and maintainable component-driven delivery.</p>
          </fluent-card>
          <fluent-card class="focus-card">
            <span class="card-kicker">Cloud</span>
            <h3>Azure and service reliability</h3>
            <p>Azure capacity service experience, cloud service testing, incident coordination, on-call support, and regression-risk reduction.</p>
          </fluent-card>
          <fluent-card class="focus-card">
            <span class="card-kicker">Delivery</span>
            <h3>Agile and CI/CD</h3>
            <p>User stories, estimates, code reviews, cross-functional collaboration, Azure DevOps, and release discipline.</p>
          </fluent-card>
        </div>
      </section>

      <section class="tech-section">
        <div class="section-heading">
          <p class="eyebrow">Technology Map</p>
          <h2>The tools and practices I use most often.</h2>
        </div>
        <div class="tech-list">
          ${technologies.map((tech) => `<fluent-badge appearance="filled">${tech}</fluent-badge>`).join("")}
        </div>
      </section>

      <section class="sprint-section">
        <div class="section-heading">
          <p class="eyebrow">Sprint Planning</p>
          <h2>Public roadmap, private editing.</h2>
          <p>
            Visitors should be able to view portfolio work items, while create, edit, and update actions should live behind an authenticated admin experience backed by an API.
          </p>
        </div>
        <div class="sprint-layout">
          <div class="work-items">
            ${workItems.map(workItemTemplate).join("")}
          </div>
          <aside class="decision-panel">
            <h3>Recommended editing model</h3>
            <p>
              Keep this board read-only for visitors. Add a login-protected admin page later so you can manage work items in the frontend, with the backend enforcing permissions and persisting the data.
            </p>
            <fluent-divider></fluent-divider>
            <ul>
              <li>Public users: view roadmap and status.</li>
              <li>You: create, update, reorder, and close items after login.</li>
              <li>Backend: own validation, authorization, audit fields, and storage.</li>
            </ul>
          </aside>
        </div>
      </section>

      <section class="next-pages">
        <div class="section-heading">
          <p class="eyebrow">Next Pages</p>
          <h2>Short routes are ready for the rest of the site.</h2>
        </div>
        <div class="page-link-grid">
          ${navItems
            .filter((item) => item.path !== "/")
            .map(
              (item) => `
                <a class="page-link" href="${item.path}" data-route>
                  <span>${item.label}</span>
                  <small>${item.path}</small>
                </a>
              `,
            )
            .join("")}
        </div>
      </section>
    </main>
    ${footerTemplate()}
  `;
}
