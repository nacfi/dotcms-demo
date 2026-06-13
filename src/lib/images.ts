import type { DotImageField } from "./types";

const HOST = (process.env.NEXT_PUBLIC_DOTCMS_HOST ?? "").replace(/\/$/, "");

/**
 * Resolve a dotCMS image/binary field to an absolute URL usable by next/image.
 * Handles the two common shapes: a raw path string, or an object that carries
 * `versionPath` / `idPath` (as returned with `depth` on relationships).
 */
export function dotAsset(value: DotImageField | unknown): string | null {
  if (!value) return null;

  if (typeof value === "string") {
    if (value.startsWith("http://") || value.startsWith("https://")) {
      return value;
    }
    return `${HOST}${value.startsWith("/") ? "" : "/"}${value}`;
  }

  if (typeof value === "object") {
    const v = value as Record<string, unknown>;
    const path = (v.versionPath ?? v.idPath ?? v.path) as string | undefined;
    if (path) return dotAsset(path);
  }

  return null;
}

/**
 * Best-effort image URL for a contentlet: prefer an explicit field value, then
 * fall back to the dotCMS `/dA/<identifier>/<field>` shorty endpoint, which
 * serves the binary for that field directly.
 */
export function contentletImage<
  T extends { identifier?: string; hasTitleImage?: boolean },
>(contentlet: T, field = "image"): string | null {
  const value = (contentlet as unknown as Record<string, unknown>)[field];

  // A real asset path / absolute URL (e.g. Product's "/dA/<id>/image/x.jpg").
  if (
    typeof value === "string" &&
    (value.startsWith("http://") ||
      value.startsWith("https://") ||
      value.includes("/dA/"))
  ) {
    return dotAsset(value);
  }

  // An object carrying a real asset path (DotFileasset / binary metadata).
  // Only trust it if it resolves to an actual /dA/ asset — the Page API often
  // returns a placeholder that collapses to the host root.
  if (value && typeof value === "object") {
    const resolved = dotAsset(value as DotImageField);
    if (resolved && resolved.includes("/dA/")) return resolved;
  }

  // Otherwise serve the field binary via the reliable shorty endpoint. This
  // works regardless of how the API represented the field — a bare identifier
  // (Content API) or a placeholder like "/" (Page API) — as long as the
  // contentlet has a binary in `field` or a title image.
  if (contentlet.identifier && (value || contentlet.hasTitleImage)) {
    return `${HOST}/dA/${contentlet.identifier}/${field}`;
  }
  return null;
}

/**
 * dotCMS "shorty" binary URL. With no field it serves the contentlet's default
 * binary (title image) — handy for the Image content type whose field name
 * varies between starters.
 */
export function dotShorty(
  identifier?: string,
  field?: string,
): string | null {
  if (!identifier) return null;
  return field ? `${HOST}/dA/${identifier}/${field}` : `${HOST}/dA/${identifier}`;
}
