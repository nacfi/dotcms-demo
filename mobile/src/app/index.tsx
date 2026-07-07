import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DotCMSPageScreen } from "@/components/dotcms-page-screen";
import { NavBar } from "@/components/nav-bar";
import { colors } from "@/lib/theme";

/**
 * Home — the dotCMS `/index` page, rendered natively from the same published
 * content as https://dotcms.vercel.app. Pull down to refresh after publishing
 * a change in the visual editor.
 */
export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <DotCMSPageScreen
        path="/index"
        header={
          <View>
            <View style={styles.brandRow}>
              <View style={styles.brandMark}>
                <Text style={styles.brandMarkText}>d</Text>
              </View>
              <Text style={styles.brandName}>dotCMS</Text>
            </View>
            <NavBar />
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.white,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 6,
    backgroundColor: colors.white,
  },
  brandMark: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: colors.slate900,
    alignItems: "center",
    justifyContent: "center",
  },
  brandMarkText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "900",
  },
  brandName: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.3,
    color: colors.slate900,
  },
});
