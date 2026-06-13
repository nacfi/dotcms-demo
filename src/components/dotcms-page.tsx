"use client";

import { useMemo, type ReactNode } from "react";
import { DotCMSLayoutBody, useEditableDotCMSPage } from "@dotcms/react";
import type { DotCMSPageAsset, DotCMSPageResponse } from "@dotcms/types";
import { COMPONENTS_MAP } from "@/components/content-types";
import { BannerCarousel } from "@/components/content-types/banner-carousel";
import type { BannerContentlet } from "@/lib/types";

// Mirrors RENDER_MODE in lib/dotcms, kept local so this client component
// doesn't pull the server data layer into the browser bundle.
const RENDER_MODE: "production" | "development" =
  process.env.NODE_ENV === "production" ? "production" : "development";

/**
 * Group the Banner contentlets within a container into a single carousel.
 *
 * `DotCMSLayoutBody` renders one component per contentlet, so a multi-slide
 * banner can't be expressed by the components map alone. The `slots` prop lets
 * us override rendering per contentlet identifier: the first banner of a group
 * becomes the `<BannerCarousel>` (fed all the banners in that container), and
 * the rest render nothing. A lone banner is left to the normal Banner
 * component so its in-context editing stays pristine.
 *
 * The result: authors add/remove banners in a container via UVE and it becomes
 * a carousel automatically — driven by real page content, not a side query.
 */
function buildBannerCarouselSlots(
  pageAsset?: DotCMSPageAsset,
): Record<string, ReactNode> {
  const slots: Record<string, ReactNode> = {};
  const containers = pageAsset?.containers ?? {};

  for (const containerId of Object.keys(containers)) {
    const byUuid = containers[containerId]?.contentlets ?? {};
    for (const uuid of Object.keys(byUuid)) {
      const banners = (byUuid[uuid] ?? []).filter(
        (c) => c.contentType === "Banner",
      ) as BannerContentlet[];

      if (banners.length >= 2) {
        slots[banners[0].identifier] = <BannerCarousel banners={banners} />;
        for (let i = 1; i < banners.length; i++) {
          slots[banners[i].identifier] = null;
        }
      }
    }
  }
  return slots;
}

/**
 * Client boundary for a dotCMS page.
 *
 * `useEditableDotCMSPage` initialises the Universal Visual Editor (UVE): when
 * the app is loaded inside the dotCMS editor iframe it subscribes to content
 * changes and re-renders in place as the author edits. Outside the editor it
 * simply returns the page unchanged, so the same component serves both the
 * public site and the editing experience.
 *
 * `<DotCMSLayoutBody>` walks the page layout (rows → columns → containers) and
 * renders each contentlet via COMPONENTS_MAP, keyed by content-type variable
 * (with banner groups upgraded to a carousel via `slots`).
 */
export function DotCMSPage({
  pageResponse,
}: {
  pageResponse: DotCMSPageResponse;
}) {
  const { pageAsset } = useEditableDotCMSPage(pageResponse);
  const slots = useMemo(() => buildBannerCarouselSlots(pageAsset), [pageAsset]);

  return (
    <DotCMSLayoutBody
      page={pageAsset}
      components={COMPONENTS_MAP}
      mode={RENDER_MODE}
      slots={slots}
    />
  );
}
