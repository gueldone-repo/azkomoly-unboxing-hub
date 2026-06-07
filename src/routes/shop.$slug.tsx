import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { MOCK_PRODUCTS, formatHUF } from "@/lib/mock-products";
import { ShieldCheck, Truck, Sparkles, ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/shop/$slug")({
  head: ({ params }) => {
    const p = MOCK_PRODUCTS.find((x) => x.slug === params.slug);
    const title = p ? `${p.name} — AZKOMOLY` : "Termék — AZKOMOLY";
    const desc = p?.blurb ?? "AZKOMOLY mystery box";
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
  errorComponent: ({ reset }) => (
    <div className="min-h-screen grid place-items-center bg-background text-foreground p-6 text-center">
      <div>
        <h1 className="font-display text-3xl text-fire mb-4">Hiba történt</h1>
        <button onClick={reset} className="bg-fire text-primary-foreground font-display px-6 py-3 graffiti-border">
          ÚJRA
        </button>
      </div>
    </div>
  ),
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center bg-background text-foreground p-6 text-center">
      <div>
        <h1 className="font-display text-4xl text-fire mb-4">Nincs ilyen doboz</h1>
        <Link to="/shop" className="bg-fire text-primary-foreground font-display px-6 py-3 graffiti-border">
          VISSZA A BOLTHOZ
        </Link>
      </div>
    </div>
  ),
  component: ProductPage,
});

const SIZES = ["S", "M", "L", "XL"] as const;

function ProductPage() {
  const { product: p } = Route.useLoaderData();
  const [size, setSize] = useState<(typeof SIZES)[number]>("M");
  const [qty, setQty] = useState(1);

  return (
    <main className="bg-background text-foreground min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <Link to="/shop" className="inline-flex items-center gap-1 font-sans text-sm text-foreground/70 hover:text-fire">
          <ChevronLeft className="h-4 w-4" /> Vissza a bolthoz
        </Link>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-20 grid lg:grid-cols-2 gap-10">
        {/* Visual */}
        <div className="relative aspect-square bg-gradient-to-br from-cardboard/30 via-dark-bg to-dark-bg overflow-hidden border-2 border-cardboard/40">
          <div className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(135deg,transparent_0_10px,oklch(0.66_0.12_65/0.25)_10px_11px)]" />
          <div className="absolute inset-0 grid place-items-center">
            <div className="relative w-2/3 aspect-square bg-cardboard graffiti-border">
              <span className="absolute inset-0 grid place-items-center font-display text-fire text-9xl text-fire-glow text-stroke-black">
                ?
              </span>
            </div>
          </div>
          {p.badge && (
            <span className="absolute top-4 left-4 bg-fire text-primary-foreground font-display text-sm px-3 py-1 graffiti-border">
              {p.badge}
            </span>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="font-sans text-xs tracking-[0.3em] text-fire">{p.tier.toUpperCase()}</p>
          <h1 className="font-display text-5xl sm:text-6xl text-foreground mt-2 leading-none">{p.name}</h1>
          <div className="flex items-baseline gap-3 mt-5">
            <span className="font-display text-4xl text-fire">{formatHUF(p.price)}</span>
            {p.compareAt && (
              <span className="font-sans text-lg text-foreground/40 line-through">
                {formatHUF(p.compareAt)}
              </span>
            )}
          </div>
          <p className="font-sans text-base text-foreground/80 mt-6 leading-relaxed">{p.blurb}</p>

          <ul className="mt-6 space-y-2 font-sans text-sm text-foreground/80">
            <li>📦 Tartalom: <strong className="text-foreground">{p.pieces}</strong></li>
            <li>💎 Garantált érték: <strong className="text-foreground">min. {formatHUF(p.price)}</strong></li>
            <li>🔥 Készleten: <strong className={p.stock <= 25 ? "text-destructive" : "text-foreground"}>{p.stock} db</strong></li>
          </ul>

          {/* Size */}
          <div className="mt-8">
            <p className="font-sans text-xs tracking-[0.3em] text-foreground/70 mb-3">MÉRET</p>
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
            <button className="flex-1 bg-fire text-primary-foreground font-display text-xl graffiti-border hover:translate-y-[-2px] transition-transform">
              KOSÁRBA · {formatHUF(p.price * qty)}
            </button>
          </div>

          <button className="mt-3 w-full bg-dark-bg border-2 border-foreground/80 text-foreground font-display text-lg py-3 hover:bg-foreground hover:text-dark-bg transition-colors">
            AZONNALI VÁSÁRLÁS
          </button>

          {/* Trust */}
          <div className="mt-8 grid grid-cols-3 gap-3 text-center font-sans text-xs text-foreground/70">
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="h-5 w-5 text-fire" /> 100% márkás
            </div>
            <div className="flex flex-col items-center gap-1">
              <Truck className="h-5 w-5 text-fire" /> 2–4 nap szállítás
            </div>
            <div className="flex flex-col items-center gap-1">
              <Sparkles className="h-5 w-5 text-fire" /> Garantált érték
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
