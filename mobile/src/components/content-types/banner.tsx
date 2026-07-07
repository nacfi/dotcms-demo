import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { contentletImage } from "@/lib/images";
import { openHref } from "@/lib/links";
import { colors } from "@/lib/theme";
import type { Contentlet } from "@/lib/types";

/**
 * Banner content type — full-bleed hero. Rendered directly for a lone banner,
 * or as a slide inside <BannerCarousel> when a container groups several.
 */
export function Banner({ contentlet }: { contentlet: Contentlet }) {
  const image = contentletImage(contentlet, "image");
  const title = contentlet.title as string | undefined;
  const caption = contentlet.caption as string | undefined;
  const link = contentlet.link as string | undefined;
  const buttonText = contentlet.buttonText as string | undefined;

  return (
    <View style={styles.hero}>
      {image ? (
        <Image
          source={{ uri: image }}
          alt={title ?? caption ?? "Banner"}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={200}
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.fallbackBg]} />
      )}
      <View style={styles.overlay} />
      <View style={styles.content}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        {caption ? <Text style={styles.caption}>{caption}</Text> : null}
        {link ? (
          <Pressable style={styles.button} onPress={() => openHref(link)}>
            <Text style={styles.buttonText}>{buttonText || "Learn more"}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    minHeight: 380,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  fallbackBg: {
    backgroundColor: colors.indigo700,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 56,
    alignItems: "center",
    gap: 14,
    maxWidth: 560,
  },
  title: {
    color: colors.white,
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: -0.5,
  },
  caption: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 17,
    lineHeight: 24,
    textAlign: "center",
  },
  button: {
    marginTop: 8,
    backgroundColor: colors.white,
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  buttonText: {
    color: colors.slate900,
    fontSize: 14,
    fontWeight: "600",
  },
});
