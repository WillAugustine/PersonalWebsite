import { footerTemplate, navTemplate } from "../components/layout";
import { bugTypes } from "../data/help";
import { navItems } from "../data/navigation";

const faqs = [
  {
    question: "What technology was used in this website?",
    answer: 'The short version: TypeScript, Vite, Fluent UI Web Components, Cloudflare Workers, Workers KV, Resend, and the OpenAI Responses API. The full breakdown lives on the <a href="/technologies" data-route>Tech Used</a> page.',
  },
  {
    question: "How can I learn more about Will?",
    answer: 'The fastest way is to ask <a href="/chat" data-route>W.I.L.L.</a>, the portfolio bot. You can also read the <a href="/" data-route>About</a>, <a href="/experience" data-route>Experience</a>, and <a href="/resume" data-route>Resume</a> pages.',
  },
  {
    question: "How can I contact Will?",
    answer: 'Email <a href="mailto:willaugustine64@outlook.com">willaugustine64@outlook.com</a>, call <a href="tel:+12068501133">(206) 850-1133</a>, or connect on <a href="https://www.linkedin.com/in/willaugustine64" target="_blank" rel="noreferrer">LinkedIn</a>.',
  },
  {
    question: "Where can I download Will's resume?",
    answer: 'Use the download button on the <a href="/resume" data-route>Resume</a> page, or download it directly from <a href="/WillAugustine_Resume.pdf" download>this PDF link</a>.',
  },
  {
    question: "What should I do if W.I.L.L. does not know an answer?",
    answer: "If the question is about Will and W.I.L.L. does not have approved information yet, the bot automatically lets Will know there is a knowledge gap. You can also submit the details below as a missing-information report.",
  },
];

export function renderHelp(): string {
  return `
    ${navTemplate("/help")}
    <main class="content-page">
      <section class="page-intro">
        <p class="eyebrow">Help</p>
        <h1>Contact, FAQs, and bug reporting.</h1>
        <p>
          Find the right page, contact Will, or report an issue with the portfolio. If something is wrong, unclear, missing, or broken, this is the place to send it.
        </p>
      </section>

      <section class="section-block">
        <div class="section-heading">
          <p class="eyebrow">FAQs</p>
          <h2>Quick answers.</h2>
        </div>
        <div class="grid grid-2">
          ${faqs.map(faqTemplate).join("")}
        </div>
      </section>

      <section class="section-block">
        <div class="section-heading">
          <p class="eyebrow">Report</p>
          <h2>Report a bug or missing information.</h2>
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
              <label for="bug-type">Type of report</label>
              <select id="bug-type" name="bugType" required>
                <option value="">Select a report type</option>
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
              <button class="action-button primary" type="submit">Submit Report</button>
              <span id="bug-report-status" class="form-status" role="status" aria-live="polite"></span>
            </div>
          </form>
        </fluent-card>
      </section>
    </main>
    ${footerTemplate()}
  `;
}

function faqTemplate(faq: { question: string; answer: string }): string {
  return `
    <fluent-card class="panel faq-card">
      <h3>${faq.question}</h3>
      <p>${faq.answer}</p>
    </fluent-card>
  `;
}

