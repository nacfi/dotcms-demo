import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DotCMSBlockEditorRenderer } from "@dotcms/react";
import { getBlogByUrlTitle } from "@/lib/dotcms";
import { CallToAction } from "@/components/content-types/call-to-action";
import { contentletImage } from "@/lib/images";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string[] }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const urlTitle = slug?.[slug.length - 1];
  const blog = urlTitle ? await getBlogByUrlTitle(urlTitle) : null;
  return {
    title: blog?.title ?? "Blog post",
    description: blog?.teaser,
  };
}

export default async function BlogDetailPage({ params }: Params) {
  const { slug } = await params;
  const urlTitle = slug?.[slug.length - 1];
  if (!urlTitle) notFound();

  const blog = await getBlogByUrlTitle(urlTitle);
  if (!blog) notFound();

  const hero = contentletImage(blog, "image");
  const date = formatDate(blog.publishDate ?? blog.modDate);

  return (
    <article className="pb-8">
      <div className="mx-auto max-w-3xl px-6 pt-12">
        <Link
          href="/blog"
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          ← Back to blog
        </Link>
        <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          {blog.title}
        </h1>
        {date && <p className="mt-3 text-slate-500">{date}</p>}
        {blog.teaser && (
          <p className="mt-4 text-lg text-pretty text-slate-600">{blog.teaser}</p>
        )}
      </div>

      {hero && (
        <div className="relative mx-auto mt-10 aspect-[2/1] w-full max-w-4xl overflow-hidden rounded-2xl bg-slate-100 px-6 sm:px-0">
          <Image
            src={hero}
            alt={blog.title ?? "Blog hero"}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover"
          />
        </div>
      )}

      <div className="mx-auto max-w-3xl px-6 py-10">
        {blog.blogContent ? (
          // Renders the Block Editor (Story Block) field. The SDK ships default
          // renderers for headings, lists, images, code, etc.; pass
          // `customRenderers` to override any block type.
          <DotCMSBlockEditorRenderer
            blocks={blog.blogContent}
            className="space-y-4 leading-relaxed text-slate-700 [&_a]:text-indigo-600 [&_a]:underline [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_img]:rounded-xl [&_li]:ml-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6"
          />
        ) : blog.body ? (
          <div
            className="space-y-4 leading-relaxed text-slate-700"
            dangerouslySetInnerHTML={{ __html: blog.body }}
          />
        ) : (
          <p className="text-slate-500">This post has no body content.</p>
        )}
      </div>

      <div className="mx-auto max-w-4xl">
        <CallToAction
          headline="Enjoyed this story?"
          subHeading="Explore more destinations, tips, and guides on the blog."
          buttonText1="Read more stories"
          buttonUrl1="/blog"
        />
      </div>
    </article>
  );
}
