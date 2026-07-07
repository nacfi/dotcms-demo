import { Pressable, StyleSheet, Text, View } from "react-native";
import { openHref } from "@/lib/links";
import { colors } from "@/lib/theme";
import type { Contentlet } from "@/lib/types";

/**
 * Call To Action content type — `headline` + `subHeading` and up to two
 * buttons (`buttonText1`/`buttonUrl1`, `buttonText2`/`buttonUrl2`).
 */
export function CallToAction({ contentlet }: { contentlet: Partial<Contentlet> }) {
  const heading = (contentlet.headline ?? contentlet.title) as
    | string
    | undefined;
  const body = (contentlet.subHeading ?? contentlet.description) as
    | string
    | undefined;

  const buttons = [
    { text: contentlet.buttonText1, url: contentlet.buttonUrl1 },
    { text: contentlet.buttonText2, url: contentlet.buttonUrl2 },
  ].filter((b): b is { text: string; url: string } =>
    Boolean(b.text && b.url),
  );

  if (!heading && !body && buttons.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <View style={styles.panel}>
        {heading ? <Text style={styles.heading}>{heading}</Text> : null}
        {body ? <Text style={styles.body}>{body}</Text> : null}
        {buttons.length > 0 ? (
          <View style={styles.buttonRow}>
            {buttons.map((b, i) => (
              <Pressable
                key={`${b.url}-${i}`}
                style={i === 0 ? styles.primaryBtn : styles.secondaryBtn}
                onPress={() => openHref(b.url)}
              >
                <Text
                  style={i === 0 ? styles.primaryBtnText : styles.secondaryBtnText}
                >
                  {b.text}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  panel: {
    backgroundColor: colors.indigo600,
    borderRadius: 24,
    paddingHorizontal: 28,
    paddingVertical: 36,
    alignItems: "center",
    gap: 12,
  },
  heading: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  body: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  buttonRow: {
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  primaryBtn: {
    backgroundColor: colors.white,
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 11,
  },
  primaryBtnText: {
    color: colors.indigo700,
    fontSize: 14,
    fontWeight: "600",
  },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.7)",
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 11,
  },
  secondaryBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
});
