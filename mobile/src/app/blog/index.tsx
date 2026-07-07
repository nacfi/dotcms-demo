import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BlogCard } from "@/components/blog-card";
import { getBlogListing } from "@/lib/dotcms";
import { colors } from "@/lib/theme";
import type { BlogContentlet } from "@/lib/types";

/** Blog listing — Blog contentlets from the Content API, newest first. */
export default function BlogListScreen() {
  const [blogs, setBlogs] = useState<BlogContentlet[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(
    () => getBlogListing(24).then(({ blogs: items }) => setBlogs(items)),
    [],
  );

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load().finally(() => setRefreshing(false));
  }, [load]);

  if (blogs === null) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.indigo600} />
      </View>
    );
  }

  return (
    <FlatList
      data={blogs}
      keyExtractor={(b) => b.identifier}
      contentContainerStyle={styles.list}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.indigo600}
        />
      }
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.kicker}>From the blog</Text>
          <Text style={styles.heading}>Latest stories</Text>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.center}>
          <Text style={styles.empty}>No blog posts found.</Text>
        </View>
      }
      renderItem={({ item }) => <BlogCard blog={item} />}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
    gap: 2,
  },
  kicker: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    color: colors.indigo600,
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
    color: colors.slate900,
  },
  separator: {
    height: 16,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  empty: {
    fontSize: 14,
    color: colors.slate500,
  },
});
