import { useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { DotCMSPageScreen } from "@/components/dotcms-page-screen";
import { NavBar } from "@/components/nav-bar";

/**
 * Generic dotCMS page screen — renders any other page of the site (store,
 * destinations, url-mapped detail pages…) through the same page renderer,
 * so nav links and content links resolve natively.
 */
export default function GenericPageScreen() {
  const { slug } = useLocalSearchParams<{ slug: string[] }>();
  const segments = Array.isArray(slug) ? slug : slug ? [slug] : [];
  const path = `/${segments.join("/")}`;
  const [title, setTitle] = useState("");

  return (
    <>
      <Stack.Screen options={{ title }} />
      <DotCMSPageScreen
        path={path}
        header={<NavBar />}
        onPageLoaded={(page) => setTitle(page.title ?? page.friendlyName ?? "")}
      />
    </>
  );
}
