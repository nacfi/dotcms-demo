import { getNavigation } from "@/lib/dotcms";
import { NavBar } from "./nav-bar";

/**
 * Server component: fetches the site navigation once (per request) from the
 * dotCMS Navigation API and hands it to the client <NavBar>.
 */
export async function Header() {
  const items = await getNavigation();
  return <NavBar items={items} />;
}
