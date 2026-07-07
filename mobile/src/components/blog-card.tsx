import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { formatDate } from "@/lib/format";
import { contentletImage } from "@/lib/images";
import { cardShadow, colors } from "@/lib/theme";
import type { BlogContentlet } from "@/lib/types";

/** Blog listing card — hero image, date, title, teaser. */
export function BlogCard({ blog }: { blog: BlogContentlet }) {
  const image = contentletImage(blog, "image");
  const date = formatDate(blog.publishDate ?? blog.modDate);

  return (
    <Pressable
      style={styles.card}
      onPress={() =>
        blog.urlTitle &&
        router.push({ pathname: "/blog/[slug]", params: { slug: blog.urlTitle } })
      }
    >
      <View style={styles.imageBox}>
        {image ? (
          <Image
            source={{ uri: image }}
            alt={blog.title ?? "Blog post"}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={150}
          />
        ) : null}
      </View>
      <View style={styles.body}>
        {date ? <Text style={styles.date}>{date}</Text> : null}
        <Text style={styles.title} numberOfLines={2}>
          {blog.title}
        </Text>
        {blog.teaser ? (
          <Text style={styles.teaser} numberOfLines={3}>
            {blog.teaser}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    ...cardShadow,
    overflow: "hidden",
  },
  imageBox: {
    aspectRatio: 2 / 1,
    backgroundColor: colors.slate100,
  },
  body: {
    padding: 16,
    gap: 6,
  },
  date: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    color: colors.indigo600,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.slate900,
    lineHeight: 24,
  },
  teaser: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.slate600,
  },
});
