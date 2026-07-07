import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { contentletImage } from "@/lib/images";
import { openHref } from "@/lib/links";
import { cardShadow, colors } from "@/lib/theme";
import type { Contentlet } from "@/lib/types";

/** Activity content type — image, title, short description, detail link. */
export function Activity({
  contentlet,
  width,
}: {
  contentlet: Contentlet;
  width?: number;
}) {
  const image = contentletImage(contentlet, "image");
  const href = (contentlet.urlMap ?? contentlet.url) as string | undefined;
  const description = contentlet.description as string | undefined;

  return (
    <Pressable
      style={[styles.card, width != null ? { width } : styles.fluid]}
      onPress={href ? () => openHref(href) : undefined}
    >
      <View style={styles.imageBox}>
        {image ? (
          <Image
            source={{ uri: image }}
            alt={String(contentlet.title ?? "Activity")}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={150}
          />
        ) : null}
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {contentlet.title}
        </Text>
        {description ? (
          <Text style={styles.description} numberOfLines={3}>
            {description}
          </Text>
        ) : null}
        {href ? <Text style={styles.link}>Discover →</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    ...cardShadow,
    overflow: "hidden",
  },
  fluid: {
    marginHorizontal: 20,
  },
  imageBox: {
    aspectRatio: 4 / 3,
    backgroundColor: colors.slate100,
  },
  body: {
    padding: 16,
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.slate900,
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.slate600,
  },
  link: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "500",
    color: colors.indigo600,
  },
});
