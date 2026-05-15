import { footerTemplate, navTemplate } from "../components/layout";
import type { AppPath, PageSummary } from "../types";

export function renderPlaceholder(path: AppPath, page: PageSummary): string {
  return `
    ${navTemplate(path)}
    <main class="simple-page">
      <section class="page-hero">
        <p class="eyebrow">${page.eyebrow}</p>
        <h1>${page.title}</h1>
        <p>${page.body}</p>
        <fluent-button appearance="accent" href="/" data-route>Back to About</fluent-button>
      </section>
    </main>
    ${footerTemplate()}
  `;
}
