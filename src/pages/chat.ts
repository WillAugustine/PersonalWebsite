import { footerTemplate, navTemplate } from "../components/layout";
import { chatInputMaxLength } from "../data/chatConfig";
import { chatBotExpansion, chatBotName } from "../data/chatKnowledge";

export function renderChat(): string {
  return `
    ${navTemplate("/chat")}
    <main class="chat-page">
      <section class="chat-hero">
        <div class="chat-heading">
          <p class="eyebrow">AI Bot</p>
          <h1>Chat with ${chatBotName}</h1>
          <p>${chatBotExpansion}</p>
        </div>
        <div class="bot-label" aria-label="${chatBotName} is an AI bot, not Will Augustine">
          <span>${chatBotName}</span>
          <small>AI bot, not Will</small>
        </div>
      </section>

      <section class="chat-section" aria-label="Chat with ${chatBotName}">
        <div class="chat-shell">
          <div class="chat-thread" id="chat-thread" aria-live="polite">
            <article class="chat-message bot">
              <div class="chat-avatar" aria-hidden="true">W</div>
              <div class="chat-bubble">
                <div class="chat-message-label">${chatBotName} Bot</div>
                <p>Hi, I am ${chatBotName}, an AI bot based on Will's approved portfolio content. Ask me about Will's work, projects, skills, or background.</p>
              </div>
            </article>
          </div>

          <form class="chat-composer" id="chat-form">
            <label class="sr-only" for="chat-input">Message ${chatBotName}</label>
            <textarea id="chat-input" name="message" rows="3" maxlength="${chatInputMaxLength}" placeholder="Ask about Will's experience, projects, or skills" aria-describedby="chat-character-count"></textarea>
            <div class="chat-actions">
              <div class="chat-feedback">
                <p class="chat-character-count" id="chat-character-count">0/${chatInputMaxLength} characters</p>
                <p class="chat-status" id="chat-status" role="status"></p>
              </div>
              <button class="action-button primary" type="submit">Send</button>
            </div>
          </form>
        </div>
      </section>
    </main>
    ${footerTemplate()}
  `;
}
