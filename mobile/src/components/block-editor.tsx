import type { ReactNode } from "react";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { dotAsset } from "@/lib/images";
import { openHref } from "@/lib/links";
import { cardShadow, colors } from "@/lib/theme";
import type { BlockNode } from "@/lib/types";

/**
 * Native renderer for the dotCMS Block Editor (Story Block) JSON document —
 * the mobile counterpart of the SDK's <DotCMSBlockEditorRenderer>, which is
 * DOM-based. Covers the node types present in this instance's blog content
 * (paragraph, heading, text marks, lists, dotImage, dotContent, table);
 * unknown nodes render their children so new content degrades gracefully.
 */
export function BlockEditor({ doc }: { doc: BlockNode }) {
  return <View style={styles.doc}>{renderNodes(doc.content)}</View>;
}

function renderNodes(nodes?: BlockNode[]): ReactNode[] {
  return (nodes ?? []).map((node, i) => (
    <BlockNodeView key={i} node={node} />
  ));
}

function BlockNodeView({ node }: { node: BlockNode }): ReactNode {
  switch (node.type) {
    case "paragraph": {
      if (!node.content?.length) return <View style={styles.paragraphGap} />;
      return <Text style={styles.paragraph}>{renderInline(node.content)}</Text>;
    }
    case "heading": {
      const level = Number(node.attrs?.level ?? 2);
      const style =
        level <= 1 ? styles.h1 : level === 2 ? styles.h2 : styles.h3;
      return <Text style={style}>{renderInline(node.content)}</Text>;
    }
    case "bulletList":
    case "orderedList":
      return (
        <View style={styles.list}>
          {(node.content ?? []).map((item, i) => (
            <View key={i} style={styles.listItem}>
              <Text style={styles.listMarker}>
                {node.type === "orderedList" ? `${i + 1}.` : "•"}
              </Text>
              <View style={styles.listItemBody}>{renderNodes(item.content)}</View>
            </View>
          ))}
        </View>
      );
    case "blockquote":
      return <View style={styles.blockquote}>{renderNodes(node.content)}</View>;
    case "horizontalRule":
      return <View style={styles.rule} />;
    case "image":
    case "dotImage": {
      const src = dotAsset(node.attrs?.src);
      if (!src) return null;
      return (
        <Image
          source={{ uri: src }}
          alt={String(node.attrs?.alt ?? node.attrs?.title ?? "")}
          style={styles.image}
          contentFit="cover"
          transition={150}
        />
      );
    }
    case "dotContent": {
      // An embedded contentlet; render a small reference card.
      const data = node.attrs?.data as
        | { title?: string; contentType?: string; urlMap?: string }
        | undefined;
      if (!data?.title) return null;
      return (
        <View style={styles.contentCard}>
          {data.contentType ? (
            <Text style={styles.contentCardType}>{data.contentType}</Text>
          ) : null}
          <Text
            style={styles.contentCardTitle}
            onPress={data.urlMap ? () => openHref(data.urlMap) : undefined}
          >
            {data.title}
          </Text>
        </View>
      );
    }
    case "table":
      return (
        <View style={styles.table}>
          {(node.content ?? []).map((row, i) => (
            <View key={i} style={styles.tableRow}>
              {(row.content ?? []).map((cell, j) => (
                <View
                  key={j}
                  style={[
                    styles.tableCell,
                    cell.type === "tableHeader" && styles.tableHeader,
                  ]}
                >
                  {renderNodes(cell.content)}
                </View>
              ))}
            </View>
          ))}
        </View>
      );
    default:
      // Unknown block: render children rather than dropping content.
      return node.content ? <View>{renderNodes(node.content)}</View> : null;
  }
}

function renderInline(nodes?: BlockNode[]): ReactNode[] {
  return (nodes ?? []).map((node, i) => {
    if (node.type === "hardBreak") return <Text key={i}>{"\n"}</Text>;
    if (node.type !== "text") return null;

    const marks = node.marks ?? [];
    const link = marks.find((m) => m.type === "link");
    const href = link?.attrs?.href as string | undefined;

    return (
      <Text
        key={i}
        style={[
          marks.some((m) => m.type === "bold") && styles.bold,
          marks.some((m) => m.type === "italic") && styles.italic,
          (marks.some((m) => m.type === "underline") || link) && styles.underline,
          link && styles.link,
        ]}
        onPress={href ? () => openHref(href) : undefined}
      >
        {node.text}
      </Text>
    );
  });
}

const styles = StyleSheet.create({
  doc: {
    gap: 14,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 25,
    color: colors.slate700,
  },
  paragraphGap: {
    height: 2,
  },
  h1: {
    marginTop: 12,
    fontSize: 26,
    fontWeight: "700",
    color: colors.slate900,
  },
  h2: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: "700",
    color: colors.slate900,
  },
  h3: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "600",
    color: colors.slate900,
  },
  bold: {
    fontWeight: "700",
  },
  italic: {
    fontStyle: "italic",
  },
  underline: {
    textDecorationLine: "underline",
  },
  link: {
    color: colors.indigo600,
  },
  list: {
    gap: 8,
  },
  listItem: {
    flexDirection: "row",
    gap: 8,
  },
  listMarker: {
    fontSize: 16,
    lineHeight: 25,
    color: colors.slate500,
  },
  listItemBody: {
    flex: 1,
    gap: 6,
  },
  blockquote: {
    borderLeftWidth: 3,
    borderLeftColor: colors.slate300,
    paddingLeft: 14,
    gap: 8,
  },
  rule: {
    height: 1,
    backgroundColor: colors.slate200,
    marginVertical: 8,
  },
  image: {
    width: "100%",
    aspectRatio: 3 / 2,
    borderRadius: 14,
    backgroundColor: colors.slate100,
  },
  contentCard: {
    ...cardShadow,
    padding: 14,
    gap: 4,
  },
  contentCardType: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    color: colors.slate400,
  },
  contentCardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.indigo600,
  },
  table: {
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: 10,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.slate200,
  },
  tableCell: {
    flex: 1,
    padding: 8,
    gap: 4,
  },
  tableHeader: {
    backgroundColor: colors.slate100,
  },
});
