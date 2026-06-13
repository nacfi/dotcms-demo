import type { Metadata } from "next";
import { getBlogListing, isDotCMSConfigured } from "@/lib/dotcms";
import { BlogCard } from "@/components/ui/blog-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Latest blog posts, pulled live from dotCMS via the Content API.",
};

export default async function BlogIndexPage() {
  const { blogs } = await getBlogListing({ limit: 24 });

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <header className="mb-10 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
          From the blog
        </p>
        <h1 className="mt-1 text-4xl font-bold tracking-tight text-slate-900">
          Latest stories
        </h1>
        <p className="mt-3 text-slate-600">
          Queried live from dotCMS with the{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">
            client.content.getCollection(&quot;Blog&quot;)
          </code>{" "}
          builder.
        </p>
      </header>

      {blogs.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <BlogCard key={blog.identifier} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
      <h2 className="text-lg font-semibold text-slate-800">No blog posts found</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
        {isDotCMSConfigured
          ? "Your instance returned no Blog content. Confirm the content type variable name is “Blog” and that posts are published in this site/language."
          : "dotCMS isn’t configured yet. Copy .env.example to .env.local, add your host + API token, and restart the dev server."}
      </p>
    </div>
  );
}
