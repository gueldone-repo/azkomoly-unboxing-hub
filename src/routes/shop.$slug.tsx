import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ShieldCheck, Truck, Sparkles, ChevronLeft } from "lucide-react";
import { useT, useI18n, readLangCookie } from "@/lib/i18n";
import { DICTIONARIES, type Lang } from "@/lib/i18n/dictionary";
import { fetchProductByHandle, formatShopifyPrice, type ShopifyProduct } from "@/lib/shopify/client";
import { useShopifyCart } from "@/lib/shopify/cart-store";
import { CartButton } from "@/components/cart/CartSheet";
import { SiteBreadcrumb } from "@/components/SiteBreadcrumb";
import { seoLinks, canonicalUrl, jsonLd, productSchema, breadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute("/shop/$slug")({
  head: (ctx) => {
    const lang = readLangCookie();
    const t = DICTIONARIES[lang];
    // TanStack no infiere el tipo del `loader` definido en este mismo objeto
    // (resuelve a `never`), así que lo anotamos a mano. Debe seguir al `loader`
    // de abajo si cambia su retorno.
    const loaderData = ctx.loaderData as { product: ShopifyProduct["node"]; lang: Lang } | undefined;
    const params = ctx.params as { slug: string };
    const p = loaderData?.product;

    // Sin loaderData (error / 404) caemos al copy genérico de marca.
    if (!p) {
      return {
        meta: [
          { title: "AZKOMOLY" },
          { name: "description", content: t.meta.ogDescription },
        ],
        links: seoLinks(`/shop/${params.slug}`, lang),
      };
    }

    // Antes todos los productos compartían el título "AZKOMOLY", así que para
    // Google eran páginas indistinguibles. Ahora cada uno lleva su nombre.
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
        { property: "og:url", content: canonicalUrl(`/shop/${p.handle}`, lang) },
        ...(image ? [{ property: "og:image", content: image }] : []),
        { property: "product:price:amount", content: p.priceRange.minVariantPrice.amount },
        { property: "product:price:currency", content: p.priceRange.minVariantPrice.currencyCode },
      ],
      links: seoLinks(`/shop/${p.handle}`, lang),
      scripts: [
        jsonLd(productSchema({
          handle: p.handle,
          title: p.title,
          description: p.description || t.meta.description,
          image,
          price: String(Math.round(parseFloat(p.priceRange.minVariantPrice.amount))),
          currency: p.priceRange.minVariantPrice.currencyCode,
          available,
        }, lang)),
        jsonLd(breadcrumbSchema([
          { name: "AZKOMOLY", path: "/" },
          { name: p.title, path: `/shop/${p.handle}` },
        ], lang)),
      ],
    };
  },
  loader: async ({ params }) => {
    const lang = readLangCookie();
    const product = await fetchProductByHandle(params.slug, lang);
    if (!product) throw notFound();
    return { product, lang };
  },
  errorComponent: ({ reset }) => <ProductError reset={reset} />,
  notFoundComponent: () => <ProductNotFound />,
  component: HuProductPage,
});

function HuProductPage() {
  const { product, lang } = Route.useLoaderData();
  return <ProductPage product={product} lang={lang} />;
}

function ProductError({ reset }: { reset: () => void }) {
  const t = useT();
  return (
    <div className="min-h-screen grid place-items-center bg-background text-foreground p-6 text-center">
      <div>
        <h1 className="font-display text-3xl text-fire mb-4">{t.product.errorTitle}</h1>
        <button onClick={reset} className="bg-fire text-primary-foreground font-display px-6 py-3 btn-drip">
          {t.product.retry}
        </button>
      </div>
    </div>
  );
}

function ProductNotFound() {
  const t = useT();
  return (
    <div className="min-h-screen grid place-items-center bg-background text-foreground p-6 text-center">
      <div>
        <h1 className="font-display text-4xl text-fire mb-4">{t.product.notFound}</h1>
        <Link to="/" className="bg-fire text-primary-foreground font-display px-6 py-3 btn-drip">
          {t.product.backToShop}
        </Link>
      </div>
    </div>
  );
}

/**
 * Recibe los datos del loader por props en vez de llamar a `Route.useLoaderData()`,
 * porque lo reutiliza también `/en/shop/$slug` — con un `Route` distinto. Si
 * leyera el Route de este módulo, la versión inglesa apuntaría a la ruta húngara.
 */
export function ProductPage({
  product: loaderProduct,
  lang: loaderLang,
}: {
  product: ShopifyProduct["node"];
  lang: Lang;
}) {
  const { lang } = useI18n();
  const t = useT();
  const addItem = useShopifyCart((s) => s.addItem);
  const checkoutUrl = useShopifyCart((s) => s.checkoutUrl);
  const isLoading = useShopifyCart((s) => s.isLoading);

  const [product, setProduct] = useState(loaderProduct);

  useEffect(() => {
    if (lang === loaderLang) {
      setProduct(loaderProduct);
      return;
    }
    fetchProductByHandle(loaderProduct.handle, lang).then((p) => {
      if (p) setProduct(p);
    });
  }, [lang, loaderLang, loaderProduct]);

  type ProductVariant = ShopifyProduct["node"]["variants"]["edges"][number]["node"];
  const variants = product.variants.edges.map((e: { node: ProductVariant }) => e.node);
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setSelectedVariant((current: ProductVariant | undefined) => {
      const match = variants.find((v: ProductVariant) => v.id === current?.id);
      return match ?? variants[0];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const images = product.images.edges.map((e: { node: { url: string; altText: string | null } }) => e.node);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  useEffect(() => setActiveImageIdx(0), [product]);
  const image = images[activeImageIdx] ?? images[0];
  const available = selectedVariant?.availableForSale ?? false;
  const hasVariants = variants.length > 1 || (variants[0]?.title !== "Default Title");

  async function handleAddToCart() {
    if (!selectedVariant) return;
    await addItem({
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: qty,
      selectedOptions: selectedVariant.selectedOptions,
    });
  }

  async function handleBuyNow() {
    await handleAddToCart();
    const url = useShopifyCart.getState().getCheckoutUrl();
    if (url) window.location.href = url;
  }

  return (
    <main className="bg-background text-foreground min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between gap-4">
        <Link to="/" className="inline-flex items-center gap-1 font-sans text-sm text-foreground/70 hover:text-fire">
          <ChevronLeft className="h-4 w-4" /> {t.product.back}
        </Link>
        <CartButton />
      </div>
      {/* Mismos 2 niveles que `breadcrumbSchema` (JSON-LD) más abajo — sin
          apuntar al ancla #termekek, que TanStack Link no resuelve como ruta. */}
      <SiteBreadcrumb
        trail={[
          { name: "AZKOMOLY", path: lang === "hu" ? "/" : "/en" },
          { name: product.title },
        ]}
      />

      <div className="mx-auto max-w-7xl px-6 pb-20 grid lg:grid-cols-2 gap-10">
        {/* Visual */}
        <div>
          <div className="relative aspect-square rounded-2xl bg-dark-bg overflow-hidden border-2 border-cardboard/40 shadow-[8px_8px_0_0_#0D0D0D]">
            {image ? (
              <img
                src={image.url}
                alt={image.altText ?? product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full grid place-items-center">
                <span className="font-display text-fire text-8xl text-fire-glow text-stroke-black select-none">?</span>
              </div>
            )}
          </div>
          {/* Galería: antes sólo se mostraba la primera foto (`images.edges[0]`)
              aunque Shopify trajera más. */}
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-none">
              {images.map((img: { url: string; altText: string | null }, i: number) => (
                <button
                  key={img.url}
                  onClick={() => setActiveImageIdx(i)}
                  aria-label={`${product.title} — ${i + 1}`}
                  className={`shrink-0 h-16 w-16 rounded-xl overflow-hidden border-2 transition-colors ${
                    i === activeImageIdx ? "border-fire" : "border-cardboard/40 hover:border-cardboard/70"
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="font-display text-fire text-3d-fire text-5xl sm:text-6xl mt-2 leading-none">{product.title}</h1>
          <div className="flex items-baseline gap-3 mt-5">
            <span className="font-display text-4xl text-fire">
              {selectedVariant
                ? formatShopifyPrice(selectedVariant.price)
                : formatShopifyPrice(product.priceRange.minVariantPrice)}
            </span>
          </div>
          {product.description && (
            <p className="font-sans text-base text-foreground/80 mt-6 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Variant selector (shown only when there are real variants) */}
          {hasVariants && (
            <div className="mt-8">
              <p className="font-sans text-xs tracking-[0.3em] text-foreground/70 mb-3">{t.product.size}</p>
              <div className="flex flex-wrap gap-2">
                {variants.map((v: ProductVariant) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    disabled={!v.availableForSale}
                    className={`h-12 min-w-12 px-3 rounded-xl font-display text-lg border-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                      selectedVariant?.id === v.id
                        ? "bg-fire text-primary-foreground border-fire"
                        : "border-cardboard/60 text-foreground hover:border-fire"
                    }`}
                  >
                    {v.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Qty + Add */}
          <div className="mt-6 flex gap-3 items-stretch">
            <div className="flex items-center rounded-2xl border-2 border-cardboard/60 overflow-hidden">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-14 w-12 font-display text-2xl text-fire">−</button>
              <span className="h-14 w-12 grid place-items-center font-display text-xl">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="h-14 w-12 font-display text-2xl text-fire">+</button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!available || isLoading}
              className="flex-1 bg-fire text-primary-foreground font-display text-xl btn-drip hover:translate-y-[-2px] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t.product.addToCart} · {selectedVariant
                ? formatShopifyPrice({ amount: String(parseFloat(selectedVariant.price.amount) * qty), currencyCode: selectedVariant.price.currencyCode })
                : ""}
            </button>
          </div>

          {/* Antes era el único CTA de la página sin relieve 3D. */}
          <button
            onClick={handleBuyNow}
            disabled={!available || isLoading}
            className="btn-3d mt-3 w-full bg-dark-bg text-foreground font-display text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.product.buyNow}
          </button>

          {/* Trust — antes íconos sueltos sin tarjeta; ahora con la misma
              sombra dura que ya usan `ReviewCard`/`Footer` en el resto del sitio. */}
          <div className="mt-8 grid grid-cols-3 gap-3 text-center font-sans text-xs text-foreground/70">
            <div className="flex flex-col items-center gap-1.5 rounded-2xl border-2 border-cardboard/30 bg-dark-bg py-4 shadow-[4px_4px_0_0_#0D0D0D]">
              <ShieldCheck className="h-5 w-5 text-fire" /> {t.product.trustBranded}
            </div>
            <div className="flex flex-col items-center gap-1.5 rounded-2xl border-2 border-cardboard/30 bg-dark-bg py-4 shadow-[4px_4px_0_0_#0D0D0D]">
              <Truck className="h-5 w-5 text-fire" /> {t.product.trustShipping}
            </div>
            <div className="flex flex-col items-center gap-1.5 rounded-2xl border-2 border-cardboard/30 bg-dark-bg py-4 shadow-[4px_4px_0_0_#0D0D0D]">
              <Sparkles className="h-5 w-5 text-fire" /> {t.product.trustValue}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
