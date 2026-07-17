import { createFileRoute, notFound } from "@tanstack/react-router";
import { ProductPage } from "./shop.$slug";
import { DICTIONARIES } from "@/lib/i18n/dictionary";
import { fetchProductByHandle, type ShopifyProduct } from "@/lib/shopify/client";
import {
  seoLinks,
  canonicalUrl,
  jsonLd,
  productSchema,
  breadcrumbSchema,
} from "@/lib/seo";

/**
 * `/en/shop/$slug` — mismo componente de producto, pero pidiéndole a Shopify el
 * contenido en inglés (`fetchProductByHandle(handle, "en")`) sin depender de la
 * cookie. Emparejado por hreflang con `/shop/$slug`.
 */
export const Route = createFileRoute("/en/shop/$slug")({
  head: (ctx) => {
    const t = DICTIONARIES.en;
    // Mismo motivo que en /shop/$slug: TanStack no infiere el loader definido
    // en este mismo objeto.
    const loaderData = ctx.loaderData as { product: ShopifyProduct["node"] } | undefined;
    const params = ctx.params as { slug: string };
    const p = loaderData?.product;

    if (!p) {
      return {
        meta: [
          { title: "AZKOMOLY" },
          { name: "description", content: t.meta.ogDescription },
        ],
        links: seoLinks(`/shop/${params.slug}`, "en"),
      };
    }

    const title = `${p.title} — AZKOMOLY`;
    const desc = (p.description || t.meta.description).slice(0, 155);
    const image = p.images.edges[0]?.node.url;
    const available = p.variants.edges.some((v) => v.node.availableForSale);

    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "product" },
        { property: "og:locale", content: "en_GB" },
        { property: "og:url", content: canonicalUrl(`/shop/${p.handle}`, "en") },
        ...(image ? [{ property: "og:image", content: image }] : []),
        { property: "product:price:amount", content: p.priceRange.minVariantPrice.amount },
        { property: "product:price:currency", content: p.priceRange.minVariantPrice.currencyCode },
      ],
      links: seoLinks(`/shop/${p.handle}`, "en"),
      scripts: [
        jsonLd(productSchema({
          handle: p.handle,
          title: p.title,
          description: p.description || t.meta.description,
          image,
          price: String(Math.round(parseFloat(p.priceRange.minVariantPrice.amount))),
          currency: p.priceRange.minVariantPrice.currencyCode,
          available,
        }, "en")),
        jsonLd(breadcrumbSchema([
          { name: "AZKOMOLY", path: "/" },
          { name: p.title, path: `/shop/${p.handle}` },
        ], "en")),
      ],
    };
  },
  loader: async ({ params }) => {
    const product = await fetchProductByHandle(params.slug, "en");
    if (!product) throw notFound();
    return { product, lang: "en" as const };
  },
  component: EnProductPage,
});

function EnProductPage() {
  const { product, lang } = Route.useLoaderData();
  return <ProductPage product={product} lang={lang} />;
}
