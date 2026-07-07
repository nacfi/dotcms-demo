import { DEFAULT_LANGUAGE_ID, DOTCMS_HOST, DOTCMS_SITE_ID } from "./config";
import type { BlogContentlet, Contentlet, DotPage, NavItem } from "./types";

/**
 * dotCMS data layer for React Native.
 *
 * The web app uses `@dotcms/client`, whose `page.get()` is a thin wrapper
 * around the GraphQL query below. The SDK's React pieces (UVE bridge,
 * <DotCMSLayoutBody>) are DOM-based, so on mobile we speak to the same two
 * endpoints directly with `fetch`:
 *
 *   - /api/v1/graphql          → page (layout + containers + contentlets), nav
 *   - /api/content/_search     → blog listing/detail, recommendation grids
 *
 * Same APIs, same live content: publish in dotCMS and both the site and this
 * app pick it up on the next fetch.
 */

/** The same page shape `@dotcms/client` requests, trimmed to what we render. */
const PAGE_QUERY = `
query PageContent($url: String!, $languageId: String, $mode: String, $siteId: String) {
  page: page(url: $url, languageId: $languageId, pageMode: $mode, site: $siteId) {
    title
    friendlyName
    pageURI
    containers {
      path
      identifier
      maxContentlets
      containerContentlets {
        uuid
        contentlets {
          _map
        }
      }
    }
    layout {
      body {
        rows {
          styleClass
          columns {
            leftOffset
            width
            styleClass
            containers {
              identifier
              uuid
            }
          }
        }
      }
    }
  }
}`;

async function graphql<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T | null> {
  try {
    const res = await fetch(`${DOTCMS_HOST}/api/v1/graphql`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as { data?: T; errors?: unknown[] };
    if (json.errors?.length) throw new Error(JSON.stringify(json.errors));
    return json.data ?? null;
  } catch (error) {
    console.warn("[dotCMS] GraphQL request failed:", error);
    return null;
  }
}

/**
 * Fetch a dotCMS page (layout + containers + contentlets) for the given path.
 * Live mode only: mobile has no visual editor, it renders what's published.
 */
export async function getPage(path: string): Promise<DotPage | null> {
  const data = await graphql<{ page: DotPage | null }>(PAGE_QUERY, {
    url: path,
    languageId: DEFAULT_LANGUAGE_ID,
    mode: "LIVE",
    siteId: DOTCMS_SITE_ID,
  });
  return data?.page ?? null;
}

/**
 * Top navigation from the dotCMS navigation tree (menu-enabled pages under the
 * site root) — the same GraphQL `DotNavigation` query the web app uses.
 */
export async function getNavigation(depth = 2): Promise<NavItem[]> {
  const data = await graphql<{
    DotNavigation?: {
      children?: Array<{ title?: string; href?: string; type?: string }>;
    };
  }>(`{ DotNavigation(uri: "/", depth: ${depth}) { children { title href type } } }`);

  const children = data?.DotNavigation?.children ?? [];
  return children
    .filter((c): c is { title: string; href: string; type?: string } =>
      Boolean(c?.title && c?.href),
    )
    .map((c) => ({
      title: c.title,
      href: c.href,
      external: c.type === "link" || /^https?:\/\//.test(c.href),
    }));
}

/** Lucene search against the Content API (live content, anonymous). */
async function searchContent<T extends Contentlet>(
  luceneQuery: string,
  options: { limit?: number; offset?: number; sort?: string } = {},
): Promise<{ contentlets: T[]; total: number }> {
  const { limit = 12, offset = 0, sort } = options;
  try {
    const res = await fetch(`${DOTCMS_HOST}/api/content/_search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: luceneQuery, limit, offset, sort }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as {
      entity?: {
        jsonObjectView?: { contentlets?: T[] };
        resultsSize?: number;
      };
    };
    return {
      contentlets: json.entity?.jsonObjectView?.contentlets ?? [],
      total: json.entity?.resultsSize ?? 0,
    };
  } catch (error) {
    console.warn(`[dotCMS] Search failed for "${luceneQuery}":`, error);
    return { contentlets: [], total: 0 };
  }
}

/** Blog listing, newest first (this instance's Blog type sorts by modDate). */
export async function getBlogListing(
  limit = 24,
): Promise<{ blogs: BlogContentlet[]; total: number }> {
  const { contentlets, total } = await searchContent<BlogContentlet>(
    `+contentType:Blog +live:true +languageId:${DEFAULT_LANGUAGE_ID}`,
    { limit, sort: "modDate desc" },
  );
  return { blogs: contentlets, total };
}

/** Fetch a single Blog by its `urlTitle` slug (used by the detail screen). */
export async function getBlogByUrlTitle(
  urlTitle: string,
): Promise<BlogContentlet | null> {
  const { contentlets } = await searchContent<BlogContentlet>(
    `+contentType:Blog +live:true +languageId:${DEFAULT_LANGUAGE_ID} +Blog.urlTitle:${urlTitle}`,
    { limit: 1 },
  );
  return contentlets[0] ?? null;
}

/**
 * Newest live contentlets of a type, backing the recommendation grids that
 * replace the Velocity `VtlInclude` widgets (see components/content-types/
 * vtl-include.tsx). The web app proxies this through a Next.js route handler;
 * here the instance serves live content anonymously, so we query it directly.
 */
export async function getRecommendations(
  contentType: string,
  limit = 3,
): Promise<Contentlet[]> {
  const { contentlets } = await searchContent<Contentlet>(
    `+contentType:${contentType} +live:true +languageId:${DEFAULT_LANGUAGE_ID}`,
    { limit, sort: "modDate desc" },
  );
  return contentlets;
}
