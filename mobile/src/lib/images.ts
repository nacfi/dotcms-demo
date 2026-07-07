import { DOTCMS_HOST } from "./config";

/**
 * Image URL helpers, ported from the web app's src/lib/images.ts so both
 * clients resolve binaries identically.
 */

/** Resolve a dotCMS image/binary field value to an absolute URL. */
export function dotAsset(value: unknown): string | null {
  if (!value) return null;

  if (typeof value === "string") {
    if (value.startsWith("http://") || value.startsWith("https://")) {
      return value;
    }
    return `${DOTCMS_HOST}${value.startsWith("/") ? "" : "/"}${value}`;
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
 * fall back to the dotCMS `/dA/<identifier>/<field>` endpoint, which serves
 * the binary for that field directly regardless of how the API represented it.
 */
export function contentletImage(
  contentlet: { identifier?: string; hasTitleImage?: boolean } & Record<
    string,
    unknown
  >,
  field = "image",
): string | null {
  const value = contentlet[field];

  if (
    typeof value === "string" &&
    (value.startsWith("http://") ||
      value.startsWith("https://") ||
      value.includes("/dA/"))
  ) {
    return dotAsset(value);
  }

  if (value && typeof value === "object") {
    const resolved = dotAsset(value);
    if (resolved && resolved.includes("/dA/")) return resolved;
  }

  if (contentlet.identifier && (value || contentlet.hasTitleImage)) {
    return `${DOTCMS_HOST}/dA/${contentlet.identifier}/${field}`;
  }
  return null;
}

/** dotCMS "shorty" binary URL; with no field it serves the title image. */
export function dotShorty(identifier?: string, field?: string): string | null {
  if (!identifier) return null;
  return field
    ? `${DOTCMS_HOST}/dA/${identifier}/${field}`
    : `${DOTCMS_HOST}/dA/${identifier}`;
}
