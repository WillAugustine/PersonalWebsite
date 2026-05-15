import {
  fluentAnchor,
  fluentBadge,
  fluentButton,
  fluentCard,
  fluentDivider,
  provideFluentDesignSystem,
} from "@fluentui/web-components";
import "./styles.css";

provideFluentDesignSystem().register(
  fluentAnchor(),
  fluentBadge(),
  fluentButton(),
  fluentCard(),
  fluentDivider(),
);

type NavItem = {
  label: string;
  path: AppPath;
};

type AppPath =
  | "/"
  | "/experience"
  | "/projects"
  | "/technologies"
  | "/sprint"
  | "/chat"
  | "/resume";

type PageSummary = {
  eyebrow: string;
  title: string;
  body: string;
};

type WorkItemStatus = "Ready" | "In progress" | "Backlog";

type WorkItem = {
  id: string;
  status: WorkItemStatus;
  title: string;
  description: string;
  estimate: string;
};

const appRoot = document.querySelector<HTMLDivElement>("#app");

if (!appRoot) {
  throw new Error("App root element was not found.");
}

const app = appRoot;

const navItems: NavItem[] = [
  { label: "Home", path: "/" },
  { label: "Experience", path: "/experience" },
  { label: "Projects", path: "/projects" },
  { label: "Tech", path: "/technologies" },
  { label: "Sprint", path: "/sprint" },
  { label: "Chat", path: "/chat" },
  { label: "Resume", path: "/resume" },
];

const technologies = [
  "Java",
  "T-SQL",
  "Azure",
  "AWS",
  "GCP",
  "TypeScript",
  "CI/CD",
  "Data Modeling",
  "Full Stack",
  "Agile",
];

const workItems: WorkItem[] = [
  {
    id: "WEB-101",
    status: "Ready",
    title: "Publish landing page foundation",
    description: "Create the first public-facing page with clean routing, visual identity, and portfolio sections.",
    estimate: "3 pts",
  },
  {
    id: "WEB-114",
    status: "In progress",
    title: "Shape experience timeline",
    description: "Draft the work experience page around outcomes, responsibilities, and technologies used.",
    estimate: "5 pts",
  },
  {
    id: "WEB-128",
    status: "Backlog",
    title: "Design portfolio chatbot",
    description: "Plan a secure profile-aware assistant that can answer questions from approved personal content.",
    estimate: "8 pts",
  },
];

const pageSummaries: Record<Exclude<AppPath, "/">, PageSummary> = {
  "/experience": {
    eyebrow: "Experience",
    title: "Work History",
    body: "A dedicated page for roles, accomplishments, delivery context, and the technology behind each chapter.",
  },
  "/projects": {
    eyebrow: "Projects",
    title: "Selected Work",
    body: "A project gallery for case studies, architecture notes, demos, repositories, and implementation details.",
  },
  "/technologies": {
    eyebrow: "Technologies",
    title: "How This Site Is Built",
    body: "A transparent build log covering TypeScript, Fluent UI, cloud hosting, CI/CD, data modeling, and future backend choices.",
  },
  "/sprint": {
    eyebrow: "Sprint Planning",
    title: "Portfolio Work Items",
    body: "A public view of upcoming work, current priorities, and completed enhancements for the website.",
  },
  "/chat": {
    eyebrow: "Chat",
    title: "Ask About Me",
    body: "A future chatbot page that answers questions using approved resume, project, and experience content.",
  },
  "/resume": {
    eyebrow: "Resume",
    title: "Resume",
    body: "A concise resume page with downloadable formats, highlights, and links to relevant project evidence.",
  },
};

function getCurrentPath(): AppPath {
  const path = window.location.pathname as AppPath;
  return navItems.some((item) => item.path === path) ? path : "/projects";
}

function route(): void {
  const path = getCurrentPath();

  if (path === "/") {
    renderLanding();
    return;
  }

  renderPlaceholder(pageSummaries[path]);
}

function navTemplate(): string {
  const currentPath = getCurrentPath();

  return `
    <header class="site-header">
      <a class="brand" href="/" data-route>
        <span class="brand-mark">WA</span>
        <span>Will A.</span>
      </a>
      <nav class="nav-links" aria-label="Main navigation">
        ${navItems
          .map(
            (item) => `
              <a href="${item.path}" data-route class="${currentPath === item.path ? "active" : ""}">
                ${item.label}
              </a>
            `,
          )
          .join("")}
      </nav>
    </header>
  `;
}

function renderLanding(): void {
  app.innerHTML = `
    ${navTemplate()}
    <main>
      <section class="hero">
        <div class="hero-media" aria-hidden="true"></div>
        <div class="hero-overlay" aria-hidden="true"></div>
        <div class="hero-content">
          <p class="eyebrow">Full stack engineering | Cloud | Data | Delivery</p>
          <h1>Building dependable software from model to production.</h1>
          <p class="hero-copy">
            I work across application engineering, data design, cloud platforms, and delivery systems to turn complex ideas into useful products.
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
          <h2>Practical engineering with a broad technical base.</h2>
        </div>
        <div class="intro-grid">
          <fluent-card class="focus-card">
            <span class="card-kicker">Backend</span>
            <h3>Java and T-SQL</h3>
            <p>Service logic, relational data design, stored procedures, query tuning, and dependable application boundaries.</p>
          </fluent-card>
          <fluent-card class="focus-card">
            <span class="card-kicker">Cloud</span>
            <h3>Azure, AWS, and GCP</h3>
            <p>Cloud-aware architecture, deployment planning, managed services, and future-ready hosting decisions.</p>
          </fluent-card>
          <fluent-card class="focus-card">
            <span class="card-kicker">Delivery</span>
            <h3>Agile and CI/CD</h3>
            <p>Iterative planning, visible work items, release discipline, and pipelines that support steady improvement.</p>
          </fluent-card>
        </div>
      </section>

      <section class="tech-section">
        <div class="section-heading">
          <p class="eyebrow">Technology Map</p>
          <h2>A portfolio that can grow into a full stack system.</h2>
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

  bindRoutes();
}

function workItemTemplate(item: WorkItem): string {
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

function renderPlaceholder(page: PageSummary): void {
  app.innerHTML = `
    ${navTemplate()}
    <main class="simple-page">
      <section class="page-hero">
        <p class="eyebrow">${page.eyebrow}</p>
        <h1>${page.title}</h1>
        <p>${page.body}</p>
        <fluent-button appearance="accent" href="/" data-route>Back Home</fluent-button>
      </section>
    </main>
    ${footerTemplate()}
  `;

  bindRoutes();
}

function footerTemplate(): string {
  return `
    <footer class="site-footer">
      <span>Will Augustine's Portfolio</span>
      <span>All information on this site is true and accurate.</span>
    </footer>
  `;
}

function bindRoutes(): void {
  document.querySelectorAll<HTMLElement>("[data-route]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("http")) {
        return;
      }

      event.preventDefault();
      history.pushState({}, "", href);
      route();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

window.addEventListener("popstate", route);
route();
