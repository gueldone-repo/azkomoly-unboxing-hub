import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { useShopifyCart } from "@/lib/shopify/cart-store";
import { formatShopifyPrice, type ShopifyProduct } from "@/lib/shopify/client";
import { useT } from "@/lib/i18n";

export function ProductCard({ p }: { p: ShopifyProduct }) {
  const t = useT();
  const addItem = useShopifyCart((s) => s.addItem);
  const isLoading = useShopifyCart((s) => s.isLoading);

  const product = p.node;
  const image = product.images.edges[0]?.node;
  const firstVariant = product.variants.edges[0]?.node;
  const available = firstVariant?.availableForSale ?? false;

  function handleQuickAdd() {
    if (!firstVariant) return;
    addItem({
      product: p,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions,
    });
  }

  return (
    <article className="group relative flex flex-col bg-dark-bg/85 backdrop-blur-md border-2 border-cardboard/40 hover:border-fire transition-all duration-300 overflow-hidden hover:shadow-[0_0_30px_oklch(0.78_0.17_70/0.25)] hover:-translate-y-1">
      {/* Whole-card link: clicking anywhere opens the product */}
      <Link
        to="/shop/$slug"
        params={{ slug: product.handle }}
        aria-label={product.title}
        className="absolute inset-0 z-10"
      />
      {/* Visual */}
      <div className="relative aspect-square overflow-hidden bg-dark-bg">
        {image ? (
          <img
            src={image.url}
            alt={image.altText ?? product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full grid place-items-center">
            <span className="font-display text-fire text-6xl text-fire-glow text-stroke-black select-none">?</span>
          </div>
        )}
        {!available && (
          <span className="absolute bottom-3 left-3 right-3 text-center bg-destructive/90 text-destructive-foreground font-sans text-xs tracking-widest py-1.5">
            {t.products.soldOut}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-display text-2xl text-foreground leading-none">
            {product.title}
          </h3>
        </div>
        {product.description && (
          <p className="font-sans text-sm text-foreground/80 leading-snug line-clamp-2">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between gap-2 mt-auto">
          <span className="font-display text-2xl text-fire leading-tight">
            {firstVariant
              ? formatShopifyPrice(firstVariant.price)
              : formatShopifyPrice(product.priceRange.minVariantPrice)}
          </span>
        </div>
        <div className="relative z-20 mt-2 flex gap-2">
          <Link
            to="/shop/$slug"
            params={{ slug: product.handle }}
            className="btn-drip flex-1 bg-fire text-primary-foreground font-display text-lg text-center py-3 hover:translate-y-[-2px] transition-transform"
          >
            {t.products.open}
          </Link>
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={!available || isLoading}
            aria-label={t.product.addToCart}
            title={t.product.addToCart}
            className="shrink-0 grid place-items-center w-12 border-2 border-cardboard/60 text-foreground hover:text-fire hover:border-fire transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingBag className="h-5 w-5" />
          </button>
        </div>
      </div>
    </article>
  );
}

/**
 * Card ancha para el carrusel de "Our boxes": una a la vez, imagen grande +
 * descripción completa (sin recortar), en vez del grid chico de antes.
 */
export function ProductCardWide({ p }: { p: ShopifyProduct }) {
  const t = useT();
  const addItem = useShopifyCart((s) => s.addItem);
  const isLoading = useShopifyCart((s) => s.isLoading);

  const product = p.node;
  const image = product.images.edges[0]?.node;
  const firstVariant = product.variants.edges[0]?.node;
  const available = firstVariant?.availableForSale ?? false;

  function handleQuickAdd() {
    if (!firstVariant) return;
    addItem({
      product: p,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions,
    });
  }

  return (
    <article
      className="group relative flex flex-col sm:flex-row bg-dark-bg border-2 border-cardboard/40 hover:border-fire transition-all duration-300 overflow-hidden"
      style={{ boxShadow: "0 12px 0 0 #3D1F73, 0 20px 30px rgba(13,13,13,0.35)" }}
    >
      <Link
        to="/shop/$slug"
        params={{ slug: product.handle }}
        aria-label={product.title}
        className="absolute inset-0 z-10"
      />
      {/* Visual */}
      <div className="relative w-full sm:w-1/2 aspect-square sm:aspect-auto overflow-hidden bg-dark-bg shrink-0">
        {image ? (
          <img
            src={image.url}
            alt={image.altText ?? product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full grid place-items-center">
            <span className="font-display text-fire text-8xl text-fire-glow text-stroke-black select-none">?</span>
          </div>
        )}
        {!available && (
          <span className="absolute bottom-3 left-3 right-3 text-center bg-destructive/90 text-destructive-foreground font-sans text-xs tracking-widest py-1.5">
            {t.products.soldOut}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-4 p-6 sm:p-8 justify-center">
        <h3 className="font-display text-3xl sm:text-4xl text-foreground leading-none">
          {product.title}
        </h3>
        {product.description && (
          <p className="font-sans text-sm sm:text-base text-foreground/80 leading-relaxed">
            {product.description}
          </p>
        )}
        <span className="font-display text-3xl text-fire leading-tight">
          {firstVariant
            ? formatShopifyPrice(firstVariant.price)
            : formatShopifyPrice(product.priceRange.minVariantPrice)}
        </span>
        <div className="relative z-20 mt-2 flex gap-2">
          <Link
            to="/shop/$slug"
            params={{ slug: product.handle }}
            className="btn-drip flex-1 bg-fire text-primary-foreground font-display text-lg text-center py-3 hover:translate-y-[-2px] transition-transform"
          >
            {t.products.open}
          </Link>
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={!available || isLoading}
            aria-label={t.product.addToCart}
            title={t.product.addToCart}
            className="shrink-0 grid place-items-center w-12 border-2 border-cardboard/60 text-foreground hover:text-fire hover:border-fire transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingBag className="h-5 w-5" />
          </button>
        </div>
      </div>
    </article>
  );
}
