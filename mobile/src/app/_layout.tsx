import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { colors } from "@/lib/theme";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.white },
          headerTintColor: colors.slate900,
          headerTitleStyle: { fontWeight: "700" },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.slate50 },
        }}
      >
        {/* Home draws its own branded header, like the website's navbar.
            The title still labels the back button on pushed screens. */}
        <Stack.Screen name="index" options={{ headerShown: false, title: "Home" }} />
        <Stack.Screen name="blog/index" options={{ title: "Blog" }} />
      </Stack>
    </>
  );
}
