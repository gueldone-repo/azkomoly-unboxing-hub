import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n";

export function HeroOverlay({ onCta }: { onCta: () => void }) {
  const t = useT();
  const [hp, setHp] = useState(0);

  useEffect(() => {
    let raf: number | null = null;
    const tick = () => {
      raf = null;
      const vh = window.innerHeight || 1;
      setHp(Math.min(1, Math.max(0, window.scrollY / vh)));
    };
    const onScroll = () => {
      if (raf == null) raf = requestAnimationFrame(tick);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf != null) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div
        className="absolute inset-x-0 top-1/2 flex flex-col items-center gap-4 px-6 text-center z-10"
        style={{ transform: `translateY(calc(-50% + ${hp * 55}px))` }}
      >
        <p
          className="font-sans text-sm text-white/80 tracking-wide max-w-xs leading-relaxed"
          style={{ textShadow: "0 1px 8px rgba(0,0,0,0.7)" }}
        >
          {t.hero.tagline}
        </p>
        <button
          onClick={onCta}
          className="bg-fire text-primary-foreground font-display text-2xl sm:text-3xl px-12 py-4 graffiti-border hover:translate-y-[-2px] transition-transform pulse-glow"
          style={{ textShadow: "0 0 12px rgba(0,0,0,0.5)" }}
        >
          {t.hero.cta}
        </button>
        <span className="font-sans text-[10px] tracking-[0.45em] text-white/35 mt-1">
          {t.hero.scroll} ↓
        </span>
      </div>
    </section>
  );
}
