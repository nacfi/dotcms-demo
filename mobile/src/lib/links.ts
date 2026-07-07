import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";

/**
 * Route a dotCMS href to the right native screen.
 *
 * Content links coming out of dotCMS are site-relative URLs (nav entries,
 * banner links, urlMaps like /store/products/<slug>). Screens the app
 * implements natively (home, blog) get pushed on the stack; any other dotCMS
 * page renders through the generic /page/[...slug] screen; absolute URLs open
 * in the in-app browser.
 */
export function openHref(href?: string | null): void {
  if (!href) return;

  if (/^https?:\/\//.test(href)) {
    WebBrowser.openBrowserAsync(href).catch(() => {});
    return;
  }

  const path = href !== "/" ? href.replace(/\/$/, "") : "/";

  if (path === "/" || path === "/index") {
    router.push("/");
    return;
  }
  if (path === "/blog") {
    router.push("/blog");
    return;
  }
  const blogPost = path.match(/^\/blog\/(.+)$/);
  if (blogPost) {
    const slug = blogPost[1].split("/").pop()!;
    router.push({ pathname: "/blog/[slug]", params: { slug } });
    return;
  }

  router.push({
    pathname: "/page/[...slug]",
    params: { slug: path.replace(/^\//, "").split("/") },
  });
}
