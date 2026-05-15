import { navItems } from "../data/navigation";
import type { AppPath } from "../types";

export function navTemplate(currentPath: AppPath): string {
  return `
    <header class="site-header">
      <a class="brand" href="/" data-route>
        <span class="brand-mark">WA</span>
        <span>Will Augustine</span>
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

export function footerTemplate(): string {
  return `
    <footer class="site-footer">
      <span>Will Augustine's Portfolio</span>
      <span>All information on this site is true and accurate.</span>
    </footer>
  `;
}
