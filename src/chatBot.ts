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

  const text = document.createElement("p");
  text.textContent = message.content;

  bubble.appendChild(label);
  bubble.appendChild(text);
  article.appendChild(avatar);
  article.appendChild(bubble);
  thread.appendChild(article);

  return article;
}

function updateMessage(messageElement: HTMLElement, content: string): void {
  const text = messageElement.querySelector("p");
  if (text) {
    text.textContent = content;
  }
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
