import { createDotCMSClient } from "@dotcms/client";
import type {
  DotCMSBasicContentlet,
  DotCMSPageRequestParams,
  DotCMSPageResponse,
} from "@dotcms/types";
import type { BlogContentlet, NavItem } from "./types";

const dotcmsUrl = process.env.NEXT_PUBLIC_DOTCMS_HOST ?? "";
const authToken = process.env.NEXT_PUBLIC_DOTCMS_AUTH_TOKEN ?? "";
const siteId = process.env.NEXT_PUBLIC_DOTCMS_SITE_ID || undefined;

/** True when the instance URL + token are present so we can actually fetch. */
export const isDotCMSConfigured = Boolean(dotcmsUrl && authToken);

if (!isDotCMSConfigured && typeof window === "undefined") {
  console.warn(
    "\n[dotCMS] NEXT_PUBLIC_DOTCMS_HOST / NEXT_PUBLIC_DOTCMS_AUTH_TOKEN are not set.\n" +
      "Copy .env.example to .env.local, add your instance details, then restart the dev server.\n",
  );
}

/**
 * Lazily created, memoised dotCMS client.
 *
 * `createDotCMSClient` throws if `authToken` is missing, so we never construct
 * it at module load — that would crash `next build` when env isn't set. Data
 * helpers short-circuit on `isDotCMSConfigured` before ever calling this.
 */
let cachedClient: ReturnType<typeof createDotCMSClient> | null = null;
function getClient() {
  if (!cachedClient) {
    cachedClient = createDotCMSClient({
      dotcmsUrl,
      authToken,
      siteId,
      // Always fetch fresh: UVE edits + previews must reflect immediately, and
      // we don't want authenticated content statically cached in this demo.
      requestOptions: { cache: "no-cache" },
    });
  }
  return cachedClient;
}

export const DEFAULT_LANGUAGE_ID = "1";

/**
 * Field used to order the blog listing. This instance's Blog type has no
 * `postingDate`, so we sort by the system `modDate` (always indexed).
 */
const BLOG_SORT_FIELD = "modDate";

/**
 * Fetch a dotCMS page (layout + containers + contentlets) for the given path.
 * Returns `null` on a 404 (so the route can render `notFound()`) or when the
 * instance isn't configured yet.
 */
export async function getPage(
  path: string,
  options: DotCMSPageRequestParams = {},
): Promise<DotCMSPageResponse | null> {
  if (!isDotCMSConfigured) return null;
  try {
    return await getClient().page.get(path, {
      languageId: DEFAULT_LANGUAGE_ID,
      ...options,
    });
  } catch (error) {
    const status = (error as { status?: number })?.status;
    if (status !== 404) {
      console.error(`[dotCMS] Failed to fetch page "${path}":`, error);
    }
    return null;
  }
}

/**
 * Build the top navigation from the dotCMS navigation tree (menu-enabled pages
 * under the site root).
 *
 * NOTE: this instance's REST Navigation endpoint (/api/v1/nav, used by
 * `client.nav.get`) requires auth the public dev token doesn't grant, so we use
 * the GraphQL `DotNavigation` query instead — the same navigation data, served
 * anonymously for live menu items.
 */
export async function getNavigation(depth = 2): Promise<NavItem[]> {
  if (!isDotCMSConfigured) return [];
  try {
    const query = `{ DotNavigation(uri: "/", depth: ${depth}) { children { title href type } } }`;
    const res = await fetch(`${dotcmsUrl}/api/v1/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ query }),
      cache: "no-store",
    });
    const json = (await res.json()) as {
      data?: {
        DotNavigation?: {
          children?: Array<{ title?: string; href?: string; type?: string }>;
        };
      };
    };
    const children = json.data?.DotNavigation?.children ?? [];
    return children
      .filter((c): c is { title: string; href: string; type?: string } =>
        Boolean(c?.title && c?.href),
      )
      .map((c) => ({
        title: c.title,
        href: c.href,
        target: c.type === "link" ? "_blank" : undefined,
      }));
  } catch (error) {
    console.error("[dotCMS] Failed to fetch navigation:", error);
    return [];
  }
}

/**
 * List Blog contentlets via the Content API query builder, newest first.
 */
export async function getBlogListing(
  options: { limit?: number; page?: number; languageId?: string | number } = {},
): Promise<{ blogs: BlogContentlet[]; total: number }> {
  if (!isDotCMSConfigured) return { blogs: [], total: 0 };
  const { limit = 12, page = 1, languageId = DEFAULT_LANGUAGE_ID } = options;

  try {
    const res = await getClient()
      .content.getCollection<BlogContentlet>("Blog")
      .language(languageId)
      .sortBy([{ field: BLOG_SORT_FIELD, order: "desc" }])
      .depth(1)
      .limit(limit)
      .page(page);

    if ("contentlets" in res) {
      return { blogs: res.contentlets as BlogContentlet[], total: res.total };
    }
    return { blogs: [], total: 0 };
  } catch (error) {
    console.error("[dotCMS] Failed to fetch blog listing:", error);
    return { blogs: [], total: 0 };
  }
}

/**
 * Fetch the newest live contentlets of a content type, for the "recommended
 * content" widgets reimplemented from VtlInclude. The original widgets render a
 * Velocity `.vtl` file server-side, which has no headless representation — so we
 * query the same content via the Content API and render it with React instead.
 *
 * Called from the `/api/recommendations` route handler (server-side) so the
 * auth token never reaches the browser and there's no cross-origin fetch.
 */
export async function getRecommendations<
  T extends DotCMSBasicContentlet = DotCMSBasicContentlet,
>(
  contentType: string,
  limit = 3,
  languageId: string | number = DEFAULT_LANGUAGE_ID,
): Promise<T[]> {
  if (!isDotCMSConfigured) return [];
  try {
    const res = await getClient()
      .content.getCollection<T>(contentType)
      .language(languageId)
      // modDate is always indexed; avoids assuming a type-specific sort field.
      .sortBy([{ field: "modDate", order: "desc" }])
      .depth(1)
      .limit(limit);

    if ("contentlets" in res) return res.contentlets as T[];
    return [];
  } catch (error) {
    console.error(
      `[dotCMS] Failed to fetch recommendations for "${contentType}":`,
      error,
    );
    return [];
  }
}

/**
 * Fetch a single Blog by its `urlTitle` slug (used by the detail route).
 */
export async function getBlogByUrlTitle(
  urlTitle: string,
  languageId: string | number = DEFAULT_LANGUAGE_ID,
): Promise<BlogContentlet | null> {
  if (!isDotCMSConfigured) return null;
  try {
    const res = await getClient()
      .content.getCollection<BlogContentlet>("Blog")
      .query((qb) => qb.field("urlTitle").equals(urlTitle))
      .language(languageId)
      .depth(1)
      .limit(1);

    if ("contentlets" in res && res.contentlets.length > 0) {
      return res.contentlets[0] as BlogContentlet;
    }
    return null;
  } catch (error) {
    console.error(`[dotCMS] Failed to fetch blog "${urlTitle}":`, error);
    return null;
  }
}
