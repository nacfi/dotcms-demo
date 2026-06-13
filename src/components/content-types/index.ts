import type { ComponentType } from "react";
import { Banner } from "./banner";
import { CallToAction } from "./call-to-action";
import { Product } from "./product";
import { Activity } from "./activity";
import { SimpleWidget } from "./simple-widget";
import { YouTube } from "./youtube";
import { Testimonial } from "./testimonial";
import { ImageContent } from "./image";
import { GenericContent } from "./generic-content";

/**
 * Maps dotCMS content-type *variable names* → React components.
 *
 * <DotCMSLayoutBody> looks up `components[contentlet.contentType]` for every
 * contentlet in a container and renders `<Component {...contentlet} />`. Any
 * content type without an entry here (e.g. VtlInclude — a Velocity include)
 * falls back to the SDK's default renderer (with a visible indicator in
 * `development` mode).
 *
 * Keys confirmed against the awesome-demo-dev (Travel starter) content model.
 * `Testimonial` is a custom content type added for the extra-credit task.
 */
const map = {
  Banner,
  CallToAction,
  Product,
  Activity,
  SimpleWidget,
  YouTube,
  Testimonial,
  // Present in other starters / pages; harmless if the type doesn't exist:
  Image: ImageContent,
  webPageContent: GenericContent,
};

export const COMPONENTS_MAP = map as Record<
  string,
  ComponentType<Record<string, unknown>>
>;
