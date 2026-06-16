import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { formatHUF, type MockProduct } from "@/lib/mock-products";
import { useT } from "@/lib/i18n";
import { useCart } from "@/lib/cart";

const ACCENT_BG: Record<MockProduct["accent"], string> = {
  fire: "from-fire/30 via-dark-bg to-dark-bg",
  cardboard: "from-cardboard/30 via-dark-bg to-dark-bg",
  bone: "from-foreground/15 via-dark-bg to-dark-bg",
};

export function ProductCard({ p }: { p: MockProduct }) {
  const t = useT();
  const { add } = useCart();
  const copy = t.products.items[p.id];
  const lowStock = p.stock <= 25;
  const off =
    p.compareAt && p.compareAt > p.price
      ? Math.round((1 - p.price / p.compareAt) * 100)
      : 0;

  return (
    <article className="group relative flex flex-col bg-dark-bg/85 backdrop-blur-md border-2 border-cardboard/40 hover:border-fire transition-all duration-300 overflow-hidden hover:shadow-[0_0_30px_oklch(0.78_0.17_70/0.25)] hover:-translate-y-1">
      {/* Visual */}
      <div className="relative aspect-square overflow-hidden bg-dark-bg">
        <img
          src={p.image}
          alt={copy.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          draggable={false}
        />
        {/* Badge */}
        {copy.badge && (
          <span className="absolute top-3 left-3 bg-fire text-primary-foreground font-display text-xs px-3 py-1 graffiti-border">
            {copy.badge}
          </span>
        )}
        {off > 0 && (
          <span className="absolute top-3 right-3 bg-dark-bg border-2 border-fire text-fire font-display text-sm px-2 py-1">
            -{off}%
          </span>
        )}
        {lowStock && (
          <span className="absolute bottom-3 left-3 right-3 text-center bg-destructive/90 text-destructive-foreground font-sans text-xs tracking-widest py-1.5">
            {t.products.lastUnits(p.stock)}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-display text-2xl text-foreground leading-none">
            {copy.name}
          </h3>
          <span className="font-sans text-[10px] tracking-[0.25em] text-fire">
            {t.products.rarity[p.rarity].toUpperCase()}
          </span>
        </div>
        <p className="font-sans text-xs text-foreground/60 -mt-2">{copy.tier}</p>
        <p className="font-sans text-sm text-foreground/80 leading-snug">
          {copy.blurb}
        </p>
        <div className="flex items-center justify-between gap-2 mt-1">
          <span className="font-sans text-xs text-foreground/60">
            {copy.pieces}
          </span>
          <div className="text-right">
            {p.compareAt && (
              <span className="block font-sans text-xs text-foreground/40 line-through leading-none">
                {formatHUF(p.compareAt)}
              </span>
            )}
            <span className="font-display text-2xl text-fire leading-tight">
              {formatHUF(p.price)}
            </span>
          </div>
        </div>
        <div className="mt-2 flex gap-2">
          <Link
            to="/shop/$slug"
            params={{ slug: p.slug }}
            className="flex-1 bg-fire text-primary-foreground font-display text-lg text-center py-3 graffiti-border hover:translate-y-[-2px] transition-transform"
          >
            {t.products.open}
          </Link>
          <button
            type="button"
            onClick={() => add(p, "M", 1)}
            aria-label={t.product.addToCart}
            title={t.product.addToCart}
            className="shrink-0 grid place-items-center w-12 border-2 border-cardboard/60 text-foreground hover:text-fire hover:border-fire transition-colors"
          >
            <ShoppingBag className="h-5 w-5" />
          </button>
        </div>
      </div>
    </article>
  );
}
