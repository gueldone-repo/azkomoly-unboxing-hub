import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { MOCK_PRODUCTS, formatHUF } from "@/lib/mock-products";
import { ShieldCheck, Truck, Sparkles, ChevronLeft } from "lucide-react";
import { useT, readLangCookie } from "@/lib/i18n";
import { DICTIONARIES } from "@/lib/i18n/dictionary";
import { useCart } from "@/lib/cart";
import { CartButton } from "@/components/cart/CartSheet";

export const Route = createFileRoute("/shop/$slug")({
  head: ({ params }) => {
    const t = DICTIONARIES[readLangCookie()];
    const p = MOCK_PRODUCTS.find((x) => x.slug === params.slug);
    const copy = p ? t.products.items[p.id] : undefined;
    const title = copy ? `${copy.name} — AZKOMOLY` : "AZKOMOLY";
    const desc = copy?.blurb ?? t.meta.ogDescription;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  loader: ({ params }) => {
    const product = MOCK_PRODUCTS.find((x) => x.slug === params.slug);
    if (!product) throw notFound();
    return { product };
  },
  errorComponent: ({ reset }) => <ProductError reset={reset} />,
  notFoundComponent: () => <ProductNotFound />,
  component: ProductPage,
});

const SIZES = ["S", "M", "L", "XL"] as const;

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
  const { product: p } = Route.useLoaderData();
  const t = useT();
  const { add } = useCart();
  const copy = t.products.items[p.id];
  const [size, setSize] = useState<(typeof SIZES)[number]>("M");
  const [qty, setQty] = useState(1);

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
          <img
            src={p.image}
            alt={copy.name}
            className="w-full h-full object-cover"
          />
          {copy.badge && (
            <span className="absolute top-4 left-4 bg-fire text-primary-foreground font-display text-sm px-3 py-1 graffiti-border">
              {copy.badge}
            </span>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="font-sans text-xs tracking-[0.3em] text-fire">{copy.tier.toUpperCase()}</p>
          <h1 className="font-display text-5xl sm:text-6xl text-foreground mt-2 leading-none">{copy.name}</h1>
          <div className="flex items-baseline gap-3 mt-5">
            <span className="font-display text-4xl text-fire">{formatHUF(p.price)}</span>
            {p.compareAt && (
              <span className="font-sans text-lg text-foreground/40 line-through">
                {formatHUF(p.compareAt)}
              </span>
            )}
          </div>
          <p className="font-sans text-base text-foreground/80 mt-6 leading-relaxed">{copy.blurb}</p>

          <ul className="mt-6 space-y-2 font-sans text-sm text-foreground/80">
            <li>📦 {t.product.contents}: <strong className="text-foreground">{copy.pieces}</strong></li>
            <li>💎 {t.product.guaranteedValueShort}: <strong className="text-foreground">min. {formatHUF(p.price)}</strong></li>
            <li>🔥 {t.product.inStock}: <strong className={p.stock <= 25 ? "text-destructive" : "text-foreground"}>{p.stock} {t.product.units}</strong></li>
          </ul>

          {/* Size */}
          <div className="mt-8">
            <p className="font-sans text-xs tracking-[0.3em] text-foreground/70 mb-3">{t.product.size}</p>
            <div className="flex gap-2">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`h-12 w-12 font-display text-lg border-2 transition-colors ${
                    size === s
                      ? "bg-fire text-primary-foreground border-fire"
                      : "border-cardboard/60 text-foreground hover:border-fire"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Qty + Add */}
          <div className="mt-6 flex gap-3 items-stretch">
            <div className="flex items-center border-2 border-cardboard/60">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-14 w-12 font-display text-2xl text-fire">−</button>
              <span className="h-14 w-12 grid place-items-center font-display text-xl">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="h-14 w-12 font-display text-2xl text-fire">+</button>
            </div>
            <button
              onClick={() => add(p, size, qty)}
              className="flex-1 bg-fire text-primary-foreground font-display text-xl graffiti-border hover:translate-y-[-2px] transition-transform"
            >
              {t.product.addToCart} · {formatHUF(p.price * qty)}
            </button>
          </div>

          <button
            onClick={() => add(p, size, qty)}
            className="mt-3 w-full bg-dark-bg border-2 border-foreground/80 text-foreground font-display text-lg py-3 hover:bg-foreground hover:text-dark-bg transition-colors"
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
