import type { GenericContentlet } from "@/lib/types";

/**
 * Generic rich-text content (e.g. "Content - Generic" / webPageContent).
 * Renders the WYSIWYG `body` HTML the author entered in dotCMS.
 */
export function GenericContent(props: Partial<GenericContentlet>) {
  const heading = props.widgetTitle ?? props.title;
  const body = props.body;

  if (!heading && !body) return null;

  return (
    <section className="px-6 py-10">
      <div className="mx-auto max-w-3xl">
        {heading && (
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-slate-900">
            {heading}
          </h2>
        )}
        {body && (
          <div
            className="space-y-4 leading-relaxed text-slate-700 [&_a]:text-indigo-600 [&_a]:underline [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-semibold [&_img]:rounded-lg [&_ul]:list-disc [&_ul]:pl-6"
            dangerouslySetInnerHTML={{ __html: body }}
          />
        )}
      </div>
    </section>
  );
}
