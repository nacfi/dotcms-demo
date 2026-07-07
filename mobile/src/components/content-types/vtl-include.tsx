import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { getRecommendations } from "@/lib/dotcms";
import { formatDate, stripHtml } from "@/lib/format";
import { openHref } from "@/lib/links";
import { cardShadow, colors } from "@/lib/theme";
import type { Contentlet } from "@/lib/types";
import { Product } from "./product";
import { WidgetPlaceholder } from "./simple-widget";

/**
 * VtlInclude — a Velocity *include* widget.
 *
 * The contentlet only carries Velocity code that renders server-side, so there
 * is no headless payload. Like the web app, we reimplement the two known
 * recommendation widgets as data-driven components: classify by the
 * author-controlled widget title, then fetch the equivalent live content from
 * the Content API. Unknown widgets degrade to a labelled placeholder.
 */

type RecKind = "product" | "event";

function classifyWidget(title?: string): { contentType: string; kind: RecKind } | null {
  const t = (title ?? "").toLowerCase();
  if (t.includes("product")) return { contentType: "Product", kind: "product" };
  if (t.includes("event")) return { contentType: "calendarEvent", kind: "event" };
  return null;
}

export function VtlInclude({ contentlet }: { contentlet: Contentlet }) {
  const heading = (contentlet.widgetTitle ?? contentlet.title) as
    | string
    | undefined;
  const match = classifyWidget(heading);
  const contentType = match?.contentType;

  // Results are tagged with the type they belong to, so a stale response for a
  // previous type simply reads as "still loading".
  const [result, setResult] = useState<{ type: string; items: Contentlet[] } | null>(
    null,
  );

  useEffect(() => {
    if (!contentType) return;
    let active = true;
    getRecommendations(contentType, 6).then((items) => {
      if (active) setResult({ type: contentType, items });
    });
    return () => {
      active = false;
    };
  }, [contentType]);

  if (!match) return <WidgetPlaceholder title={heading} />;

  const items = result && result.type === contentType ? result.items : null;
  if (items && items.length === 0) return <WidgetPlaceholder title={heading} />;

  return (
    <View style={styles.section}>
      {heading ? <Text style={styles.heading}>{heading}</Text> : null}
      {items === null ? (
        <View style={styles.skeletonRow}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={styles.skeleton} />
          ))}
        </View>
      ) : match.kind === "product" ? (
        <FlatList
          data={items}
          horizontal
          keyExtractor={(c) => c.identifier}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.rail}
          renderItem={({ item }) => <Product contentlet={item} />}
        />
      ) : (
        <View style={styles.eventList}>
          {items.map((event) => (
            <EventCard key={event.identifier} event={event} />
          ))}
        </View>
      )}
    </View>
  );
}

/** Compact card for a calendarEvent (no image in this content model). */
function EventCard({ event }: { event: Contentlet }) {
  const date = formatDate(event.startDate as string | undefined);
  const teaser = stripHtml(event.description);
  const href = (event.urlMap ??
    (event.urlTitle ? `/events/${event.urlTitle}` : undefined)) as
    | string
    | undefined;

  return (
    <Pressable
      style={styles.eventCard}
      onPress={href ? () => openHref(href) : undefined}
    >
      {date ? <Text style={styles.eventDate}>{date}</Text> : null}
      <Text style={styles.eventTitle}>{event.title}</Text>
      {teaser ? (
        <Text style={styles.eventTeaser} numberOfLines={3}>
          {teaser}
        </Text>
      ) : null}
      {href ? <Text style={styles.eventLink}>View event →</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: 20,
    gap: 14,
  },
  heading: {
    paddingHorizontal: 20,
    fontSize: 22,
    fontWeight: "700",
    color: colors.slate900,
    letterSpacing: -0.3,
  },
  rail: {
    paddingHorizontal: 20,
    gap: 12,
  },
  skeletonRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
  },
  skeleton: {
    width: 176,
    height: 180,
    borderRadius: 16,
    backgroundColor: colors.slate100,
  },
  eventList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  eventCard: {
    ...cardShadow,
    padding: 18,
    gap: 6,
  },
  eventDate: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    color: colors.indigo600,
  },
  eventTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.slate900,
  },
  eventTeaser: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.slate600,
  },
  eventLink: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "500",
    color: colors.indigo600,
  },
});
