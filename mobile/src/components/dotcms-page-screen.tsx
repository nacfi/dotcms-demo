import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { PageBody } from "@/components/page-renderer";
import { getPage } from "@/lib/dotcms";
import { colors } from "@/lib/theme";
import type { DotPage } from "@/lib/types";

/**
 * Shared screen for any dotCMS-driven page: fetches the page for `path`,
 * renders it through <PageBody>, and supports pull-to-refresh — publish in
 * dotCMS, pull down, see the change. Always fetches fresh (no local cache):
 * live content is the point of this demo.
 */
export function DotCMSPageScreen({
  path,
  header,
  onPageLoaded,
}: {
  path: string;
  header?: React.ReactNode;
  onPageLoaded?: (page: DotPage) => void;
}) {
  const [page, setPage] = useState<DotPage | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(
    () =>
      getPage(path).then((result) => {
        if (result) {
          setPage(result);
          setStatus("ready");
          onPageLoaded?.(result);
        } else {
          setStatus((prev) => (prev === "ready" ? prev : "error"));
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [path],
  );

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load().finally(() => setRefreshing(false));
  }, [load]);

  if (status === "loading") {
    return (
      <View style={styles.center}>
        {header}
        <View style={styles.centerFill}>
          <ActivityIndicator size="large" color={colors.indigo600} />
        </View>
      </View>
    );
  }

  if (status === "error" || !page) {
    return (
      <View style={styles.center}>
        {header}
        <View style={styles.centerFill}>
          <Text style={styles.errorTitle}>Couldn’t load this page</Text>
          <Text style={styles.errorBody}>
            Check your connection to the dotCMS instance and try again.
          </Text>
          <Pressable
            style={styles.retry}
            onPress={() => {
              setStatus("loading");
              load();
            }}
          >
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {header}
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.indigo600}
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        <PageBody page={page} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.slate50,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    backgroundColor: colors.slate50,
  },
  centerFill: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 10,
  },
  errorTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.slate800,
  },
  errorBody: {
    fontSize: 14,
    color: colors.slate500,
    textAlign: "center",
  },
  retry: {
    marginTop: 8,
    backgroundColor: colors.slate900,
    borderRadius: 999,
    paddingHorizontal: 22,
    paddingVertical: 10,
  },
  retryText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
});
