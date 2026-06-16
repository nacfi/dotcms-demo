import Image from "next/image";
import type { TestimonialContentlet } from "@/lib/types";
import { contentletImage } from "@/lib/images";

/**
 * Testimonial content type. Define the type in dotCMS, map this component, and
 * authors can add/manage it on any page via UVE. Expects field variables:
 * `quote`, `authorName`, `authorTitle`, and an optional `image` avatar.
 */
export function Testimonial(props: Partial<TestimonialContentlet>) {
  const { quote, authorName, authorTitle } = props;
  if (!quote && !authorName) return null;

  const avatar = contentletImage(props, "image");

  return (
    <section className="px-6 py-10">
      <figure className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <svg
          className="mx-auto mb-4 h-8 w-8 text-indigo-300"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M7.17 6A5.17 5.17 0 0 0 2 11.17V18h6.83v-6.83H5.5A1.67 1.67 0 0 1 7.17 9.5V6Zm10 0A5.17 5.17 0 0 0 12 11.17V18h6.83v-6.83H15.5a1.67 1.67 0 0 1 1.67-1.67V6Z" />
        </svg>
        {quote && (
          <blockquote className="text-pretty text-xl font-medium leading-relaxed text-slate-800">
            {quote}
          </blockquote>
        )}
        <figcaption className="mt-6 flex items-center justify-center gap-3">
          {avatar && (
            <span className="relative h-11 w-11 overflow-hidden rounded-full bg-slate-100">
              <Image
                src={avatar}
                alt={authorName ?? "Author"}
                fill
                sizes="44px"
                className="object-cover"
              />
            </span>
          )}
          {(authorName || authorTitle) && (
            <span className="text-left">
              {authorName && (
                <span className="block text-sm font-semibold text-slate-900">
                  {authorName}
                </span>
              )}
              {authorTitle && (
                <span className="block text-sm text-slate-500">
                  {authorTitle}
                </span>
              )}
            </span>
          )}
        </figcaption>
      </figure>
    </section>
  );
}
