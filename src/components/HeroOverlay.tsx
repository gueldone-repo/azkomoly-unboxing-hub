import { useEffect, useState } from "react";
import { useT } from "@/lib/i18n";

function scrollToProducts() {
  document.getElementById("termekek")?.scrollIntoView({ behavior: "smooth" });
}

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
      <h1 className="sr-only">{t.hero.heading}</h1>

      {/* ? as background texture — huge, off-center, mostly transparent */}
      <div
        className="absolute pointer-events-none select-none"
        style={{
          right: "-8vw",
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: "clamp(18rem, 55vw, 42rem)",
          lineHeight: 1,
          fontFamily: "var(--font-display)",
          color: "transparent",
          WebkitTextStroke: "1.5px oklch(0.78 0.17 70 / 0.12)",
        }}
      >
        ?
      </div>

      <div
        className="absolute inset-x-0 top-1/2 flex flex-col items-center gap-5 px-6 text-center z-10"
        style={{ transform: `translateY(calc(-50% + ${hp * 55}px))` }}
      >
        {/* Kicker */}
        <p className="font-sans text-[9px] tracking-[0.55em] text-white/40 uppercase">
          {t.hero.est} · {t.hero.mysteryBox}
        </p>

        {/* CTA */}
        <button
          onClick={scrollToProducts}
          className="bg-fire text-primary-foreground font-display text-2xl sm:text-3xl px-12 py-4 graffiti-border hover:translate-y-[-3px] transition-transform"
          style={{ textShadow: "0 0 12px rgba(0,0,0,0.6)" }}
        >
          {t.hero.cta}
        </button>

        <span className="font-sans text-[9px] tracking-[0.5em] text-white/30">
          {t.hero.scroll} ↓
        </span>
      </div>
    </section>
  );
}
