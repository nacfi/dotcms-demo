import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { contentletImage } from "@/lib/images";
import { cardShadow, colors } from "@/lib/theme";
import type { Contentlet } from "@/lib/types";

/**
 * Testimonial content type (custom, created for this demo) — `quote`,
 * `authorName`, `authorTitle`, optional `image` avatar.
 */
export function Testimonial({ contentlet }: { contentlet: Contentlet }) {
  const quote = contentlet.quote as string | undefined;
  const authorName = contentlet.authorName as string | undefined;
  const authorTitle = contentlet.authorTitle as string | undefined;
  if (!quote && !authorName) return null;

  const avatar = contentletImage(contentlet, "image");

  return (
    <View style={styles.wrap}>
      <View style={styles.card}>
        <Text style={styles.quoteMark}>“</Text>
        {quote ? <Text style={styles.quote}>{quote}</Text> : null}
        <View style={styles.authorRow}>
          {avatar ? (
            <Image
              source={{ uri: avatar }}
              alt={authorName ?? "Author"}
              style={styles.avatar}
              transition={150}
            />
          ) : null}
          <View>
            {authorName ? <Text style={styles.name}>{authorName}</Text> : null}
            {authorTitle ? <Text style={styles.role}>{authorTitle}</Text> : null}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  card: {
    ...cardShadow,
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
  },
  quoteMark: {
    fontSize: 44,
    lineHeight: 44,
    color: colors.indigo300,
    fontWeight: "800",
  },
  quote: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "500",
    color: colors.slate800,
    textAlign: "center",
  },
  authorRow: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.slate100,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.slate900,
  },
  role: {
    fontSize: 13,
    color: colors.slate500,
  },
});
