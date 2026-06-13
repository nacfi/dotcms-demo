import type { YouTubeContentlet } from "@/lib/types";

/** Resolve the YouTube video id from the `id` field, or fall back to parsing
 *  it out of the thumbnail URL (https://i.ytimg.com/vi/<id>/...). */
function youtubeId(props: Partial<YouTubeContentlet>): string | undefined {
  if (props.id) return props.id;
  const match = props.thumbnailLarge?.match(/\/vi\/([^/]+)\//);
  return match?.[1];
}

/** YouTube content type — privacy-friendly embedded player. */
export function YouTube(props: Partial<YouTubeContentlet>) {
  const videoId = youtubeId(props);
  if (!videoId) return null;

  return (
    <section className="px-6 py-8">
      <div className="mx-auto max-w-3xl">
        {props.title && (
          <h3 className="mb-3 text-lg font-semibold text-slate-900">
            {props.title}
          </h3>
        )}
        <div className="relative aspect-video overflow-hidden rounded-xl bg-black shadow">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
            title={props.title ?? "YouTube video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
        {props.author && (
          <p className="mt-2 text-sm text-slate-500">{props.author}</p>
        )}
      </div>
    </section>
  );
}
