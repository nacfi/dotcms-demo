import type { SimpleWidgetContentlet } from "@/lib/types";

/**
 * SimpleWidget content type. The body is server-rendered Velocity
 * (`widgetCode`), which doesn't translate to a headless React render, so we
 * surface the widget title rather than inject raw template code. A real
 * integration would request the server-rendered output or reimplement the
 * widget as a React component.
 */
export function SimpleWidget(props: Partial<SimpleWidgetContentlet>) {
  const title = props.widgetTitle ?? props.title;
  if (!title) return null;

  return (
    <section className="px-6 py-6">
      <div className="mx-auto max-w-3xl rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-4 text-sm text-slate-500">
        Widget:{" "}
        <span className="font-medium text-slate-700">{title}</span>
      </div>
    </section>
  );
}
