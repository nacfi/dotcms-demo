import Image from "next/image";
import type { DotCMSBasicContentlet } from "@dotcms/types";
import type { DotImageField } from "@/lib/types";
import { dotAsset, dotShorty } from "@/lib/images";

/**
 * Image content type. The binary field variable differs between starters
 * (`asset`, `fileAsset`, …), so we try a couple and fall back to the shorty
 * `/dA/<id>` URL which always serves the contentlet's default binary.
 */
export function ImageContent(
  props: Partial<DotCMSBasicContentlet> & {
    asset?: DotImageField;
    fileAsset?: DotImageField;
    description?: string;
  },
) {
  const src =
    dotAsset(props.asset) ??
    dotAsset(props.fileAsset) ??
    dotAsset(props.image) ??
    dotShorty(props.identifier);

  if (!src) return null;

  const alt = props.title ?? props.description ?? "Image";

  return (
    <figure className="mx-auto my-8 max-w-4xl px-6">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-slate-100">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
        />
      </div>
      {props.description && (
        <figcaption className="mt-3 text-center text-sm text-slate-500">
          {props.description}
        </figcaption>
      )}
    </figure>
  );
}
