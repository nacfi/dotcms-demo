import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/lib/theme";
import type { Contentlet } from "@/lib/types";

/**
 * Labelled placeholder for widgets whose output is server-side Velocity and
 * has no headless payload (SimpleWidget, unknown VtlIncludes). Mirrors the
 * web app's treatment: visible and named, never raw Velocity or silence.
 */
export function WidgetPlaceholder({ title }: { title?: string }) {
  if (!title) return null;
  return (
    <View style={styles.wrap}>
      <View style={styles.box}>
        <Text style={styles.text}>
          Widget: <Text style={styles.name}>{title}</Text>
        </Text>
      </View>
    </View>
  );
}

/** SimpleWidget content type — Velocity `widgetCode`, shown as a placeholder. */
export function SimpleWidget({ contentlet }: { contentlet: Contentlet }) {
  return (
    <WidgetPlaceholder
      title={(contentlet.widgetTitle ?? contentlet.title) as string | undefined}
    />
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  box: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.slate300,
    backgroundColor: colors.slate50,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  text: {
    fontSize: 13,
    color: colors.slate500,
  },
  name: {
    fontWeight: "600",
    color: colors.slate700,
  },
});
