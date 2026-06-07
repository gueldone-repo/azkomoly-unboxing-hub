import { useScrubProgress } from "@/components/ScrubBackdrop";

export function HeroOverlay({ onCta }: { onCta: () => void }) {
  const p = useScrubProgress();
  const py = (mult: number) => `translate3d(0, ${p * mult}px, 0)`;

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Corner brackets */}
      <span className="pointer-events-none absolute left-4 top-4 h-8 w-8 border-l-2 border-t-2 border-fire" />
      <span className="pointer-events-none absolute right-4 top-4 h-8 w-8 border-r-2 border-t-2 border-fire" />
      <span className="pointer-events-none absolute bottom-4 left-4 h-8 w-8 border-b-2 border-l-2 border-fire" />
      <span className="pointer-events-none absolute bottom-4 right-4 h-8 w-8 border-b-2 border-r-2 border-fire" />

      {/* Top-left meta */}
      <div
        className="absolute left-6 top-24 font-sans text-xs tracking-[0.3em] text-foreground/90"
        style={{ transform: py(-30) }}
      >
        EST · MMXXVI
      </div>

      {/* Top-right index */}
      <div
        className="absolute right-6 top-24 flex items-center gap-3 font-sans text-xs tracking-[0.3em] text-foreground/90"
        style={{ transform: py(-45) }}
      >
        <span className="text-fire">/01</span>
        <span>MYSTERY · BOX</span>
      </div>

      {/* Giant brand word */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-2">
        <h1
          className="font-display leading-none text-foreground"
          style={{
            mixBlendMode: "difference",
            transform: py(-80),
            fontSize: "clamp(2.8rem, 15vw, 17rem)",
            whiteSpace: "nowrap",
          }}
        >
          AZKOMOLY
        </h1>
      </div>

      {/* Tagline */}
      <p
        className="absolute bottom-32 left-6 max-w-xs font-sans text-sm leading-snug text-foreground/90"
        style={{ transform: py(40) }}
      >
        Márkás ruhák. Véletlenszerű tartalom. Nevetséges áron.
      </p>

      {/* Scroll cue */}
      <div
        className="absolute bottom-32 right-6 flex items-center gap-2 font-sans text-xs tracking-[0.3em] text-foreground/90"
        style={{ transform: py(60) }}
      >
        <span className="h-px w-8 bg-foreground" />
        GÖRGESS
      </div>

      {/* CTA */}
      <div className="absolute inset-x-0 bottom-10 z-10 flex justify-center px-6">
        <button
          onClick={onCta}
          className="bg-fire text-primary-foreground font-display text-lg sm:text-2xl px-8 py-4 graffiti-border hover:translate-y-[-2px] transition-transform"
        >
          Légy az első, aki felfedi a titkot
        </button>
      </div>
    </section>
  );
}
