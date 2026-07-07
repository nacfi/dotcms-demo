import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { contentletImage, dotShorty } from "@/lib/images";
import { colors } from "@/lib/theme";
import type { Contentlet } from "@/lib/types";

/** Image content type — the asset with an optional title caption. */
export function ImageContent({ contentlet }: { contentlet: Contentlet }) {
  const src =
    contentletImage(contentlet, "fileAsset") ?? dotShorty(contentlet.identifier);
  if (!src) return null;

  return (
    <View style={styles.wrap}>
      <Image
        source={{ uri: src }}
        alt={String(contentlet.title ?? "Image")}
        style={styles.image}
        contentFit="cover"
        transition={150}
      />
      {contentlet.title ? (
        <Text style={styles.caption}>{contentlet.title}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 6,
  },
  image: {
    width: "100%",
    aspectRatio: 3 / 2,
    borderRadius: 14,
    backgroundColor: colors.slate100,
  },
  caption: {
    fontSize: 13,
    color: colors.slate500,
    textAlign: "center",
  },
});
