import type { ReactNode } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { COMPONENTS_MAP, GenericContent } from "@/components/content-types";
import { Activity } from "@/components/content-types/activity";
import { BannerCarousel } from "@/components/content-types/banner-carousel";
import { Product } from "@/components/content-types/product";
import type {
  Contentlet,
  DotPage,
  LayoutContainerRef,
  PageContainer,
} from "@/lib/types";

/**
 * Native renderer for a dotCMS page — the mobile counterpart of the web app's
 * <DotCMSLayoutBody>. It walks the page layout (rows → columns → container
 * references), resolves each reference against the page's containers, and
 * renders every contentlet through COMPONENTS_MAP.
 *
 * Layout notes:
 *  - The layout references file-based containers by *path* and gives a bare
 *    uuid ("1"), while the container payload keys its contentlet groups as
 *    "uuid-1" — `contentletsFor` bridges both.
 *  - A phone is one column wide, so grid columns stack vertically. To keep
 *    long grids browsable, runs of 2+ Products/Activities in one container
 *    group render as horizontal rails, and 2+ Banners become the same
 *    author-driven carousel the web app builds.
 */
export function PageBody({ page }: { page: DotPage }) {
  const rows = page.layout?.body?.rows ?? [];

  return (
    <View>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex}>
          {row.columns.map((column, colIndex) => (
            <View key={colIndex}>
              {column.containers.map((ref) => (
                <ContainerGroup
                  key={`${ref.identifier}-${ref.uuid}`}
                  contentlets={contentletsFor(page.containers, ref)}
                />
              ))}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

/** Resolve a layout container reference to its contentlets. */
function contentletsFor(
  containers: PageContainer[],
  ref: LayoutContainerRef,
): Contentlet[] {
  const container = containers.find(
    (c) => c.identifier === ref.identifier || c.path === ref.identifier,
  );
  const group = container?.containerContentlets.find(
    (cc) => cc.uuid === `uuid-${ref.uuid}` || cc.uuid === ref.uuid,
  );
  return (group?.contentlets ?? []).map((c) => c._map);
}

/** Card widths for horizontal rails, per content type. */
const RAIL_CARD_WIDTH: Record<string, number> = {
  Product: 176,
  Activity: 264,
};

function ContainerGroup({ contentlets }: { contentlets: Contentlet[] }) {
  const banners = contentlets.filter((c) => c.contentType === "Banner");
  if (banners.length >= 2) {
    // Mirror the web app: the container's banners collapse into one carousel,
    // rendered where the group sits; other types keep their position below.
    const rest = contentlets.filter((c) => c.contentType !== "Banner");
    return (
      <View>
        <BannerCarousel banners={banners} />
        {renderRun(rest)}
      </View>
    );
  }
  return <View>{renderRun(contentlets)}</View>;
}

/** Render a contentlet list, collapsing runs of rail-able types. */
function renderRun(contentlets: Contentlet[]): ReactNode[] {
  const out: ReactNode[] = [];
  let i = 0;
  while (i < contentlets.length) {
    const current = contentlets[i];
    const railWidth = RAIL_CARD_WIDTH[current.contentType];

    if (railWidth) {
      let j = i;
      while (
        j < contentlets.length &&
        contentlets[j].contentType === current.contentType
      ) {
        j++;
      }
      const run = contentlets.slice(i, j);
      if (run.length >= 2) {
        out.push(
          <Rail
            key={`rail-${current.identifier}`}
            items={run}
            cardWidth={railWidth}
          />,
        );
        i = j;
        continue;
      }
    }

    out.push(<ContentletView key={`${current.identifier}-${i}`} contentlet={current} />);
    i++;
  }
  return out;
}

function ContentletView({ contentlet }: { contentlet: Contentlet }) {
  const Component = COMPONENTS_MAP[contentlet.contentType] ?? GenericContent;
  return <Component contentlet={contentlet} />;
}

function Rail({ items, cardWidth }: { items: Contentlet[]; cardWidth: number }) {
  return (
    <FlatList
      data={items}
      horizontal
      keyExtractor={(c) => c.identifier}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.rail}
      renderItem={({ item }) =>
        item.contentType === "Product" ? (
          <Product contentlet={item} width={cardWidth} />
        ) : (
          <Activity contentlet={item} width={cardWidth} />
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  rail: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
});
