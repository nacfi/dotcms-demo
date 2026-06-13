import Link from "next/link";
import type { CallToActionContentlet } from "@/lib/types";

/**
 * Call To Action content type.
 *
 * The starter type uses `headline` + `subHeading` and up to two buttons
 * (`buttonText1`/`buttonUrl1`, `buttonText2`/`buttonUrl2`). We also accept
 * simpler manual props so the same component can be reused outside UVE
 * (e.g. on the blog detail page).
 */
export function CallToAction(props: Partial<CallToActionContentlet>) {
  const heading = props.headline ?? props.title;
  const body = props.subHeading ?? props.text ?? props.description;

  const buttons = [
    { text: props.buttonText1, url: props.buttonUrl1 },
    { text: props.buttonText2, url: props.buttonUrl2 },
    { text: props.buttonText, url: props.link }, // manual single-button usage
  ].filter((b): b is { text: string; url: string } => Boolean(b.text && b.url));

  if (!heading && !body && buttons.length === 0) return null;

  return (
    <section className="px-6 py-12">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 rounded-3xl bg-gradient-to-r from-indigo-600 to-sky-500 px-8 py-12 text-center text-white shadow-xl sm:px-12">
        {heading && (
          <h3 className="text-balance text-2xl font-bold sm:text-3xl">
            {heading}
          </h3>
        )}
        {body && <p className="max-w-2xl text-pretty text-white/90">{body}</p>}
        {buttons.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3">
            {buttons.map((b, i) => (
              <Link
                key={`${b.url}-${i}`}
                href={b.url}
                className={
                  i === 0
                    ? "inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-indigo-700 shadow transition hover:bg-white/90"
                    : "inline-flex items-center justify-center rounded-full border border-white/70 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                }
              >
                {b.text}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
