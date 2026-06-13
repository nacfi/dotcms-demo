import Image from "next/image";
import Link from "next/link";
import type { ProductContentlet } from "@/lib/types";
import { contentletImage } from "@/lib/images";

/** Product content type (Store) — image, title, and retail/sale pricing. */
export function Product(props: Partial<ProductContentlet>) {
  const href =
    props.urlMap ??
    (props.urlTitle ? `/store/products/${props.urlTitle}` : undefined);
  const image = contentletImage(props, "image");

  const retail = props.retailPrice != null ? Number(props.retailPrice) : undefined;
  const sale = props.salePrice != null ? Number(props.salePrice) : undefined;
  const onSale = sale != null && retail != null && sale < retail;

  const card = (
    <div className="group mx-auto flex h-full w-full max-w-xs flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        {image && (
          <Image
            src={image}
            alt={props.title ?? "Product"}
            fill
            sizes="(max-width: 768px) 50vw, 320px"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        )}
        {onSale && (
          <span className="absolute left-3 top-3 rounded-full bg-rose-600 px-2.5 py-1 text-xs font-bold text-white">
            Sale
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-sm font-semibold leading-snug text-slate-900">
          {props.title}
        </h3>
        <div className="mt-auto pt-3">
          {onSale ? (
            <p className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-rose-600">
                ${sale!.toFixed(2)}
              </span>
              <span className="text-sm text-slate-400 line-through">
                ${retail!.toFixed(2)}
              </span>
            </p>
          ) : retail != null ? (
            <p className="text-lg font-bold text-slate-900">
              ${retail.toFixed(2)}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );

  return (
    <div className="px-6 py-4">
      {href ? <Link href={href}>{card}</Link> : card}
    </div>
  );
}
