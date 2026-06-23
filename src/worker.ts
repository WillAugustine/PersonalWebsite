/// <reference types="@cloudflare/workers-types" />

import { Resend } from "resend";
import { chatBotExpansion, chatBotName, chatKnowledge } from "./data/chatKnowledge";

type Env = {
  ASSETS: Fetcher;
  RESEND_API_KEY?: string;
  BUG_REPORT_FROM?: string;
  BUG_REPORT_TO?: string;
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
  CHAT_MAX_MESSAGES?: string;
  CHAT_WINDOW_SECONDS?: string;
  CHAT_DEBUG_TOKEN?: string;
  CHAT_RATE_LIMIT?: KVNamespace;
};

type ResendAttachment = {
  filename: string;
  content: string;
  content_type: string;
};

const maxFiles = 3;
const maxFileBytes = 5 * 1024 * 1024;
const maxTotalBytes = 12 * 1024 * 1024;
const maxChatMessageLength = 800;
const maxChatReplyLength = 1600;
const maxChatHistory = 10;
const defaultChatMaxMessages = 6;
const defaultChatWindowSeconds = 15 * 60;
const knowledgeGapPrefix = "I do not have enough approved information to answer that.";
const missingInformationBugType = "missing-information";
const offTopicExamples = [
  "Try asking, \"What is Will's last name?\"",
  "Try asking, \"What does Will do at Microsoft?\"",
  "Try asking, \"What projects has Will worked on?\"",
  "Try asking, \"What technologies does Will use?\"",
  "Try asking, \"Where did Will go to school?\"",
  "Try asking, \"How can I contact Will?\"",
];
const allowedFileTypes = new Set(["image/png", "image/jpeg", "image/webp", "video/mp4", "video/webm"]);
const allowedBugTypes = new Set([
  "broken-link",
  "incorrect-information",
  missingInformationBugType,
  "layout-visual",
  "mobile-responsive",
  "performance",
  "accessibility",
  "download-file",
  "form-submission",
  "security-privacy",
  "other",
]);

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/bug-report") {
      if (request.method === "POST") {
        return handleBugReport(request, env);
      }

      return jsonResponse({ message: "Method not allowed." }, 405);
    }

    if (url.pathname === "/api/chat") {
      if (request.method === "POST") {
        return handleChat(request, env);
      }

      return jsonResponse({ message: "Method not allowed." }, 405);
    }

    if (url.pathname === "/api/chat-health") {
      if (request.method === "POST") {
        return handleChatHealth(request, env);
      }

      return jsonResponse({ message: "Method not allowed." }, 405);
    }

    return withSecurityHeaders(await env.ASSETS.fetch(request));
  },
};

async function handleChat(request: Request, env: Env): Promise<Response> {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return jsonResponse({ message: "Chat requests must be JSON." }, 400);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ message: "Chat request JSON could not be parsed." }, 400);
  }

  const messages = parseChatMessages(body);
  if (messages.length === 0) {
    return jsonResponse({ message: "Send a message to W.I.L.L. first." }, 400);
  }

  const latestUserMessage = latestUserChatMessage(messages);
  if (!latestUserMessage || isClearlyOffTopic(latestUserMessage.content)) {
    return jsonResponse({
      reply: offTopicReply(),
    });
  }

  if (!env.CHAT_RATE_LIMIT) {
    return jsonResponse({ message: "Chat rate limiting is not configured yet." }, 503);
  }

  const rateLimitResult = await checkChatRateLimit(request, env);
  if (!rateLimitResult.allowed) {
    return jsonResponse(
      {
        message: "W.I.L.L. has reached the chat limit for this connection.",
        retryAfterSeconds: rateLimitResult.retryAfterSeconds,
      },
      429,
      {
        "Retry-After": String(rateLimitResult.retryAfterSeconds),
      },
    );
  }

  if (!env.OPENAI_API_KEY) {
    return jsonResponse({ message: "Chat is not configured yet." }, 503);
  }

  const openAiResponse = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL || "gpt-5.4-nano",
      instructions: chatInstructions(),
      input: messages,
      max_output_tokens: 450,
    }),
  });

  const result = (await openAiResponse.json()) as OpenAiResponse;
  if (!openAiResponse.ok) {
    const diagnostic = openAiDiagnostic(openAiResponse, result, env);
    console.error("OpenAI chat request failed", {
      ...diagnostic,
      requestId: openAiResponse.headers.get("x-request-id") || undefined,
    });

    return jsonResponse({ message: userFacingOpenAiError(openAiResponse.status) }, 502);
  }

  const reply = sanitizeChatReply(extractOpenAiText(result)) || knowledgeGapPrefix;
  if (isKnowledgeGapReply(reply)) {
    const wasReported = await sendMissingInformationReport({
      env,
      request,
      question: latestUserMessage.content,
      botReply: reply,
    });

    return jsonResponse({
      reply: missingInformationReply(wasReported),
    });
  }

  return jsonResponse({
    reply,
  });
}

async function handleChatHealth(request: Request, env: Env): Promise<Response> {
  if (!env.CHAT_DEBUG_TOKEN) {
    return jsonResponse({ message: "Chat health checks are not configured." }, 404);
  }

  const authorization = request.headers.get("authorization") || "";
  if (authorization !== `Bearer ${env.CHAT_DEBUG_TOKEN}`) {
    return jsonResponse({ message: "Not found." }, 404);
  }

  if (!env.OPENAI_API_KEY) {
    return jsonResponse({ openAiConfigured: false, message: "OPENAI_API_KEY is missing." }, 503);
  }

  const openAiResponse = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL || "gpt-5.4-nano",
      instructions: "Reply with exactly: ok",
      input: "health check",
      max_output_tokens: 20,
    }),
  });

  const result = (await openAiResponse.json()) as OpenAiResponse;
  const diagnostic = openAiDiagnostic(openAiResponse, result, env);

  if (!openAiResponse.ok) {
    console.error("OpenAI chat health check failed", {
      ...diagnostic,
      requestId: openAiResponse.headers.get("x-request-id") || undefined,
    });
  }

  return jsonResponse(
    {
      ok: openAiResponse.ok,
      ...diagnostic,
      hasReply: Boolean(extractOpenAiText(result).trim()),
    },
    openAiResponse.ok ? 200 : 502,
  );
}

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type OpenAiResponse = {
  output_text?: string;
  output?: Array<{
    type?: string;
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
  error?: {
    code?: string;
    message?: string;
    type?: string;
  };
};

function openAiDiagnostic(response: Response, result: OpenAiResponse, env: Env): {
  status: number;
  model: string;
  errorCode?: string;
  errorType?: string;
  errorMessage?: string;
} {
  return {
    status: response.status,
    model: env.OPENAI_MODEL || "gpt-5.4-nano",
    errorCode: result.error?.code,
    errorType: result.error?.type,
    errorMessage: result.error?.message,
  };
}

function userFacingOpenAiError(status: number): string {
  if (status === 401 || status === 403) {
    return "W.I.L.L. is connected, but OpenAI rejected the API key or permissions.";
  }

  if (status === 404) {
    return "W.I.L.L. is connected, but the configured OpenAI model is not available to this project.";
  }

  if (status === 429) {
    return "W.I.L.L. is connected, but OpenAI rate limits or billing limits are blocking the request.";
  }

  if (status >= 400 && status < 500) {
    return "W.I.L.L. is connected, but OpenAI rejected the chat request configuration.";
  }

  return "W.I.L.L. could not answer right now. Please try again later.";
}

function parseChatMessages(body: unknown): ChatMessage[] {
  if (!body || typeof body !== "object" || !("messages" in body) || !Array.isArray(body.messages)) {
    return [];
  }

  return body.messages
    .slice(-maxChatHistory)
    .map((message): ChatMessage | null => {
      if (!message || typeof message !== "object") {
        return null;
      }

      const role = "role" in message && message.role === "assistant" ? "assistant" : "user";
      const content = "content" in message && typeof message.content === "string" ? normalizeChatText(message.content) : "";

      if (!content) {
        return null;
      }

      return { role, content };
    })
    .filter((message): message is ChatMessage => Boolean(message));
}

function latestUserChatMessage(messages: ChatMessage[]): ChatMessage | null {
  return [...messages].reverse().find((message) => message.role === "user") ?? null;
}

function isClearlyOffTopic(message: string): boolean {
  const normalized = message.toLowerCase().replace(/[^a-z0-9\s.]/g, " ");

  if (hasAny(normalized, allowedWillTopicTerms)) {
    return false;
  }

  if (hasAnyWholeTerm(normalized, contextualReferenceTerms) && hasAny(normalized, contextualProfileTerms)) {
    return false;
  }

  if (hasAny(normalized, offTopicRequestTerms)) {
    return true;
  }

  return true;
}

const allowedWillTopicTerms = [
  "will",
  "william",
  "augustine",
  "w.i.l.l",
  "w i l l",
  "your name",
  "first name",
  "last name",
  "full name",
  "who are you",
  "who is",
  "about you",
  "about him",
  "background",
  "resume",
  "cv",
  "experience",
  "job",
  "role",
  "microsoft",
  "outlook",
  "defender",
  "quarantine",
  "internship",
  "teaching assistant",
  "education",
  "school",
  "college",
  "university",
  "degree",
  "mba",
  "montana tech",
  "eastern university",
  "skills",
  "technologies",
  "tools",
  "languages",
  "projects",
  "github",
  "linkedin",
  "email",
  "phone",
  "contact",
  "hire",
  "hiring",
  "opportunity",
  "opportunities",
  "open to",
  "role",
  "roles",
  "tpm",
  "technical program manager",
  "pm",
  "product manager",
  "career",
  "goals",
  "salary",
  "relocation",
  "relocate",
  "customer",
  "customers",
  "trust",
  "mindset",
  "positive",
  "teammate",
  "coworker",
  "work with",
  "different",
  "why should",
  "strengths",
  "weaknesses",
  "location",
  "live",
  "where are you from",
  "where did you grow up",
  "philadelphia",
  "travel",
  "hobbies",
  "interests",
  "favorite movie",
  "favorite movies",
  "movies",
  "letterboxd",
  "wife",
  "married",
  "family",
  "amelia",
  "milo",
  "otis",
  "dog",
  "pets",
  "portfolio",
  "website",
];

const contextualReferenceTerms = [
  "he",
  "him",
  "his",
  "they",
  "them",
  "their",
  "theirs",
  "you",
  "your",
  "yours",
];

const contextualProfileTerms = [
  "age",
  "birthday",
  "born",
  "color",
  "favorite",
  "favourite",
  "food",
  "cook",
  "movie",
  "book",
  "music",
  "hobby",
  "hobbies",
  "interest",
  "interests",
  "sport",
  "football",
  "dog",
  "dogs",
  "pet",
  "pets",
  "family",
  "wife",
  "school",
  "college",
  "degree",
  "work",
  "job",
  "role",
  "career",
  "skill",
  "skills",
  "strength",
  "strengths",
  "goal",
  "goals",
  "email",
  "phone",
  "contact",
  "linkedin",
  "github",
  "live",
  "from",
  "located",
  "open to",
  "hire",
  "different",
  "like",
];

const offTopicRequestTerms = [
  "write code",
  "write a function",
  "write me code",
  "debug",
  "fix this code",
  "programming question",
  "solve this",
  "math problem",
  "recipe",
  "weather",
  "stock",
  "sports",
  "news",
  "capital of",
  "translate",
  "summarize this",
  "make me",
  "build an app",
  "explain javascript",
  "explain python",
  "explain c++",
  "what is react",
  "what is typescript",
];

function hasAny(value: string, terms: string[]): boolean {
  return terms.some((term) => value.includes(term));
}

function hasAnyWholeTerm(value: string, terms: string[]): boolean {
  return terms.some((term) => new RegExp(`\\b${escapeRegExp(term)}\\b`).test(value));
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function offTopicReply(): string {
  const example = offTopicExamples[Math.floor(Math.random() * offTopicExamples.length)];
  return `I am W.I.L.L., a bot for questions about Will Augustine, so I should stick to Will's background, work, projects, skills, and portfolio. ${example}`;
}

function isKnowledgeGapReply(reply: string): boolean {
  return reply.toLowerCase().startsWith(knowledgeGapPrefix.toLowerCase());
}

function missingInformationReply(wasReported: boolean): string {
  if (wasReported) {
    return "I do not have enough approved information to answer that yet. I let Will know there is a gap in what I can answer, so he can decide whether to add it.";
  }

  return "I do not have enough approved information to answer that yet. I tried to flag the gap for Will, but the notification could not be sent automatically.";
}

function normalizeChatText(value: string): string {
  return sanitizeChatText(value).slice(0, maxChatMessageLength);
}

function sanitizeChatText(value: string): string {
  return value
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .replace(/[<>]/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();
}

function sanitizeChatReply(value: string): string {
  return sanitizeChatText(value).slice(0, maxChatReplyLength).trim();
}

function chatInstructions(): string {
  return [
    `You are ${chatBotName}, which stands for ${chatBotExpansion}.`,
    "You are an AI bot on Will Augustine's portfolio website. You are not Will Augustine.",
    "Make the visitor feel like they are talking with Will through a friendly bot, while clearly remaining a bot if your identity is asked.",
    "Use first person for normal answers, as if speaking from Will's approved perspective. If asked whether you are Will, explain that you are W.I.L.L., an AI bot using approved information about Will.",
    "Only answer questions about Will Augustine, his background, work, projects, skills, resume, education, location, contact links, interests, career goals, family/pets, or this portfolio website.",
    "Do not answer general programming, trivia, homework, news, finance, weather, recipe, translation, or random questions unless they are directly about Will.",
    "Do not answer salary expectation or relocation preference questions. If asked, briefly say you do not cover salary or relocation details and suggest contacting Will directly.",
    "If the latest user message is unrelated to Will, gently remind them that they should only ask questions about Will and include one brief example question they could ask.",
    `Answer only from the approved profile knowledge below. If the answer is not present, start your reply with exactly "${knowledgeGapPrefix}" and do not guess.`,
    "Keep replies concise, warm, and direct. Prefer 2-5 sentences unless the visitor asks for detail.",
    "Do not invent private facts, employment details, availability, opinions, salary information, or personal contact details beyond the approved knowledge.",
    "",
    "Approved profile knowledge:",
    chatKnowledge,
  ].join("\n");
}

async function checkChatRateLimit(
  request: Request,
  env: Env,
): Promise<{ allowed: true } | { allowed: false; retryAfterSeconds: number }> {
  const windowSeconds = positiveInteger(env.CHAT_WINDOW_SECONDS, defaultChatWindowSeconds);
  const maxMessages = positiveInteger(env.CHAT_MAX_MESSAGES, defaultChatMaxMessages);
  const windowStartedAt = Math.floor(Date.now() / (windowSeconds * 1000)) * windowSeconds;
  const key = `chat:${await clientHash(request)}:${windowStartedAt}`;
  const currentCount = Number((await env.CHAT_RATE_LIMIT?.get(key)) || "0");

  if (currentCount >= maxMessages) {
    const retryAfterSeconds = Math.max(1, windowStartedAt + windowSeconds - Math.floor(Date.now() / 1000));
    return { allowed: false, retryAfterSeconds };
  }

  await env.CHAT_RATE_LIMIT?.put(key, String(currentCount + 1), {
    expirationTtl: windowSeconds + 60,
  });

  return { allowed: true };
}

async function clientHash(request: Request): Promise<string> {
  const ipAddress =
    request.headers.get("CF-Connecting-IP") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ipAddress));
  return Array.from(new Uint8Array(bytes))
    .slice(0, 12)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function positiveInteger(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function extractOpenAiText(result: OpenAiResponse): string {
  if (result.output_text) {
    return result.output_text;
  }

  return (
    result.output
      ?.flatMap((item) => item.content ?? [])
      .map((content) => content.text ?? "")
      .join("")
      .trim() ?? ""
  );
}

async function sendMissingInformationReport(input: {
  env: Env;
  request: Request;
  question: string;
  botReply: string;
}): Promise<boolean> {
  const resendApiKey = normalizeResendApiKey(input.env.RESEND_API_KEY);

  if (!resendApiKey || !input.env.BUG_REPORT_FROM) {
    console.error("Missing information report email is not configured", {
      resendConfigured: Boolean(resendApiKey),
      fromConfigured: Boolean(input.env.BUG_REPORT_FROM),
    });
    return false;
  }

  const from = input.env.BUG_REPORT_FROM.trim();
  const to = (input.env.BUG_REPORT_TO || "willaugustine64@outlook.com").trim();

  if (!isValidEmailAddress(from) || !isValidEmailAddress(to)) {
    console.error("Missing information report email configuration is invalid", {
      from: diagnosticEmailValue(from),
      to: diagnosticEmailValue(to),
    });
    return false;
  }

  const submittedAt = new Date().toISOString();
  const userAgent = sanitizePlainText(input.request.headers.get("user-agent") || "Not provided").slice(0, 300);
  const pageUrl = sanitizePlainText(input.request.url).slice(0, 500);
  const moreInfo = [
    "W.I.L.L. could not answer an about-Will question from approved profile knowledge.",
    "",
    "Visitor question:",
    sanitizePlainText(input.question),
    "",
    "Bot reply:",
    sanitizePlainText(input.botReply),
    "",
    `Request URL: ${pageUrl}`,
    `User agent: ${userAgent}`,
  ].join("\n");

  const emailPayload = {
    from,
    to: [to],
    subject: `Website bug report: ${labelFromBugType(missingInformationBugType)}`,
    text: [
      "A new website bug report was submitted.",
      "",
      `Submitted: ${submittedAt}`,
      "Affected pages: Chat",
      `Bug type: ${labelFromBugType(missingInformationBugType)}`,
      "Follow up email: Not provided",
      "",
      "More information:",
      moreInfo,
    ].join("\n"),
    html: bugReportHtml({
      submittedAt,
      pages: ["Chat"],
      bugType: missingInformationBugType,
      email: "",
      moreInfo,
    }),
  };

  const resend = new Resend(resendApiKey);
  const { data, error } = await resend.emails.send(emailPayload);

  if (error) {
    console.error("Resend missing information report email failed", {
      error,
      fromConfigured: Boolean(input.env.BUG_REPORT_FROM),
      toConfigured: Boolean(to),
      from: diagnosticEmailValue(from),
      to: diagnosticEmailValue(to),
    });
    return false;
  }

  console.log("Missing information report email sent", { id: data?.id, to: diagnosticEmailValue(to) });
  return true;
}

async function handleBugReport(request: Request, env: Env): Promise<Response> {
  if (!request.headers.get("content-type")?.includes("multipart/form-data")) {
    return jsonResponse({ message: "Bug reports must be submitted as multipart form data." }, 400);
  }

  const formData = await request.formData();
  const pages = formData.getAll("pages").map(stringValue).filter(Boolean);
  const bugType = stringValue(formData.get("bugType"));
  const email = stringValue(formData.get("email"));
  const moreInfo = stringValue(formData.get("moreInfo"));
  const mediaFiles = formData.getAll("media").filter((value): value is File => value instanceof File && value.size > 0);

  const validationError = validateBugReport({ pages, bugType, email, moreInfo, mediaFiles });
  if (validationError) {
    return jsonResponse({ message: validationError }, 400);
  }

  const resendApiKey = normalizeResendApiKey(env.RESEND_API_KEY);

  if (!resendApiKey || !env.BUG_REPORT_FROM) {
    return jsonResponse(
      {
        message:
          "Bug report email is not configured yet. Set RESEND_API_KEY and BUG_REPORT_FROM in Cloudflare Worker settings.",
      },
      503,
    );
  }

  const attachments = await Promise.all(mediaFiles.map(fileToResendAttachment));
  const submittedAt = new Date().toISOString();
  const from = env.BUG_REPORT_FROM.trim();
  const to = (env.BUG_REPORT_TO || "willaugustine64@outlook.com").trim();

  if (!isValidEmailAddress(from) || !isValidEmailAddress(to)) {
    console.error("Bug report email configuration is invalid", {
      from: diagnosticEmailValue(from),
      to: diagnosticEmailValue(to),
    });

    return jsonResponse({ message: "Bug report email is not configured with valid email addresses." }, 503);
  }

  const emailPayload = {
    from,
    to: [to],
    subject: `Website bug report: ${labelFromBugType(bugType)}`,
    text: [
      "A new website bug report was submitted.",
      "",
      `Submitted: ${submittedAt}`,
      `Affected pages: ${pages.join(", ")}`,
      `Bug type: ${labelFromBugType(bugType)}`,
      `Follow up email: ${email || "Not provided"}`,
      "",
      "More information:",
      sanitizePlainText(moreInfo),
    ].join("\n"),
    html: bugReportHtml({
      submittedAt,
      pages,
      bugType,
      email,
      moreInfo,
    }),
    ...(email ? { replyTo: email } : {}),
    ...(attachments.length > 0 ? { attachments } : {}),
  };

  const resend = new Resend(resendApiKey);
  const { data, error } = await resend.emails.send(emailPayload);

  if (error) {
    console.error("Resend bug report email failed", {
      error,
      apiKeyLooksValid: resendApiKey.startsWith("re_"),
      apiKeyLength: resendApiKey.length,
      fromConfigured: Boolean(env.BUG_REPORT_FROM),
      toConfigured: Boolean(to),
      attachmentCount: attachments.length,
      payloadKeys: Object.keys(emailPayload),
      from: diagnosticEmailValue(from),
      to: diagnosticEmailValue(to),
    });

    return jsonResponse({ message: "Bug report email could not be sent. Please try again later." }, 502);
  }

  console.log("Bug report email sent", { id: data?.id, to: diagnosticEmailValue(to) });

  return jsonResponse({ message: "Bug report submitted. Thank you." });
}

function validateBugReport(input: {
  pages: string[];
  bugType: string;
  email: string;
  moreInfo: string;
  mediaFiles: File[];
}): string | null {
  if (input.pages.length === 0) {
    return "Select at least one affected page.";
  }

  if (input.pages.length > 7 || input.pages.some((page) => page.length > 40)) {
    return "Affected pages are invalid.";
  }

  if (!allowedBugTypes.has(input.bugType)) {
    return "Select a valid bug type.";
  }

  if (input.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    return "Enter a valid follow up email address.";
  }

  if (input.email.length > 254) {
    return "Follow up email is too long.";
  }

  if (!input.moreInfo.trim()) {
    return "Add more information about the bug.";
  }

  if (input.moreInfo.length > 2000) {
    return "More information must be 2,000 characters or less.";
  }

  if (/<\/?[a-z][\s\S]*>/i.test(input.moreInfo)) {
    return "More information must be plain text only.";
  }

  if (input.mediaFiles.length > maxFiles) {
    return `Upload ${maxFiles} files or fewer.`;
  }

  const totalBytes = input.mediaFiles.reduce((sum, file) => sum + file.size, 0);
  if (totalBytes > maxTotalBytes) {
    return "Uploads must be 12 MB total or less.";
  }

  for (const file of input.mediaFiles) {
    if (!allowedFileTypes.has(file.type)) {
      return "Uploads must be PNG, JPEG, WebP, MP4, or WebM files.";
    }

    if (file.size > maxFileBytes) {
      return "Each upload must be 5 MB or less.";
    }
  }

  return null;
}

async function fileToResendAttachment(file: File): Promise<ResendAttachment> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return {
    filename: sanitizeFileName(file.name),
    content: btoa(binary),
    content_type: file.type,
  };
}

function stringValue(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function sanitizePlainText(value: string): string {
  return value.replace(/[<>]/g, "").replace(/\r\n/g, "\n").trim();
}

function sanitizeFileName(value: string): string {
  return value.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "bug-report-media";
}

function isValidEmailAddress(value: string): boolean {
  return /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(value);
}

function diagnosticEmailValue(value: string): { value: string; length: number; charCodes: number[] } {
  return {
    value,
    length: value.length,
    charCodes: Array.from(value).map((character) => character.charCodeAt(0)),
  };
}

function bugReportHtml(input: {
  submittedAt: string;
  pages: string[];
  bugType: string;
  email: string;
  moreInfo: string;
}): string {
  const rows = [
    ["Submitted", input.submittedAt],
    ["Affected pages", input.pages.join(", ")],
    ["Bug type", labelFromBugType(input.bugType)],
    ["Follow up email", input.email || "Not provided"],
  ];

  return `
    <h1>Website bug report</h1>
    <table>
      <tbody>
        ${rows
          .map(
            ([label, value]) => `
              <tr>
                <th align="left" style="padding: 4px 12px 4px 0;">${escapeHtml(label)}</th>
                <td style="padding: 4px 0;">${escapeHtml(value)}</td>
              </tr>
            `,
          )
          .join("")}
      </tbody>
    </table>
    <h2>More information</h2>
    <p style="white-space: pre-wrap;">${escapeHtml(sanitizePlainText(input.moreInfo))}</p>
  `;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function labelFromBugType(value: string): string {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeResendApiKey(value: string | undefined): string {
  return (value || "").trim().replace(/^Bearer\s+/i, "");
}

function jsonResponse(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return withSecurityHeaders(
    new Response(JSON.stringify(body), {
      status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
        ...headers,
      },
    }),
  );
}

function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
      "form-action 'self'",
    ].join("; "),
  );

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
