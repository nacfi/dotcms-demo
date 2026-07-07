import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { usePathname } from "expo-router";
import { getNavigation } from "@/lib/dotcms";
import { openHref } from "@/lib/links";
import { colors } from "@/lib/theme";
import type { NavItem } from "@/lib/types";

// The nav tree changes rarely; fetch it once per app launch and share it
// across every screen that mounts a NavBar.
let navPromise: Promise<NavItem[]> | null = null;
function loadNavigation(): Promise<NavItem[]> {
  navPromise ??= getNavigation();
  return navPromise;
}

const stripSlash = (s: string) => (s !== "/" ? s.replace(/\/$/, "") : s);

/**
 * Horizontal chip navigation fed by the dotCMS navigation tree — the same
 * menu-enabled pages that drive the website header, plus the app's Blog route.
 */
export function NavBar() {
  const pathname = usePathname();
  const [items, setItems] = useState<NavItem[]>([]);

  useEffect(() => {
    let active = true;
    loadNavigation().then((nav) => {
      if (active) setItems(nav);
    });
    return () => {
      active = false;
    };
  }, []);

  const links: NavItem[] = [{ title: "Home", href: "/" }, ...items];
  if (!links.some((l) => stripSlash(l.href).endsWith("/blog"))) {
    links.push({ title: "Blog", href: "/blog" });
  }

  const isActive = (href: string) => {
    const h = stripSlash(href);
    if (h === "/") return pathname === "/";
    // Native paths for dotCMS pages live under /page/<path>.
    return (
      pathname === h ||
      pathname === `/page${h}` ||
      pathname.startsWith(`${h}/`) ||
      pathname.startsWith(`/page${h}/`)
    );
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.bar}
      contentContainerStyle={styles.content}
    >
      {links.map((link) => {
        const active = isActive(link.href);
        return (
          <Pressable
            key={link.href}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => openHref(link.href)}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
              {link.title}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexGrow: 0,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate200,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
  },
  chip: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  chipActive: {
    backgroundColor: colors.slate900,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.slate600,
  },
  chipTextActive: {
    color: colors.white,
  },
});
