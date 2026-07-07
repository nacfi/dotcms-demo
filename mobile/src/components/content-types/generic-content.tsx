import { StyleSheet, Text, View } from "react-native";
import { stripHtml } from "@/lib/format";
import { cardShadow, colors } from "@/lib/theme";
import type { Contentlet } from "@/lib/types";

/**
 * Fallback for content types without a dedicated component — shows the type
 * and whatever readable fields it has, so newly-modelled content is visible
 * (and obviously unstyled) rather than silently dropped.
 */
export function GenericContent({ contentlet }: { contentlet: Contentlet }) {
  const body = stripHtml(contentlet.body ?? contentlet.description);

  return (
    <View style={styles.wrap}>
      <View style={styles.card}>
        <Text style={styles.type}>{contentlet.contentType}</Text>
        {contentlet.title ? (
          <Text style={styles.title}>{contentlet.title}</Text>
        ) : null}
        {body ? (
          <Text style={styles.body} numberOfLines={6}>
            {body}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  card: {
    ...cardShadow,
    padding: 18,
    gap: 6,
  },
  type: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    color: colors.slate400,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.slate900,
  },
  body: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.slate600,
  },
});
