import { Link } from "@tanstack/react-router";
import { formatHUF, type MockProduct } from "@/lib/mock-products";

const RARITY_LABEL: Record<MockProduct["rarity"], string> = {
  common: "Sima",
  rare: "Ritka",
  epic: "Epikus",
  legendary: "Legendás",
};

const ACCENT_BG: Record<MockProduct["accent"], string> = {
  fire: "from-fire/30 via-dark-bg to-dark-bg",
  cardboard: "from-cardboard/30 via-dark-bg to-dark-bg",
  bone: "from-foreground/15 via-dark-bg to-dark-bg",
};

export function ProductCard({ p }: { p: MockProduct }) {
  const lowStock = p.stock <= 25;
  const off =
    p.compareAt && p.compareAt > p.price
      ? Math.round((1 - p.price / p.compareAt) * 100)
      : 0;

  return (
    <article className="group relative flex flex-col bg-dark-bg border-2 border-cardboard/40 hover:border-fire transition-colors overflow-hidden">
      {/* Visual */}
      <div
        className={`relative aspect-square overflow-hidden bg-gradient-to-br ${ACCENT_BG[p.accent]}`}
      >
        {/* Crosshatch texture */}
        <div className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(135deg,transparent_0_10px,oklch(0.66_0.12_65/0.25)_10px_11px)]" />
        {/* Box silhouette */}
        <div className="absolute inset-0 grid place-items-center">
          <div className="relative w-3/5 aspect-square">
            <div className="absolute inset-0 bg-cardboard graffiti-border group-hover:rotate-3 transition-transform duration-500" />
            <div className="absolute inset-0 grid place-items-center">
              <span className="font-display text-fire text-4xl sm:text-5xl text-fire-glow text-stroke-black select-none">
                ?
              </span>
            </div>
          </div>
        </div>
        {/* Badge */}
        {p.badge && (
          <span className="absolute top-3 left-3 bg-fire text-primary-foreground font-display text-xs px-3 py-1 graffiti-border">
            {p.badge}
          </span>
        )}
        {off > 0 && (
          <span className="absolute top-3 right-3 bg-dark-bg border-2 border-fire text-fire font-display text-sm px-2 py-1">
            -{off}%
          </span>
        )}
        {lowStock && (
          <span className="absolute bottom-3 left-3 right-3 text-center bg-destructive/90 text-destructive-foreground font-sans text-xs tracking-widest py-1.5">
            UTOLSÓ {p.stock} DB
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-display text-2xl text-foreground leading-none">
            {p.name}
          </h3>
          <span className="font-sans text-[10px] tracking-[0.25em] text-fire">
            {RARITY_LABEL[p.rarity].toUpperCase()}
          </span>
        </div>
        <p className="font-sans text-xs text-foreground/60 -mt-2">{p.tier}</p>
        <p className="font-sans text-sm text-foreground/80 leading-snug">
          {p.blurb}
        </p>
        <div className="flex items-center justify-between gap-2 mt-1">
          <span className="font-sans text-xs text-foreground/60">
            {p.pieces}
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
        <Link
          to="/shop/$slug"
          params={{ slug: p.slug }}
          className="mt-2 bg-fire text-primary-foreground font-display text-lg text-center py-3 graffiti-border hover:translate-y-[-2px] transition-transform"
        >
          MEGNYITOM
        </Link>
      </div>
    </article>
  );
}
