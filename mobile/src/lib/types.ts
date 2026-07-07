/** A dotCMS contentlet as returned by GraphQL `_map` / the Content Search API. */
export type Contentlet = {
  identifier: string;
  inode?: string;
  contentType: string;
  title?: string;
  hasTitleImage?: boolean;
  [key: string]: unknown;
};

/** Reference from the page layout to a container instance. */
export type LayoutContainerRef = {
  identifier: string;
  uuid: string;
};

export type LayoutColumn = {
  leftOffset?: number;
  width?: number;
  styleClass?: string | null;
  containers: LayoutContainerRef[];
};

export type LayoutRow = {
  styleClass?: string | null;
  columns: LayoutColumn[];
};

export type PageContainer = {
  path?: string | null;
  identifier: string;
  maxContentlets?: number;
  containerContentlets: Array<{
    uuid: string;
    contentlets: Array<{ _map: Contentlet }>;
  }>;
};

/** The subset of the dotCMS GraphQL `page` query this app renders. */
export type DotPage = {
  title?: string;
  friendlyName?: string;
  pageURI?: string;
  containers: PageContainer[];
  layout?: {
    body?: {
      rows: LayoutRow[];
    };
  };
};

export type NavItem = {
  title: string;
  href: string;
  external?: boolean;
};

export type BlogContentlet = Contentlet & {
  urlTitle?: string;
  teaser?: string;
  publishDate?: string;
  modDate?: string;
  /** Block Editor (Story Block) document. */
  blogContent?: BlockNode;
  body?: string;
};

/** A node of the Block Editor (TipTap-style) JSON document. */
export type BlockNode = {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: Array<{ type?: string; attrs?: Record<string, unknown> }>;
  content?: BlockNode[];
};
