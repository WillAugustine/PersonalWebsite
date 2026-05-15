/// <reference types="@cloudflare/workers-types" />

type Env = {
  ASSETS: Fetcher;
  RESEND_API_KEY?: string;
  BUG_REPORT_FROM?: string;
  BUG_REPORT_TO?: string;
};

type ResendAttachment = {
  filename: string;
  content: string;
  content_type: string;
};

const maxFiles = 3;
const maxFileBytes = 5 * 1024 * 1024;
const maxTotalBytes = 12 * 1024 * 1024;
const allowedFileTypes = new Set(["image/png", "image/jpeg", "image/webp", "video/mp4", "video/webm"]);
const allowedBugTypes = new Set([
  "broken-link",
  "incorrect-information",
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

    return env.ASSETS.fetch(request);
  },
};

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

  if (!env.RESEND_API_KEY || !env.BUG_REPORT_FROM) {
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
  const to = env.BUG_REPORT_TO || "willaugustine64@outlook.com";

  const emailResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.BUG_REPORT_FROM,
      to,
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
      attachments,
    }),
  });

  if (!emailResponse.ok) {
    return jsonResponse({ message: "Bug report email could not be sent. Please try again later." }, 502);
  }

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

function labelFromBugType(value: string): string {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}
