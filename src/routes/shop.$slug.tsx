import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, Truck, Sparkles, ChevronLeft } from "lucide-react";
import { useT, readLangCookie } from "@/lib/i18n";
import { DICTIONARIES } from "@/lib/i18n/dictionary";
import { fetchProductByHandle, formatShopifyPrice } from "@/lib/shopify/client";
import { useShopifyCart } from "@/lib/shopify/cart-store";
import { CartButton } from "@/components/cart/CartSheet";

export const Route = createFileRoute("/shop/$slug")({
  head: () => {
    const t = DICTIONARIES[readLangCookie()];
    return {
      meta: [
        { title: "AZKOMOLY" },
        { name: "description", content: t.meta.ogDescription },
        { property: "og:title", content: "AZKOMOLY" },
        { property: "og:description", content: t.meta.ogDescription },
      ],
    };
  },
  loader: async ({ params }) => {
    const product = await fetchProductByHandle(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  errorComponent: ({ reset }) => <ProductError reset={reset} />,
  notFoundComponent: () => <ProductNotFound />,
  component: ProductPage,
});

function ProductError({ reset }: { reset: () => void }) {
  const t = useT();
  return (
    <div className="min-h-screen grid place-items-center bg-background text-foreground p-6 text-center">
      <div>
        <h1 className="font-display text-3xl text-fire mb-4">{t.product.errorTitle}</h1>
        <button onClick={reset} className="bg-fire text-primary-foreground font-display px-6 py-3 graffiti-border">
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
        <Link to="/" className="bg-fire text-primary-foreground font-display px-6 py-3 graffiti-border">
          {t.product.backToShop}
        </Link>
      </div>
    </div>
  );
}

function ProductPage() {
  const { product } = Route.useLoaderData();
  const t = useT();
  const addItem = useShopifyCart((s) => s.addItem);
  const checkoutUrl = useShopifyCart((s) => s.checkoutUrl);
  const isLoading = useShopifyCart((s) => s.isLoading);

  const variants = product.variants.edges.map((e) => e.node);
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const [qty, setQty] = useState(1);

  const image = product.images.edges[0]?.node;
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
    const url = useShopifyCart.getState().checkoutUrl;
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

      <div className="mx-auto max-w-7xl px-6 pb-20 grid lg:grid-cols-2 gap-10">
        {/* Visual */}
        <div className="relative aspect-square bg-dark-bg overflow-hidden border-2 border-cardboard/40">
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

        {/* Info */}
        <div>
          <h1 className="font-display text-5xl sm:text-6xl text-foreground mt-2 leading-none">{product.title}</h1>
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
                {variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    disabled={!v.availableForSale}
                    className={`h-12 min-w-12 px-3 font-display text-lg border-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
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
            <div className="flex items-center border-2 border-cardboard/60">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-14 w-12 font-display text-2xl text-fire">−</button>
              <span className="h-14 w-12 grid place-items-center font-display text-xl">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="h-14 w-12 font-display text-2xl text-fire">+</button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!available || isLoading}
              className="flex-1 bg-fire text-primary-foreground font-display text-xl graffiti-border hover:translate-y-[-2px] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t.product.addToCart} · {selectedVariant
                ? formatShopifyPrice({ amount: String(parseFloat(selectedVariant.price.amount) * qty), currencyCode: selectedVariant.price.currencyCode })
                : ""}
            </button>
          </div>

          <button
            onClick={handleBuyNow}
            disabled={!available || isLoading}
            className="mt-3 w-full bg-dark-bg border-2 border-foreground/80 text-foreground font-display text-lg py-3 hover:bg-foreground hover:text-dark-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.product.buyNow}
          </button>

          {/* Trust */}
          <div className="mt-8 grid grid-cols-3 gap-3 text-center font-sans text-xs text-foreground/70">
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="h-5 w-5 text-fire" /> {t.product.trustBranded}
            </div>
            <div className="flex flex-col items-center gap-1">
              <Truck className="h-5 w-5 text-fire" /> {t.product.trustShipping}
            </div>
            <div className="flex flex-col items-center gap-1">
              <Sparkles className="h-5 w-5 text-fire" /> {t.product.trustValue}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
