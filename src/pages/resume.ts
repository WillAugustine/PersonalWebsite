import { experienceTemplate, skillGroupTemplate } from "../components/cards";
import { footerTemplate, navTemplate } from "../components/layout";
import { experienceItems, skillGroups } from "../data/profile";

export function renderResume(): string {
  return `
    ${navTemplate("/resume")}
    <main class="content-page">
      <section class="resume-hero">
        <div>
          <p class="eyebrow">Resume</p>
          <h1>Will Augustine</h1>
          <p>
            Mid-level software engineer with Microsoft experience building and supporting production, customer-facing web applications.
          </p>
          <div class="resume-actions">
            <a class="action-button primary" href="/WillAugustine_Resume.pdf" download>Download PDF Resume</a>
            <a class="action-button secondary" href="mailto:willaugustine64@outlook.com">Email Me</a>
          </div>
        </div>
        <fluent-card class="contact-card">
          <h2>Contact</h2>
          <a href="mailto:willaugustine64@outlook.com">willaugustine64@outlook.com</a>
          <a href="tel:+12068501133">(206) 850-1133</a>
          <a href="https://www.linkedin.com/in/willaugustine64" target="_blank" rel="noreferrer">linkedin.com/in/willaugustine64</a>
          <span>Philadelphia, Pennsylvania</span>
        </fluent-card>
      </section>

      <section class="resume-section">
        <div class="section-heading">
          <p class="eyebrow">Technical Skills</p>
          <h2>Tools, languages, and practices.</h2>
        </div>
        <div class="skill-group-grid">
          ${skillGroups.map(skillGroupTemplate).join("")}
        </div>
      </section>

      <section class="resume-section">
        <div class="section-heading">
          <p class="eyebrow">Experience</p>
          <h2>Recent roles.</h2>
        </div>
        <div class="resume-timeline">
          ${experienceItems.map(experienceTemplate).join("")}
        </div>
      </section>

      <section class="resume-section">
        <div class="section-heading">
          <p class="eyebrow">Education</p>
          <h2>Academic background.</h2>
        </div>
        <div class="education-grid">
          <fluent-card class="education-card">
            <h3>Eastern University</h3>
            <p>Master of Business Administration, Organizational Management with a focus in Project Management</p>
            <span>Expected Jul 2027</span>
          </fluent-card>
          <fluent-card class="education-card">
            <h3>Montana Technological University</h3>
            <p>Bachelor of Science in Computer Science. Minors in Business Administration, Statistics, Mathematics, and Data Science.</p>
            <span>Dec 2023</span>
          </fluent-card>
        </div>
      </section>
    </main>
    ${footerTemplate()}
  `;
}
