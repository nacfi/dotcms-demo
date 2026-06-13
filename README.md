# dotCMS × Next.js — Headless Demo

A headless [dotCMS](https://www.dotcms.com/) web app built for the **Front-End Sales Engineer** technical challenge. It renders dotCMS pages with the official **dotCMS React SDK**, enables **UVE (Universal Visual Editing)** for in-context authoring, and adds a blog listing/detail experience plus a Banner carousel, Call to Action, and a top navigation built from the dotCMS Navigation API.

> **Status:** verified end-to-end against a live cloud.dotcms.dev Travel-starter environment — home page, navigation, banner carousel, blog listing, and blog detail all render real content. Built on `@dotcms/client` / `@dotcms/react` `1.5.6`. Content-type variable + field names are mapped to the Travel starter and isolated in two spots (see [Adapting to your content model](#adapting-to-your-content-model)).

---

## What it demonstrates

| Challenge requirement | Where |
| --- | --- |
| Use the dotCMS client libraries | `@dotcms/client`, `@dotcms/react`, `@dotcms/types`, `@dotcms/uve` — see [`src/lib/dotcms.ts`](src/lib/dotcms.ts) |
| Configure & enable UVE for page edits | [`src/components/dotcms-page.tsx`](src/components/dotcms-page.tsx) (`useEditableDotCMSPage` + `DotCMSLayoutBody`) + [UVE setup](#4-enable-uve-universal-visual-editing) |
| Page that lists & links to blogs | [`src/app/blog/page.tsx`](src/app/blog/page.tsx) (Content API `getCollection('Blog')`) |
| Blog detail page | [`src/app/blog/[...slug]/page.tsx`](src/app/blog/[...slug]/page.tsx) (`DotCMSBlockEditorRenderer`) |
| Banner component (a carousel) | [`src/components/content-types/banner.tsx`](src/components/content-types/banner.tsx) + [`banner-carousel.tsx`](src/components/content-types/banner-carousel.tsx) |
| Call to Action component | [`src/components/content-types/call-to-action.tsx`](src/components/content-types/call-to-action.tsx) |
| Main navigation | [`src/components/layout/nav-bar.tsx`](src/components/layout/nav-bar.tsx) fed by the dotCMS navigation tree (GraphQL `DotNavigation`) |
| **Extra credit:** Navigation API top nav | ✅ done — see above |
| **Extra credit:** custom content type, Style editor | discussed in [Trade-offs & next steps](#trade-offs--next-steps) |

---

## Architecture at a glance

```
Browser ─▶ Next.js (App Router, RSC)
              │
              ├─ Server Components fetch from dotCMS:
              │    • client.page.get(path)        → page layout + contentlets
              │    • client.content.getCollection → Blog listing / detail / Banners
              │    • client.nav.get('/')          → top navigation
              │
              └─ Client boundary (UVE):
                   useEditableDotCMSPage(page) ──▶ <DotCMSLayoutBody components={MAP}>
                   subscribes to editor changes and re-renders in place
```

Two complementary dotCMS data patterns are shown on purpose:

- **Page API + UVE** drives every dotCMS-managed page through the root catch-all route `src/app/[[...slug]]/page.tsx`. The layout renderer walks rows → columns → containers and renders each contentlet via a **components map keyed by content-type variable** ([`src/components/content-types/index.ts`](src/components/content-types/index.ts)). This is the editable surface.
- **Content API** powers the blog (`/blog`, `/blog/[...slug]`) and the home Banner carousel — querying content directly with the fluent `getCollection()` builder, independent of any page layout.

### Tech choices & why

- **Next.js 16 (App Router, React Server Components, Turbopack).** Server Components let page/content/nav fetching happen on the server with the read token, then hand a serializable page to a thin client boundary where UVE lives. This keeps the editable path isolated to exactly one `'use client'` component.
- **dotCMS React SDK over raw `@dotcms/uve`.** dotCMS recommends the framework SDK; `useEditableDotCMSPage` + `DotCMSLayoutBody` handle the editor handshake, container/row layout, and dev-mode diagnostics so the work is components, not plumbing.
- **React, not Angular.** dotCMS's admin is Angular and ships an official Angular SDK, so Angular is the more "native" route — but React/Next is my strongest stack and the best-supported headless path, which is the pragmatic SE call within the time budget. (Happy to talk through this on the call.)
- **Tailwind v4, zero UI/carousel libraries.** The carousel is hand-built on native CSS scroll-snap — fewer dependencies to justify and full control of the markup.

---

## Getting started

### Prerequisites
- **Node 20.9+** (built on Node 24) and npm
- A dotCMS environment from [cloud.dotcms.dev](https://cloud.dotcms.dev) created with the **Travel** (or Lightweight) starter

### 1. Install

```bash
npm install
```

### 2. Configure your dotCMS connection

```bash
cp .env.example .env.local
```

Then fill in `.env.local`:

```bash
NEXT_PUBLIC_DOTCMS_HOST=https://<your-env>.dotcms.cloud   # your instance URL, no trailing slash
NEXT_PUBLIC_DOTCMS_AUTH_TOKEN=<read-only API token>        # see below
NEXT_PUBLIC_DOTCMS_SITE_ID=<site hostname or identifier>   # optional; defaults to the default site
```

**Generate a read-only API token**
1. Log in to your dotCMS admin.
2. Open the menu → **System → Users**, and pick a user (ideally a dedicated front-end/read-only user, not an admin).
3. Open the **API Access Key** tab → **Request New Token** → set a label + expiration → **Generate**.
4. Copy the JWT into `NEXT_PUBLIC_DOTCMS_AUTH_TOKEN`.

**Find the Site ID**
- Menu → **Site → Sites** (Site Browser). Click your site; its **Identifier** (a UUID) is shown in the site details. You can use either that identifier **or** the site hostname (e.g. `demo.dotcms.com`). Leave blank to use the instance default site.

> These are `NEXT_PUBLIC_` because UVE runs the app inside an iframe and the SDK talks to dotCMS from the browser. **Use a read-only token.** In production you'd proxy privileged calls through a server route.

### 3. Run

```bash
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck  # tsc --noEmit
```

### 4. Enable UVE (Universal Visual Editing)

So dotCMS knows where your headless app lives:

1. In the dotCMS admin go to **Settings → Apps**.
2. Open the **Universal Visual Editor** app and select your **site**.
3. Add a JSON configuration pointing at this app and save:

   ```json
   {
     "config": [
       { "pattern": ".*", "url": "http://localhost:3000" }
     ]
   }
   ```
4. Open **Pages** in the admin and edit a page — it now renders through this Next.js app inside the editor, with each contentlet editable in place. (When you deploy, add another entry with your hosted URL.)

---

## Adapting to your content model

Everything content-model-specific lives in two places:

1. **Components map** — [`src/components/content-types/index.ts`](src/components/content-types/index.ts). Keys are dotCMS **content-type variable names**. Add/rename entries to match your instance; unmapped types fall back to the SDK's default renderer (with a visible indicator in `development` mode).
2. **Field names** — [`src/lib/types.ts`](src/lib/types.ts) (field shapes) and the sort field / queries in [`src/lib/dotcms.ts`](src/lib/dotcms.ts). These were confirmed against the live Travel-starter model: `Banner`, `CallToAction` (`headline`/`subHeading` + `buttonText1`/`buttonUrl1`…), `Product`, `Activity`, `SimpleWidget`, and `Blog` with a `blogContent` Block Editor field and a `urlTitle` slug.

To confirm the variable names in your instance:

```bash
# list content types
curl -H "Authorization: Bearer $TOKEN" "$HOST/api/v1/contenttypes?per_page=100"
# inspect one type's fields
curl -H "Authorization: Bearer $TOKEN" "$HOST/api/v1/contenttypes/id/Blog"
```

Components render defensively (multiple field aliases, graceful fallbacks), so a name mismatch degrades to an empty state rather than a crash.

---

## Project structure

```
src/
├─ app/
│  ├─ layout.tsx              # shell: header (nav) + footer
│  ├─ [[...slug]]/page.tsx    # all dotCMS pages via Page API + UVE; home adds the carousel
│  ├─ blog/page.tsx           # blog listing (Content API)
│  ├─ blog/[...slug]/page.tsx # blog detail (Block Editor) + CTA
│  └─ not-found.tsx
├─ components/
│  ├─ dotcms-page.tsx         # 'use client' UVE boundary (useEditableDotCMSPage)
│  ├─ content-types/          # Banner, BannerCarousel, CallToAction, Product, Activity, SimpleWidget + MAP
│  ├─ layout/                 # Header (server) + NavBar (client) + Footer
│  └─ ui/blog-card.tsx
└─ lib/
   ├─ dotcms.ts               # client + data helpers (page/nav/blog/banners)
   ├─ images.ts               # dotCMS asset URL helpers
   ├─ types.ts                # content-type field types
   └─ format.ts
```

---

## Trade-offs & next steps

- **Banner carousel vs. UVE.** `DotCMSLayoutBody` renders one component per contentlet, so a multi-slide carousel isn't expressible by mapping a single Banner. I render the Banner component in-place for UVE *and* aggregate Banners into a carousel on the home hero via the Content API. A fully UVE-native carousel would be the natural next step (a custom container renderer that groups sibling contentlets).
- **Custom content type (extra credit).** Adding one is a matter of creating the type in dotCMS, adding a field-typed interface in `types.ts`, and registering a component in the map — the same pattern used here.
- **Style editor (extra credit).** Not implemented; `dotStyleProperties` flows through on contentlets, so a component could read author-set style options to customize its rendering.
- **Navigation source.** This environment's REST Navigation endpoint (`/api/v1/nav`, used by `client.nav.get()`) required auth the public dev token didn't grant, so the top nav is built from the GraphQL `DotNavigation` query — the same navigation tree, served anonymously for live menu items. `getNavigation` in `lib/dotcms.ts` is the single place to switch back to the REST client if your token has access.
- **Read auth.** Published content (pages via GraphQL, content collections, navigation) reads anonymously, so the public site renders without elevated auth; the configured token is still sent on every request. UVE in-context editing is driven by the authenticated admin iframe (via `postMessage`), independent of the app's own token.
- **Caching.** Everything is `force-dynamic` with `cache: 'no-cache'` for a faithful editing/preview experience; a production build would layer in `revalidateTag`/ISR for the public site.

## AI tooling

Built with AI assistance (Claude). The SDK integration was written against the **installed package type definitions** (not just the public docs) to pin exact signatures for this version — e.g. confirming the client exposes `client.nav.get()` (docs say `client.navigation`) and that mapped components receive contentlet fields spread as props. Happy to walk through the process on the call.
