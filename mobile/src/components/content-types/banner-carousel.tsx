import { useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { colors } from "@/lib/theme";
import type { Contentlet } from "@/lib/types";
import { Banner } from "./banner";

/**
 * Carousel for a container that groups two or more Banner contentlets —
 * the same author-driven grouping the web app applies (add/remove banners in
 * the visual editor and the hero becomes/stops being a carousel).
 */
export function BannerCarousel({ banners }: { banners: Contentlet[] }) {
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList<Contentlet>>(null);

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIndex(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  return (
    <View>
      <FlatList
        ref={listRef}
        data={banners}
        keyExtractor={(b) => b.identifier}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        renderItem={({ item }) => (
          <View style={{ width }}>
            <Banner contentlet={item} />
          </View>
        )}
      />
      <View style={styles.dots}>
        {banners.map((b, i) => (
          <View
            key={b.identifier}
            style={[styles.dot, i === index && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dots: {
    position: "absolute",
    bottom: 14,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.45)",
  },
  dotActive: {
    backgroundColor: colors.white,
  },
});
