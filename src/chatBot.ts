type ChatRole = "user" | "assistant";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

const maxMessagesToSend = 10;

export function bindChatBot(): void {
  const form = document.querySelector<HTMLFormElement>("#chat-form");
  const input = document.querySelector<HTMLTextAreaElement>("#chat-input");
  const thread = document.querySelector<HTMLElement>("#chat-thread");
  const status = document.querySelector<HTMLElement>("#chat-status");

  if (!form || !input || !thread || !status) {
    return;
  }

  const messages: ChatMessage[] = [];

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const content = input.value.trim();
    if (!content) {
      status.textContent = "Add a message first.";
      return;
    }

    const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    input.value = "";
    status.textContent = "";
    submitButton?.setAttribute("disabled", "true");

    const userMessage: ChatMessage = { role: "user", content };
    messages.push(userMessage);
    appendMessage(thread, userMessage);

    const pendingMessage = appendMessage(thread, {
      role: "assistant",
      content: "Thinking...",
    });
    pendingMessage.classList.add("pending");
    scrollThreadToLatest(thread);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messages.slice(-maxMessagesToSend),
        }),
      });
      const result = (await response.json()) as { message?: string; reply?: string; retryAfterSeconds?: number };

      if (!response.ok) {
        const suffix = result.retryAfterSeconds ? ` Try again in ${formatWait(result.retryAfterSeconds)}.` : "";
        throw new Error(`${result.message || "W.I.L.L. could not answer right now."}${suffix}`);
      }

      const reply = result.reply?.trim() || "I do not have enough approved information to answer that.";
      messages.push({ role: "assistant", content: reply });
      updateMessage(pendingMessage, reply);
    } catch (error) {
      updateMessage(
        pendingMessage,
        error instanceof Error ? error.message : "W.I.L.L. could not answer right now. Please try again later.",
      );
      pendingMessage.classList.add("error");
    } finally {
      pendingMessage.classList.remove("pending");
      submitButton?.removeAttribute("disabled");
      input.focus();
      scrollThreadToLatest(thread);
    }
  });
}

function appendMessage(thread: HTMLElement, message: ChatMessage): HTMLElement {
  const article = document.createElement("article");
  article.className = `chat-message ${message.role === "assistant" ? "bot" : "user"}`;

  const avatar = document.createElement("div");
  avatar.className = "chat-avatar";
  avatar.setAttribute("aria-hidden", "true");
  avatar.textContent = message.role === "assistant" ? "W" : "You";

  const bubble = document.createElement("div");
  bubble.className = "chat-bubble";

  const label = document.createElement("div");
  label.className = "chat-message-label";
  label.textContent = message.role === "assistant" ? "W.I.L.L. Bot" : "You";

  const content = document.createElement("div");
  content.className = "chat-message-content";
  renderMessageContent(content, message);

  bubble.appendChild(label);
  bubble.appendChild(content);
  article.appendChild(avatar);
  article.appendChild(bubble);
  thread.appendChild(article);

  return article;
}

function updateMessage(messageElement: HTMLElement, content: string): void {
  const contentElement = messageElement.querySelector<HTMLElement>(".chat-message-content");
  if (contentElement) {
    renderMessageContent(contentElement, {
      role: messageElement.classList.contains("bot") ? "assistant" : "user",
      content,
    });
  }
}

function renderMessageContent(container: HTMLElement, message: ChatMessage): void {
  container.textContent = "";

  if (message.role === "user") {
    const paragraph = document.createElement("p");
    paragraph.textContent = message.content;
    container.appendChild(paragraph);
    return;
  }

  container.appendChild(renderMarkdown(message.content));
}

function renderMarkdown(markdown: string): DocumentFragment {
  const fragment = document.createDocumentFragment();
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  let paragraphLines: string[] = [];
  let index = 0;

  const flushParagraph = (): void => {
    if (paragraphLines.length === 0) {
      return;
    }

    const paragraph = document.createElement("p");
    appendInlineMarkdown(paragraph, paragraphLines.join(" "));
    fragment.appendChild(paragraph);
    paragraphLines = [];
  };

  while (index < lines.length) {
    const line = lines[index].trim();

    if (!line) {
      flushParagraph();
      index += 1;
      continue;
    }

    const unorderedMatch = line.match(/^[-*]\s+(.+)$/);
    const orderedMatch = line.match(/^\d+\.\s+(.+)$/);

    if (unorderedMatch || orderedMatch) {
      flushParagraph();
      const list = document.createElement(orderedMatch ? "ol" : "ul");

      while (index < lines.length) {
        const currentLine = lines[index].trim();
        const itemMatch = orderedMatch ? currentLine.match(/^\d+\.\s+(.+)$/) : currentLine.match(/^[-*]\s+(.+)$/);
        if (!itemMatch) {
          break;
        }

        const item = document.createElement("li");
        appendInlineMarkdown(item, itemMatch[1]);
        list.appendChild(item);
        index += 1;
      }

      fragment.appendChild(list);
      continue;
    }

    paragraphLines.push(line);
    index += 1;
  }

  flushParagraph();
  return fragment;
}

function appendInlineMarkdown(parent: HTMLElement, text: string): void {
  const pattern = /(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\[[^\]]+\]\((?:https?:\/\/|mailto:)[^)]+\)|\*[^*]+\*|_[^_]+_)/g;
  let lastIndex = 0;

  for (const match of text.matchAll(pattern)) {
    const token = match[0];
    const index = match.index ?? 0;

    if (index > lastIndex) {
      parent.appendChild(document.createTextNode(text.slice(lastIndex, index)));
    }

    parent.appendChild(markdownTokenToNode(token));
    lastIndex = index + token.length;
  }

  if (lastIndex < text.length) {
    parent.appendChild(document.createTextNode(text.slice(lastIndex)));
  }
}

function markdownTokenToNode(token: string): Node {
  const linkMatch = token.match(/^\[([^\]]+)\]\(((?:https?:\/\/|mailto:)[^)]+)\)$/);
  if (linkMatch) {
    const anchor = document.createElement("a");
    anchor.textContent = linkMatch[1];
    anchor.href = linkMatch[2];
    anchor.target = "_blank";
    anchor.rel = "noreferrer";
    return anchor;
  }

  if (token.startsWith("**") || token.startsWith("__")) {
    const strong = document.createElement("strong");
    strong.textContent = token.slice(2, -2);
    return strong;
  }

  if (token.startsWith("`")) {
    const code = document.createElement("code");
    code.textContent = token.slice(1, -1);
    return code;
  }

  const emphasis = document.createElement("em");
  emphasis.textContent = token.slice(1, -1);
  return emphasis;
}

function scrollThreadToLatest(thread: HTMLElement): void {
  thread.scrollTo({ top: thread.scrollHeight, behavior: "smooth" });
}

function formatWait(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} seconds`;
  }

  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes === 1 ? "" : "s"}`;
}
