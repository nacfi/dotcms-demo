/**
 * dotCMS instance configuration.
 *
 * The demo instance serves live (published) content anonymously through
 * GraphQL and the Content Search API, so the app needs no secret at all —
 * which is exactly what you want in a mobile binary. Override per environment
 * with EXPO_PUBLIC_* vars (inlined at bundle time by Expo).
 */
export const DOTCMS_HOST = (
  process.env.EXPO_PUBLIC_DOTCMS_HOST ?? "https://awesome-demo-dev.dotcms.dev"
).replace(/\/$/, "");

export const DOTCMS_SITE_ID =
  process.env.EXPO_PUBLIC_DOTCMS_SITE_ID ?? "demo.dotcms.com";

export const DEFAULT_LANGUAGE_ID = "1";
