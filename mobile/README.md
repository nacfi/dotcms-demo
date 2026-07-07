# dotCMS Travel — React Native app

The mobile counterpart of the [Next.js headless demo](https://dotcms.vercel.app):
an Expo (React Native) app that renders the **same published dotCMS content** as
the website. Edit a banner, product, testimonial, or blog post in the dotCMS
visual editor, hit **Publish**, and both the site and this app deliver the
change — one content repository, two channels.

## Run it (iOS simulator)

```bash
cd mobile
npm install
npm run ios        # boots the Xcode simulator via Expo Go
```

Pull down on any screen to refresh after publishing in dotCMS.

## How it works

The web app uses `@dotcms/client`; its `page.get()` is a wrapper around one
GraphQL query. The SDK's React pieces (UVE bridge, `<DotCMSLayoutBody>`,
`<DotCMSBlockEditorRenderer>`) are DOM-based, so on mobile we consume the same
contract directly:

| Concern            | Web (Next.js)                          | Mobile (this app)                             |
| ------------------ | -------------------------------------- | --------------------------------------------- |
| Page (layout+content) | `client.page.get()` (GraphQL)       | same GraphQL query via `fetch` (`lib/dotcms.ts`) |
| Layout rendering   | `<DotCMSLayoutBody>` + components map  | `<PageBody>` + the same components map, native |
| Navigation         | GraphQL `DotNavigation`                | identical                                      |
| Blog list/detail   | Content API (`getCollection`)          | Content API `/api/content/_search`            |
| Block Editor body  | `<DotCMSBlockEditorRenderer>`          | native renderer (`components/block-editor.tsx`) |
| VtlInclude widgets | reimplemented as recommendation grids  | same classification, Content API direct       |
| Images             | `/dA/<identifier>/<field>` helper      | identical port (`lib/images.ts`)              |

Mobile-specific rendering choices:

- A phone is one column wide, so layout grid columns stack vertically; runs of
  2+ Products/Activities in a container render as horizontal rails.
- 2+ Banners in a container become a swipeable carousel — the same
  author-driven grouping as the web hero.
- Editing stays a web concern: UVE is an iframe protocol, so the app renders
  LIVE content only. Publish → pull-to-refresh is the omnichannel story.

## Configuration

The demo instance serves live content anonymously, so no token ships in the
app. To point elsewhere, set Expo public env vars (e.g. in `mobile/.env`):

```
EXPO_PUBLIC_DOTCMS_HOST=https://your-instance.dotcms.cloud
EXPO_PUBLIC_DOTCMS_SITE_ID=your-site-id
```
