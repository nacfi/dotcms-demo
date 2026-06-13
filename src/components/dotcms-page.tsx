"use client";

import { DotCMSLayoutBody, useEditableDotCMSPage } from "@dotcms/react";
import type { DotCMSPageResponse } from "@dotcms/types";
import { COMPONENTS_MAP } from "@/components/content-types";

// Mirrors RENDER_MODE in lib/dotcms, kept local so this client component
// doesn't pull the server data layer into the browser bundle.
const RENDER_MODE: "production" | "development" =
  process.env.NODE_ENV === "production" ? "production" : "development";

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
 * renders each contentlet via COMPONENTS_MAP, keyed by content-type variable.
 */
export function DotCMSPage({
  pageResponse,
}: {
  pageResponse: DotCMSPageResponse;
}) {
  const { pageAsset } = useEditableDotCMSPage(pageResponse);

  return (
    <DotCMSLayoutBody
      page={pageAsset}
      components={COMPONENTS_MAP}
      mode={RENDER_MODE}
    />
  );
}
