"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Product } from "./product";
import { formatDate } from "@/lib/format";
import type {
  CalendarEventContentlet,
  ProductContentlet,
  VtlIncludeContentlet,
} from "@/lib/types";

/**
 * VtlInclude — a Velocity *include* widget.
 *
 * The contentlet only carries the Velocity `widgetCode` that `#dotParse`s a
 * server-side `.vtl` file, so there is no headless JSON payload to render and
 * the SDK's GraphQL Page API can't hand us the executed HTML. dotCMS's own
 * guidance for widgets in a headless app is therefore to *reimplement* them as
 * components — which is what we do for the two known recommendation widgets,
 * fetching the equivalent content through the `/api/recommendations` route.
 *
 * Anything we don't recognise degrades to a clearly-labelled placeholder rather
 * than injecting raw Velocity or silently rendering nothing.
 */

type RecKind = "product" | "event";
type Recommendation = { contentType: string; kind: RecKind };

/** Map a widget by its (author-controlled) title to the content it stands in for. */
function classifyWidget(title?: string): Recommendation | null {
  const t = (title ?? "").toLowerCase();
  if (t.includes("product")) return { contentType: "Product", kind: "product" };
  if (t.includes("event")) return { contentType: "calendarEvent", kind: "event" };
  return null;
}

export function VtlInclude(props: Partial<VtlIncludeContentlet>) {
  const heading = props.widgetTitle ?? props.title;
  const match = classifyWidget(heading);
  const contentType = match?.contentType;

  // State is tagged with the content type it belongs to, so we never need to
  // reset it synchronously inside the effect (which triggers cascading renders)
  // — a result for a stale type simply reads as "still loading".
  const [result, setResult] = useState<{
    type: string;
    items: Record<string, unknown>[];
  } | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);

  useEffect(() => {
    if (!contentType) return;
    let active = true;

    fetch(`/api/recommendations?type=${encodeURIComponent(contentType)}&limit=3`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: { contentlets?: Record<string, unknown>[] }) => {
        if (active) setResult({ type: contentType, items: data.contentlets ?? [] });
      })
      .catch(() => {
        if (active) setErrorType(contentType);
      });

    return () => {
      active = false;
    };
  }, [contentType]);

  const items = result && result.type === contentType ? result.items : null;
  const failed = errorType === contentType;

  // Unknown widget (or the fetch failed): show the labelled placeholder.
  if (!match || failed) return <WidgetPlaceholder title={heading} />;

  return (
    <section className="px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {heading && (
          <h2 className="mb-6 text-2xl font-bold tracking-tight text-slate-900">
            {heading}
          </h2>
        )}

        {items === null ? (
          <CardSkeleton />
        ) : items.length === 0 ? (
          <WidgetPlaceholder title={heading} />
        ) : match.kind === "product" ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {(items as unknown as ProductContentlet[]).map((p) => (
              <Product key={p.identifier} {...p} />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(items as unknown as CalendarEventContentlet[]).map((e) => (
              <EventCard key={e.identifier} event={e} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/** Compact card for an Event (no image in this content model). */
function EventCard({ event }: { event: CalendarEventContentlet }) {
  const date = formatDate(event.startDate);
  const teaser = stripHtml(event.description);
  const href =
    event.urlMap ??
    (event.urlTitle ? `/events/${event.urlTitle}` : undefined);

  const card = (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {date && (
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
          {date}
        </p>
      )}
      <h3 className="mt-1 text-lg font-semibold text-slate-900">
        {event.title}
      </h3>
      {teaser && (
        <p className="mt-2 line-clamp-3 text-sm text-slate-600">{teaser}</p>
      )}
      {href && (
        <span className="mt-4 inline-block text-sm font-medium text-indigo-600">
          View event →
        </span>
      )}
    </div>
  );

  return href ? (
    <Link href={href} className="block h-full">
      {card}
    </Link>
  ) : (
    card
  );
}

/** Labelled placeholder, mirroring the SimpleWidget treatment. */
function WidgetPlaceholder({ title }: { title?: string }) {
  if (!title) return null;
  return (
    <section className="px-6 py-6">
      <div className="mx-auto max-w-3xl rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-4 text-sm text-slate-500">
        Widget: <span className="font-medium text-slate-700">{title}</span>
      </div>
    </section>
  );
}

function CardSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-3" aria-hidden="true">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-44 animate-pulse rounded-2xl bg-slate-100" />
      ))}
    </div>
  );
}

/** Strip HTML tags so a WYSIWYG `description` can be used as a plain teaser. */
function stripHtml(html?: string): string {
  return (html ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
