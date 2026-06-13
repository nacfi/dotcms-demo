import { notFound } from "next/navigation";
import type { DotCMSPageRequestParams } from "@dotcms/types";
import { DotCMSPage } from "@/components/dotcms-page";
import { BannerCarousel } from "@/components/content-types/banner-carousel";
import { SetupNotice } from "@/components/setup-notice";
import { getBanners, getPage, isDotCMSConfigured } from "@/lib/dotcms";

// Authenticated, editor-aware content — always render at request time.
export const dynamic = "force-dynamic";

/**
 * Root optional catch-all. Every dotCMS-managed page (`/`, `/about-us`,
 * `/destinations`, …) is resolved here through the Page API and rendered with
 * the UVE-aware layout renderer. More specific routes (e.g. `/blog`) take
 * precedence over this catch-all.
 */
export default async function CatchAllPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  const isHome = !slug || slug.length === 0;
  const path = "/" + (slug?.join("/") ?? "");

  // Friendly first-run experience before credentials are configured.
  if (isHome && !isDotCMSConfigured) {
    return <SetupNotice />;
  }

  // Forward the params the UVE iframe appends so the server renders the
  // language / mode / variant the author is actually editing.
  const options: DotCMSPageRequestParams = {};
  const languageId = sp.language_id;
  const mode = sp.mode;
  const variantName = sp.variantName;
  if (typeof languageId === "string") options.languageId = languageId;
  if (typeof mode === "string") {
    options.mode = mode as DotCMSPageRequestParams["mode"];
  }
  if (typeof variantName === "string") options.variantName = variantName;

  // On the home route, also aggregate Banner content into a hero carousel
  // (Content API). Other routes render purely from the dotCMS page layout.
  const [pageResponse, banners] = await Promise.all([
    getPage(path, options),
    isHome ? getBanners({ limit: 5 }) : Promise.resolve([]),
  ]);

  if (!pageResponse?.pageAsset) {
    notFound();
  }

  return (
    <>
      {isHome && banners.length > 0 && <BannerCarousel banners={banners} />}
      <DotCMSPage pageResponse={pageResponse} />
    </>
  );
}

