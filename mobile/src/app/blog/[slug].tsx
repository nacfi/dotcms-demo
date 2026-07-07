import { useCallback, useEffect, useState } from "react";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BlockEditor } from "@/components/block-editor";
import { CallToAction } from "@/components/content-types/call-to-action";
import { getBlogByUrlTitle } from "@/lib/dotcms";
import { formatDate, stripHtml } from "@/lib/format";
import { contentletImage } from "@/lib/images";
import { colors } from "@/lib/theme";
import type { BlogContentlet } from "@/lib/types";

/** Blog detail — Block Editor body rendered natively (see block-editor.tsx). */
export default function BlogDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [blog, setBlog] = useState<BlogContentlet | null | undefined>(undefined);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(() => {
    if (!slug) return Promise.resolve();
    return getBlogByUrlTitle(slug).then(setBlog);
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load().finally(() => setRefreshing(false));
  }, [load]);

  if (blog === undefined) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: "" }} />
        <ActivityIndicator size="large" color={colors.indigo600} />
      </View>
    );
  }

  if (blog === null) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: "Not found" }} />
        <Text style={styles.notFound}>This post doesn’t exist (anymore).</Text>
      </View>
    );
  }

  const hero = contentletImage(blog, "image");
  const date = formatDate(blog.publishDate ?? blog.modDate);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.indigo600}
        />
      }
    >
      <Stack.Screen options={{ title: "" }} />
      <Text style={styles.title}>{blog.title}</Text>
      {date ? <Text style={styles.date}>{date}</Text> : null}
      {blog.teaser ? <Text style={styles.teaser}>{blog.teaser}</Text> : null}

      {hero ? (
        <Image
          source={{ uri: hero }}
          alt={blog.title ?? "Blog hero"}
          style={styles.hero}
          contentFit="cover"
          transition={200}
        />
      ) : null}

      <View style={styles.body}>
        {blog.blogContent ? (
          <BlockEditor doc={blog.blogContent} />
        ) : blog.body ? (
          <Text style={styles.fallbackBody}>{stripHtml(blog.body)}</Text>
        ) : (
          <Text style={styles.fallbackBody}>This post has no body content.</Text>
        )}
      </View>

      <CallToAction
        contentlet={{
          headline: "Enjoyed this story?",
          subHeading: "Explore more destinations, tips, and guides on the blog.",
          buttonText1: "Read more stories",
          buttonUrl1: "/blog",
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.slate50,
  },
  content: {
    paddingVertical: 24,
    paddingBottom: 48,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: colors.slate50,
  },
  notFound: {
    fontSize: 15,
    color: colors.slate500,
  },
  title: {
    paddingHorizontal: 20,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
    letterSpacing: -0.5,
    color: colors.slate900,
  },
  date: {
    paddingHorizontal: 20,
    marginTop: 8,
    fontSize: 14,
    color: colors.slate500,
  },
  teaser: {
    paddingHorizontal: 20,
    marginTop: 12,
    fontSize: 16,
    lineHeight: 24,
    color: colors.slate600,
  },
  hero: {
    marginHorizontal: 20,
    marginTop: 20,
    aspectRatio: 2 / 1,
    borderRadius: 16,
    backgroundColor: colors.slate100,
  },
  body: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  fallbackBody: {
    fontSize: 16,
    lineHeight: 25,
    color: colors.slate700,
  },
});
