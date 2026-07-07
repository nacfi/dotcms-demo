import type { ComponentType } from "react";
import type { Contentlet } from "@/lib/types";
import { Activity } from "./activity";
import { Banner } from "./banner";
import { CallToAction } from "./call-to-action";
import { GenericContent } from "./generic-content";
import { ImageContent } from "./image";
import { Product } from "./product";
import { SimpleWidget } from "./simple-widget";
import { Testimonial } from "./testimonial";
import { VtlInclude } from "./vtl-include";
import { YouTube } from "./youtube";

/**
 * dotCMS content-type *variable names* → native components; the same mapping
 * the web app passes to <DotCMSLayoutBody>, consumed here by <PageBody>.
 * Types without an entry fall back to <GenericContent>.
 */
export const COMPONENTS_MAP: Record<
  string,
  ComponentType<{ contentlet: Contentlet }>
> = {
  Banner,
  CallToAction,
  Product,
  Activity,
  SimpleWidget,
  YouTube,
  Testimonial,
  VtlInclude,

  Image: ImageContent,
  webPageContent: GenericContent,
};

export { GenericContent };
