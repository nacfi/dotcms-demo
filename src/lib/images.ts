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

  if (typeof value === "string" && value.length > 0) {
    // Already an absolute URL or a server-relative path (e.g. Product's
    // "/dA/<id>/image/file.jpg").
    if (
      value.startsWith("http://") ||
      value.startsWith("https://") ||
      value.startsWith("/")
    ) {
      return dotAsset(value);
    }
    // A bare binary identifier/inode (e.g. Banner/Blog "image") → serve the
    // field's binary via the shorty endpoint on the contentlet.
    if (contentlet.identifier) {
      return `${HOST}/dA/${contentlet.identifier}/${field}`;
    }
    return `${HOST}/dA/${value}`;
  }

  if (value && typeof value === "object") {
    const resolved = dotAsset(value as DotImageField);
    if (resolved) return resolved;
  }

  // No usable field value, but the contentlet carries a title image.
  if (contentlet.identifier && contentlet.hasTitleImage) {
    return `${HOST}/dA/${contentlet.identifier}`;
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
