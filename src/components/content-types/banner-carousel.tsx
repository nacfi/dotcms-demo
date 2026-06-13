"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { BannerContentlet } from "@/lib/types";
import { Banner } from "./banner";

/**
 * Dependency-free banner carousel.
 *
 * Built on native CSS scroll-snap (so it's swipeable + keyboard/scroll
 * accessible for free) with JS only for autoplay, arrow/dot controls, and
 * keeping the active-dot state in sync with manual scrolling. No carousel
 * library — fewer deps to justify, and full control over the markup.
 */
export function BannerCarousel({
  banners,
  autoplayMs = 6000,
}: {
  banners: BannerContentlet[];
  autoplayMs?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const count = banners.length;

  const goTo = useCallback(
    (i: number) => {
      const track = trackRef.current;
      if (!track || count === 0) return;
      const next = (i + count) % count;
      track.scrollTo({ left: track.clientWidth * next, behavior: "smooth" });
      setIndex(next);
    },
    [count],
  );

  // Autoplay (pauses implicitly when the tab is hidden).
  useEffect(() => {
    if (count <= 1 || autoplayMs <= 0) return;
    const id = window.setInterval(() => goTo(index + 1), autoplayMs);
    return () => window.clearInterval(id);
  }, [index, count, autoplayMs, goTo]);

  // Keep the active dot in sync when the user swipes/scrolls manually.
  const onScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setIndex(Math.round(track.scrollLeft / track.clientWidth));
  }, []);

  if (count === 0) return null;
  if (count === 1) return <Banner {...banners[0]} eager />;

  return (
    <section
      className="relative"
      aria-roledescription="carousel"
      aria-label="Featured banners"
    >
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {banners.map((banner, i) => (
          <div
            key={banner.identifier ?? i}
            className="w-full flex-none snap-center"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
          >
            <Banner {...banner} eager={i === 0} />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => goTo(index - 1)}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-2xl leading-none text-white backdrop-blur transition hover:bg-black/60"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => goTo(index + 1)}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-2xl leading-none text-white backdrop-blur transition hover:bg-black/60"
      >
        ›
      </button>

      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {banners.map((banner, i) => (
          <button
            key={banner.identifier ?? i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            className={`h-2.5 rounded-full transition-all ${
              i === index ? "w-6 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
