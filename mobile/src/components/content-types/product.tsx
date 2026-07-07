import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { contentletImage } from "@/lib/images";
import { openHref } from "@/lib/links";
import { cardShadow, colors } from "@/lib/theme";
import type { Contentlet } from "@/lib/types";

/** Product content type (Store) — image, title, and retail/sale pricing. */
export function Product({
  contentlet,
  width = 176,
}: {
  contentlet: Contentlet;
  width?: number;
}) {
  const image = contentletImage(contentlet, "image");
  const href = (contentlet.urlMap ?? contentlet.url) as string | undefined;

  const retail =
    contentlet.retailPrice != null ? Number(contentlet.retailPrice) : undefined;
  const sale =
    contentlet.salePrice != null ? Number(contentlet.salePrice) : undefined;
  const onSale = sale != null && retail != null && sale < retail;

  return (
    <Pressable
      style={[styles.card, { width }]}
      onPress={href ? () => openHref(href) : undefined}
    >
      <View style={styles.imageBox}>
        {image ? (
          <Image
            source={{ uri: image }}
            alt={String(contentlet.title ?? "Product")}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={150}
          />
        ) : null}
        {onSale ? (
          <View style={styles.saleBadge}>
            <Text style={styles.saleBadgeText}>Sale</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {contentlet.title}
        </Text>
        {onSale ? (
          <View style={styles.priceRow}>
            <Text style={styles.salePrice}>${sale.toFixed(2)}</Text>
            <Text style={styles.strikePrice}>${retail.toFixed(2)}</Text>
          </View>
        ) : retail != null ? (
          <Text style={styles.price}>${retail.toFixed(2)}</Text>
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
    aspectRatio: 1,
    backgroundColor: colors.slate100,
  },
  saleBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: colors.rose600,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  saleBadgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "700",
  },
  body: {
    padding: 12,
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.slate900,
    lineHeight: 19,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  price: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.slate900,
  },
  salePrice: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.rose600,
  },
  strikePrice: {
    fontSize: 13,
    color: colors.slate400,
    textDecorationLine: "line-through",
  },
});
