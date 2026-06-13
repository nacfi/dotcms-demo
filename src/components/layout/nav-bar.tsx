"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { NavItem } from "@/lib/types";

const stripSlash = (s: string) => (s !== "/" ? s.replace(/\/$/, "") : s);

/**
 * Top navigation. Links come from the dotCMS Navigation API (the menu-enabled
 * pages of the site); we ensure the app's custom `/blog` route is always
 * present. Pure presentation + a mobile toggle — the data is fetched in the
 * server <Header>.
 */
export function NavBar({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links: NavItem[] = items.map((item) => ({
    href: item.href || "/",
    title: item.title,
    target: item.target,
  }));

  // Guarantee a Blog entry (it's an app route, not necessarily in dotCMS nav).
  if (!links.some((l) => stripSlash(l.href).endsWith("/blog"))) {
    links.push({ href: "/blog", title: "Blog" });
  }

  const isActive = (href: string) => {
    const h = stripSlash(href);
    const p = stripSlash(pathname);
    return h === "/" ? p === "/" : p === h || p.startsWith(h + "/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-900 text-sm font-black text-white">
            d
          </span>
          <span>
            dotCMS<span className="text-indigo-600"> × Next.js</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                target={link.target || undefined}
                className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                  isActive(link.href)
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {link.title}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="grid h-10 w-10 place-items-center rounded-md text-slate-700 hover:bg-slate-100 md:hidden"
        >
          <span className="text-xl leading-none">{open ? "✕" : "☰"}</span>
        </button>
      </nav>

      {open && (
        <ul className="space-y-1 border-t border-slate-200 px-6 py-3 md:hidden">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                target={link.target || undefined}
                onClick={() => setOpen(false)}
                className={`block rounded-md px-3 py-2 text-sm font-medium ${
                  isActive(link.href)
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
