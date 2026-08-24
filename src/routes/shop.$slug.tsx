import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useEffect, lazy, Suspense } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Truck, Sparkles, ZoomIn, ChevronLeft, ChevronRight, Check, ArrowLeft } from "lucide-react";
import { useT, useI18n, readLangCookie } from "@/lib/i18n";
import { DICTIONARIES, type Lang } from "@/lib/i18n/dictionary";
import { fetchProductByHandle, formatShopifyPrice, type ShopifyProduct } from "@/lib/shopify/client";
import { useShopifyCart } from "@/lib/shopify/cart-store";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { seoLinks, canonicalUrl, jsonLd, productSchema, breadcrumbSchema } from "@/lib/seo";

// Mismo widget/código real (AZKOMOLY5) que en la home — aquí es el segundo
// punto del funnel: dispara al abrir la ficha de producto, más cerca del
// momento de decisión de compra (pedido de Diego).
const DiscountWidget = lazy(() =>
  import("@/components/DiscountWidget").then((m) => ({ default: m.DiscountWidget })),
);

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
  const { product, lang } = Route.useLoaderData() as { product: ShopifyProduct["node"]; lang: Lang };
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

  const [lightboxOpen, setLightboxOpen] = useState(false);
  // Confirmación breve en el botón de compra: pasa a un check + "Kosárban!"
  // por 1.4s y vuelve solo — feedback inmediato sin modal ni toast aparte.
  const [added, setAdded] = useState(false);

  function showNext() {
    if (images.length < 2) return;
    setActiveImageIdx((i) => (i + 1) % images.length);
  }
  function showPrev() {
    if (images.length < 2) return;
    setActiveImageIdx((i) => (i - 1 + images.length) % images.length);
  }

  useEffect(() => {
    if (!lightboxOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen, images.length]);

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
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  async function handleBuyNow() {
    await handleAddToCart();
    const url = useShopifyCart.getState().getCheckoutUrl();
    if (url) window.location.href = url;
  }

  // Sin min-h-screen: en páginas de producto cortas (poco texto/sin
  // variantes) dejaba un tramo de fondo blanco después del footer.
  return (
    <main className="bg-background text-foreground pt-16">
      {/* SiteNav vive ahora en __root.tsx */}
      {/* Mismos 2 niveles que `breadcrumbSchema` (JSON-LD) más abajo — sin
          apuntar al ancla #termekek, que TanStack Link no resuelve como ruta. */}
      <div className="mx-auto max-w-7xl px-6 pt-8 pb-20 grid lg:grid-cols-2 gap-10">
        {/* Visual */}
        <div>
          {/* Volver: Diego lo había sacado (se leía como barra de "volver"
              redundante con el navbar) y lo volvió a pedir el 2026-08-24 —
              por eso va chico y ligero (sólo texto + ícono, sin barra ni
              fondo propio) en vez del breadcrumb completo que se sacó antes.
              `history.back()` conserva scroll/filtros del carril de "Our
              boxes"; si no hay historial (entrada directa a la URL), cae al
              ancla de la sección de productos. */}
          <button
            type="button"
            onClick={() => {
              if (window.history.length > 1) window.history.back();
              else window.location.href = lang === "hu" ? "/#termekek" : "/en#termekek";
            }}
            className="mb-4 inline-flex items-center gap-1.5 font-sans text-sm text-foreground/60 transition-colors hover:text-fire"
          >
            <ArrowLeft className="h-4 w-4" /> {t.product.backToShop}
          </button>
          <button
            type="button"
            onClick={() => image && setLightboxOpen(true)}
            disabled={!image}
            aria-label={t.product.zoom}
            className="group relative aspect-square w-full rounded-2xl bg-gradient-to-br from-dark-bg to-cardboard/15 overflow-hidden border-2 border-cardboard/40 shadow-[8px_8px_0_0_#0D0D0D] cursor-zoom-in disabled:cursor-default"
          >
            <AnimatePresence mode="wait" initial={false}>
              {image ? (
                <motion.img
                  key={image.url}
                  src={image.url}
                  alt={image.altText ?? product.title}
                  // `object-contain` + padding (antes `object-cover` a
                  // sangre): con fotos que no son 1:1, `cover` recortaba
                  // partes del producto para llenar el cuadro. Con `contain`
                  // se ve la foto entera, y el padding evita que toque los
                  // bordes redondeados.
                  className="absolute inset-0 h-full w-full object-contain p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center">
                  <span className="font-display text-fire text-8xl text-fire-glow select-none">?</span>
                </div>
              )}
            </AnimatePresence>
            {image && (
              <span className="pointer-events-none absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-black/55 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                <ZoomIn className="h-5 w-5" />
              </span>
            )}
            {images.length > 1 && (
              <>
                <span
                  role="button"
                  tabIndex={-1}
                  onClick={(e) => { e.stopPropagation(); showPrev(); }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/60"
                >
                  <ChevronLeft className="h-5 w-5" />
                </span>
                <span
                  role="button"
                  tabIndex={-1}
                  onClick={(e) => { e.stopPropagation(); showNext(); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/60"
                >
                  <ChevronRight className="h-5 w-5" />
                </span>
              </>
            )}
          </button>
          {/* Galería: antes sólo se mostraba la primera foto (`images.edges[0]`)
              aunque Shopify trajera más. */}
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-none">
              {images.map((img: { url: string; altText: string | null }, i: number) => (
                <motion.button
                  key={img.url}
                  onClick={() => setActiveImageIdx(i)}
                  aria-label={`${product.title} — ${i + 1}`}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.96 }}
                  className={`shrink-0 h-16 w-16 rounded-xl overflow-hidden border-2 transition-colors ${
                    i === activeImageIdx ? "border-fire" : "border-cardboard/40 hover:border-cardboard/70"
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </div>
          )}
        </div>

        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogContent className="max-w-[92vw] sm:max-w-3xl border-none bg-black/95 p-0 text-white [&>button]:text-white [&>button]:opacity-80 [&>button:hover]:opacity-100">
            <div className="relative aspect-square w-full">
              <AnimatePresence mode="wait" initial={false}>
                {image && (
                  <motion.img
                    key={image.url}
                    src={image.url}
                    alt={image.altText ?? product.title}
                    className="absolute inset-0 h-full w-full object-contain"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  />
                )}
              </AnimatePresence>
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={showPrev}
                    aria-label={t.product.previous}
                    className="absolute left-3 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    onClick={showNext}
                    aria-label={t.product.next}
                    className="absolute right-3 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Info */}
        <div>
          <h1 className="font-display text-fire text-5xl sm:text-6xl mt-2 leading-none">{product.title}</h1>
          <div className="flex items-baseline gap-3 mt-5 overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={selectedVariant?.id ?? "base"}
                className="font-display text-4xl text-fire inline-block"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {selectedVariant
                  ? formatShopifyPrice(selectedVariant.price)
                  : formatShopifyPrice(product.priceRange.minVariantPrice)}
              </motion.span>
            </AnimatePresence>
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
                {variants.map((v: ProductVariant) => {
                  const isSelected = selectedVariant?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      disabled={!v.availableForSale}
                      className={`relative h-12 min-w-12 px-3 rounded-xl font-display text-lg border-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                        isSelected
                          ? "border-fire text-primary-foreground"
                          : "border-cardboard/60 text-foreground hover:border-fire"
                      }`}
                    >
                      {/* `layoutId` compartido: en vez de que el fondo aparezca/
                          desaparezca de golpe en cada botón, la misma mancha
                          morada se desliza de un botón al siguiente. */}
                      {isSelected && (
                        <motion.span
                          layoutId="variant-highlight"
                          className="absolute inset-0 z-0 rounded-[10px] bg-fire"
                          transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        />
                      )}
                      <span className="relative z-10">{v.title}</span>
                    </button>
                  );
                })}
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
              disabled={!available || isLoading || added}
              className="relative flex-1 overflow-hidden bg-fire text-primary-foreground font-display text-xl btn-drip hover:translate-y-[-2px] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* Confirmación: al agregar, el label se reemplaza un momento
                  por un check + "Kosárban!" en vez de abrir un toast aparte
                  — el feedback vive en el botón que se apretó. */}
              <AnimatePresence mode="wait" initial={false}>
                {added ? (
                  <motion.span
                    key="added"
                    className="flex items-center justify-center gap-2"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                  >
                    <Check className="h-5 w-5" /> {t.product.added}
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                  >
                    {t.product.addToCart} · {selectedVariant
                      ? formatShopifyPrice({ amount: String(parseFloat(selectedVariant.price.amount) * qty), currencyCode: selectedVariant.price.currencyCode })
                      : ""}
                  </motion.span>
                )}
              </AnimatePresence>
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
          {/* Antes 3 columnas con "100% márkás" primero — esa promesa no
              aplica al surtido real (pedido de Diego, 2026-08-24: "quitar
              100% márkás eso no va"). Quedan las 2 que sí son ciertas. */}
          <div className="mt-8 grid grid-cols-2 gap-3 text-center font-sans text-xs text-foreground/70">
            <div className="flex flex-col items-center gap-1.5 rounded-2xl border-2 border-cardboard/30 bg-dark-bg py-4 shadow-[4px_4px_0_0_#0D0D0D]">
              <Truck className="h-5 w-5 text-fire" /> {t.product.trustShipping}
            </div>
            <div className="flex flex-col items-center gap-1.5 rounded-2xl border-2 border-cardboard/30 bg-dark-bg py-4 shadow-[4px_4px_0_0_#0D0D0D]">
              <Sparkles className="h-5 w-5 text-fire" /> {t.product.trustValue}
            </div>
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        <DiscountWidget />
      </Suspense>
    </main>
  );
}
