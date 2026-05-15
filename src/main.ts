import {
  fluentAnchor,
  fluentBadge,
  fluentButton,
  fluentCard,
  fluentDivider,
  provideFluentDesignSystem,
} from "@fluentui/web-components";
import { navItems } from "./data/navigation";
import { pageSummaries } from "./data/pages";
import { renderExperience } from "./pages/experience";
import { renderHome } from "./pages/home";
import { renderPlaceholder } from "./pages/placeholder";
import { renderResume } from "./pages/resume";
import type { AppPath } from "./types";
import "./styles.css";

provideFluentDesignSystem().register(
  fluentAnchor(),
  fluentBadge(),
  fluentButton(),
  fluentCard(),
  fluentDivider(),
);

const appRoot = document.querySelector<HTMLDivElement>("#app");

if (!appRoot) {
  throw new Error("App root element was not found.");
}

const app = appRoot;

function getCurrentPath(): AppPath {
  const path = window.location.pathname as AppPath;
  return navItems.some((item) => item.path === path) ? path : "/projects";
}

function route(): void {
  const path = getCurrentPath();

  if (path === "/") {
    app.innerHTML = renderHome();
  } else if (path === "/resume") {
    app.innerHTML = renderResume();
  } else if (path === "/experience") {
    app.innerHTML = renderExperience();
  } else {
    app.innerHTML = renderPlaceholder(path, pageSummaries[path]);
  }

  bindRoutes();
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
