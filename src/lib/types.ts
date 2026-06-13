import type { DotCMSBasicContentlet, BlockEditorNode } from "@dotcms/types";

/**
 * Field-level types for the content types we render.
 *
 * Field *variable names* below were confirmed against the live awesome-demo-dev
 * (Travel starter) instance by introspecting sample contentlets. They extend
 * DotCMSBasicContentlet (which carries the system fields like identifier,
 * modDate, hasTitleImage) and mark content fields optional.
 */

/** A dotCMS image/binary field: a path string, a bare identifier, or an object. */
export type DotImageField =
  | string
  | {
      idPath?: string;
      versionPath?: string;
      path?: string;
      fileName?: string;
    }
  | undefined;

/** Top-nav item (subset of the dotCMS navigation node we actually render). */
export interface NavItem {
  title: string;
  href: string;
  target?: string;
}

/** Banner — hero / carousel slides. */
export interface BannerContentlet extends DotCMSBasicContentlet {
  caption?: string;
  image?: DotImageField;
  link?: string;
  buttonText?: string;
  textColor?: string;
}

/**
 * Call To Action. The starter type has a headline + subheading and up to two
 * buttons; we also accept simpler manual props (heading/body/single button) so
 * the same component can be reused outside UVE (e.g. on the blog detail page).
 */
export interface CallToActionContentlet extends DotCMSBasicContentlet {
  headline?: string;
  subHeading?: string;
  buttonText1?: string;
  buttonUrl1?: string;
  buttonText2?: string;
  buttonUrl2?: string;
  // Manual-usage fallbacks:
  text?: string;
  description?: string;
  link?: string;
  buttonText?: string;
}

/** Blog post. `blogContent` is a Block Editor (Story Block) field. */
export interface BlogContentlet extends DotCMSBasicContentlet {
  urlTitle?: string;
  urlMap?: string;
  teaser?: string;
  blogContent?: BlockEditorNode;
  image?: DotImageField;
  author?: unknown;
  publishDate?: string;
  tags?: string;
}

/** Product (Store) — has retail/sale prices and a urlMap detail path. */
export interface ProductContentlet extends DotCMSBasicContentlet {
  urlTitle?: string;
  urlMap?: string;
  description?: string;
  image?: DotImageField;
  retailPrice?: number | string;
  salePrice?: number | string;
  tags?: string;
}

/** Activity — a travel activity with image, description, and detail urlMap. */
export interface ActivityContentlet extends DotCMSBasicContentlet {
  urlTitle?: string;
  urlMap?: string;
  description?: string;
  body?: string;
  image?: DotImageField;
  altTag?: string;
  tags?: string;
}

/** SimpleWidget — server-rendered velocity widget (e.g. a chatbot embed). */
export interface SimpleWidgetContentlet extends DotCMSBasicContentlet {
  widgetTitle?: string;
  widgetCode?: string;
  code?: string;
}

/** Generic rich-text / widget content. */
export interface GenericContentlet extends DotCMSBasicContentlet {
  body?: string;
  widgetTitle?: string;
}
