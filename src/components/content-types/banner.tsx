import Image from "next/image";
import Link from "next/link";
import type { BannerContentlet } from "@/lib/types";
import { contentletImage } from "@/lib/images";

/**
 * Banner content type.
 *
 * Rendered two ways, both from this one component:
 *  1. By UVE / <DotCMSLayoutBody> wherever an author places a Banner on a page
 *     (props arrive as the contentlet's fields spread onto props).
 *  2. As a slide inside <BannerCarousel> on the home hero.
 */
export function Banner(props: Partial<BannerContentlet> & { eager?: boolean }) {
  const { title, caption, link, buttonText, eager } = props;
  const image = contentletImage(props, "image");

  return (
    <section className="relative isolate flex min-h-[60vh] w-full items-center justify-center overflow-hidden">
      {image ? (
        <Image
          src={image}
          alt={title ?? caption ?? "Banner"}
          fill
          priority={eager}
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-sky-600 via-indigo-700 to-slate-900" />
      )}

      {/* Legibility overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-20 text-center text-white">
        {title && (
          <h2 className="text-balance text-4xl font-bold tracking-tight drop-shadow-sm sm:text-5xl">
            {title}
          </h2>
        )}
        {caption && (
          <p className="mx-auto mt-4 max-w-xl text-pretty text-lg text-white/90">
            {caption}
          </p>
        )}
        {link && (
          <Link
            href={link}
            className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-white/90"
          >
            {buttonText || "Learn more"}
          </Link>
        )}
      </div>
    </section>
  );
}
