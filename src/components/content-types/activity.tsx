import Image from "next/image";
import Link from "next/link";
import type { ActivityContentlet } from "@/lib/types";
import { contentletImage } from "@/lib/images";

/** Activity content type — image, title, short description, detail link. */
export function Activity(props: Partial<ActivityContentlet>) {
  const href =
    props.urlMap ??
    (props.urlTitle ? `/activities/${props.urlTitle}` : undefined);
  const image = contentletImage(props, "image");

  const card = (
    <div className="group mx-auto flex h-full w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {image && (
          <Image
            src={image}
            alt={props.altTag ?? props.title ?? "Activity"}
            fill
            sizes="(max-width: 768px) 100vw, 384px"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold text-slate-900">{props.title}</h3>
        {props.description && (
          <p className="mt-2 line-clamp-3 text-sm text-slate-600">
            {props.description}
          </p>
        )}
        {href && (
          <span className="mt-4 inline-block text-sm font-medium text-indigo-600">
            Discover →
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="px-6 py-4">
      {href ? <Link href={href}>{card}</Link> : card}
    </div>
  );
}
