import type { BugType } from "../types";

export const bugTypes: BugType[] = [
  { label: "Broken link", value: "broken-link" },
  { label: "Incorrect information", value: "incorrect-information" },
  { label: "Missing information", value: "missing-information" },
  { label: "Layout or visual issue", value: "layout-visual" },
  { label: "Mobile/responsive issue", value: "mobile-responsive" },
  { label: "Performance problem", value: "performance" },
  { label: "Accessibility issue", value: "accessibility" },
  { label: "Download or file problem", value: "download-file" },
  { label: "Form submission problem", value: "form-submission" },
  { label: "Security/privacy concern", value: "security-privacy" },
  { label: "Other", value: "other" },
];

