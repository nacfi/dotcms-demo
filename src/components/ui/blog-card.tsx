import Image from "next/image";
import Link from "next/link";
import type { BlogContentlet } from "@/lib/types";
import { contentletImage } from "@/lib/images";
import { formatDate } from "@/lib/format";

export function BlogCard({ blog }: { blog: BlogContentlet }) {
  const href = `/blog/${blog.urlTitle ?? blog.identifier}`;
  const image = contentletImage(blog, "image");
  const date = formatDate(blog.publishDate ?? blog.modDate);

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        {image ? (
          <Image
            src={image}
            alt={blog.title ?? "Blog post"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {date && (
          <time className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {date}
          </time>
        )}
        <h3 className="mt-1 text-lg font-semibold leading-snug text-slate-900 transition group-hover:text-indigo-600">
          {blog.title}
        </h3>
        {blog.teaser && (
          <p className="mt-2 line-clamp-2 text-sm text-slate-600">{blog.teaser}</p>
        )}
        <span className="mt-4 inline-block text-sm font-medium text-indigo-600">
          Read more →
        </span>
      </div>
    </Link>
  );
}
