/** Format a dotCMS date string for display. Returns null if unparseable. */
export function formatDate(value?: string): string | null {
  if (!value) return null;
  // dotCMS dates look like "2026-03-10 19:27:25.581" — normalise to ISO-ish.
  const normalized = value.includes("T") ? value : value.replace(" ", "T");
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Strip HTML tags so a WYSIWYG field can be used as a plain-text teaser. */
export function stripHtml(html?: unknown): string {
  return String(html ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}
