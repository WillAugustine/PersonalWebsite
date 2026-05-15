const maxFiles = 3;
const maxFileBytes = 5 * 1024 * 1024;
const maxTotalBytes = 12 * 1024 * 1024;
const allowedFileTypes = new Set(["image/png", "image/jpeg", "image/webp", "video/mp4", "video/webm"]);

export function bindBugReportForm(): void {
  const form = document.querySelector<HTMLFormElement>("#bug-report-form");
  const status = document.querySelector<HTMLElement>("#bug-report-status");
  const pageSummary = document.querySelector<HTMLElement>("#bug-pages-summary");

  if (!form || !status) {
    return;
  }

  form.querySelectorAll<HTMLInputElement>('input[name="pages"]').forEach((checkbox) => {
    checkbox.addEventListener("change", () => updatePageSummary(form, pageSummary));
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.className = "form-status";
    status.textContent = "";

    const validationError = validateBugReportForm(form);
    if (validationError) {
      status.classList.add("error");
      status.textContent = validationError;
      return;
    }

    const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    submitButton?.setAttribute("disabled", "true");
    status.textContent = "Submitting bug report...";

    try {
      const response = await fetch("/api/bug-report", {
        method: "POST",
        body: new FormData(form),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "Bug report could not be submitted.");
      }

      form.reset();
      updatePageSummary(form, pageSummary);
      status.classList.add("success");
      status.textContent = result.message || "Bug report submitted. Thank you.";
    } catch (error) {
      status.classList.add("error");
      status.textContent = error instanceof Error ? error.message : "Bug report could not be submitted.";
    } finally {
      submitButton?.removeAttribute("disabled");
    }
  });
}

function updatePageSummary(form: HTMLFormElement, pageSummary: HTMLElement | null): void {
  if (!pageSummary) {
    return;
  }

  const selectedPages = Array.from(form.querySelectorAll<HTMLInputElement>('input[name="pages"]:checked')).map(
    (checkbox) => checkbox.value,
  );

  pageSummary.textContent = selectedPages.length > 0 ? selectedPages.join(", ") : "Select one or more pages";
}

function validateBugReportForm(form: HTMLFormElement): string | null {
  const selectedPages = form.querySelectorAll<HTMLInputElement>('input[name="pages"]:checked');
  if (selectedPages.length === 0) {
    return "Select at least one affected page.";
  }

  const bugType = form.querySelector("#bug-type") as HTMLSelectElement | null;
  if (!bugType?.value) {
    return "Select a bug type.";
  }

  const moreInfo = form.querySelector("#bug-more-info") as HTMLTextAreaElement | null;
  if (!moreInfo?.value.trim()) {
    return "Add more information about the bug.";
  }

  if (moreInfo.value.length > 2000) {
    return "More information must be 2,000 characters or less.";
  }

  const fileInput = form.querySelector("#bug-media") as HTMLInputElement | null;
  const files = Array.from(fileInput?.files ?? []);

  if (files.length > maxFiles) {
    return `Upload ${maxFiles} files or fewer.`;
  }

  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
  if (totalBytes > maxTotalBytes) {
    return "Uploads must be 12 MB total or less.";
  }

  for (const file of files) {
    if (!allowedFileTypes.has(file.type)) {
      return "Uploads must be PNG, JPEG, WebP, MP4, or WebM files.";
    }

    if (file.size > maxFileBytes) {
      return "Each upload must be 5 MB or less.";
    }
  }

  return null;
}
