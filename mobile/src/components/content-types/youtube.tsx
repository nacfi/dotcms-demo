import { StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import { colors } from "@/lib/theme";
import type { Contentlet } from "@/lib/types";

/** Resolve the YouTube video id from the `id` field, or fall back to parsing
 *  it out of the thumbnail URL (https://i.ytimg.com/vi/<id>/...). */
function youtubeId(contentlet: Contentlet): string | undefined {
  if (typeof contentlet.id === "string" && contentlet.id) return contentlet.id;
  const thumb = contentlet.thumbnailLarge as string | undefined;
  return thumb?.match(/\/vi\/([^/]+)\//)?.[1];
}

/** Embed page served with a baseUrl: YouTube rejects referer-less embeds
 *  (player error 153), so the iframe must live in a document with an origin. */
function embedHtml(videoId: string): string {
  return `<!DOCTYPE html><html><head>
    <meta name="viewport" content="initial-scale=1.0" />
    <style>html,body{margin:0;padding:0;height:100%;background:#000}iframe{width:100%;height:100%;border:0}</style>
  </head><body>
    <iframe src="https://www.youtube-nocookie.com/embed/${videoId}?playsinline=1"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen></iframe>
  </body></html>`;
}

/** YouTube content type — privacy-friendly embedded player in a WebView. */
export function YouTube({ contentlet }: { contentlet: Contentlet }) {
  const videoId = youtubeId(contentlet);
  if (!videoId) return null;

  return (
    <View style={styles.wrap}>
      {contentlet.title ? (
        <Text style={styles.title}>{contentlet.title}</Text>
      ) : null}
      <View style={styles.player}>
        <WebView
          style={styles.webview}
          source={{
            html: embedHtml(videoId),
            baseUrl: "https://dotcms.vercel.app",
          }}
          allowsFullscreenVideo
          javaScriptEnabled
        />
      </View>
      {contentlet.author ? (
        <Text style={styles.author}>{contentlet.author as string}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.slate900,
  },
  player: {
    aspectRatio: 16 / 9,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  webview: {
    flex: 1,
    backgroundColor: "#000",
  },
  author: {
    fontSize: 13,
    color: colors.slate500,
  },
});
