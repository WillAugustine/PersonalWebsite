import { footerTemplate, navTemplate } from "../components/layout";
import { bugTypes, userStories } from "../data/agile";
import { navItems } from "../data/navigation";
import type { AgileTask, UserStory } from "../types";

export function renderAgileWorkboard(): string {
  return `
    ${navTemplate("/sprint")}
    <main class="content-page">
      <section class="page-intro">
        <p class="eyebrow">Agile Workboard</p>
        <h1>User stories, implementation tasks, and bug reporting.</h1>
        <p>
          This board breaks upcoming work into Agile-friendly slices. Public visitors can see planned work and report bugs; editing the board itself should stay behind a future authenticated admin workflow.
        </p>
      </section>

      <section class="section-block">
        <div class="section-heading">
          <p class="eyebrow">User Stories</p>
          <h2>Planned feature work.</h2>
        </div>
        <div class="grid stack">
          ${userStories.map(userStoryTemplate).join("")}
        </div>
      </section>

      <section class="section-block">
        <div class="section-heading">
          <p class="eyebrow">Bugs</p>
          <h2>Report a bug.</h2>
          <p>
            Share what happened, where it happened, and optional media. Uploads are limited to 3 files, 5 MB each, and 12 MB total.
          </p>
        </div>
        <fluent-card class="panel bug-report-card">
          <form id="bug-report-form" class="grid grid-2 bug-report-form" novalidate>
            <div class="form-field">
              <label for="bug-pages-summary">Which page(s)</label>
              <details class="checkbox-dropdown">
                <summary id="bug-pages-summary">Select one or more pages</summary>
                <div class="checkbox-options" aria-labelledby="bug-pages-summary">
                  ${navItems
                    .map(
                      (item) => `
                        <label>
                          <input type="checkbox" name="pages" value="${item.label}" />
                          <span>${item.label}</span>
                        </label>
                      `,
                    )
                    .join("")}
                </div>
              </details>
            </div>

            <div class="form-field">
              <label for="bug-type">Type of bug</label>
              <select id="bug-type" name="bugType" required>
                <option value="">Select a bug type</option>
                ${bugTypes.map((type) => `<option value="${type.value}">${type.label}</option>`).join("")}
              </select>
            </div>

            <div class="form-field">
              <label for="bug-media">Media upload</label>
              <input
                id="bug-media"
                name="media"
                type="file"
                accept="image/png,image/jpeg,image/webp,video/mp4,video/webm"
                multiple
              />
              <p class="field-help">Optional. Up to 3 screenshots or short videos. Max 5 MB each, 12 MB total.</p>
            </div>

            <div class="form-field">
              <label for="bug-email">Follow up email</label>
              <input
                id="bug-email"
                name="email"
                type="email"
                inputmode="email"
                autocomplete="email"
                maxlength="254"
                placeholder="name@example.com"
              />
            </div>

            <div class="form-field full-width">
              <label for="bug-more-info">More information</label>
              <textarea
                id="bug-more-info"
                name="moreInfo"
                maxlength="2000"
                rows="7"
                placeholder="Describe what happened, what you expected, and any steps to reproduce it."
                required
              ></textarea>
              <p class="field-help">Plain text only. HTML, scripts, and oversized submissions are rejected server-side.</p>
            </div>

            <div class="form-actions">
              <button class="action-button primary" type="submit">Submit Bug Report</button>
              <span id="bug-report-status" class="form-status" role="status" aria-live="polite"></span>
            </div>
          </form>
        </fluent-card>
      </section>
    </main>
    ${footerTemplate()}
  `;
}

function userStoryTemplate(story: UserStory): string {
  return `
    <fluent-card class="panel story-card">
      <div class="story-heading">
        <span>${story.id}</span>
        <h3>${story.title}</h3>
      </div>
      <p class="story-format">
        As a <strong>${story.persona}</strong>, I want to <strong>${story.goal}</strong>, so that <strong>${story.benefit}</strong>
      </p>
      <div class="story-columns">
        <div>
          <h4>Acceptance Criteria</h4>
          <ul>
            ${story.acceptanceCriteria.map((criterion) => `<li>${criterion}</li>`).join("")}
          </ul>
        </div>
        <div>
          <h4>Tasks</h4>
          <div class="task-list">
            ${story.tasks.map(taskTemplate).join("")}
          </div>
        </div>
      </div>
    </fluent-card>
  `;
}

function taskTemplate(task: AgileTask): string {
  return `
    <div class="task-item">
      <div>
        <span>${task.id}</span>
        <p>${task.title}</p>
      </div>
      <fluent-badge appearance="${task.status === "Done" ? "accent" : "filled"}">${task.status}</fluent-badge>
    </div>
  `;
}
