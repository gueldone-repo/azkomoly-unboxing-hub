import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useT } from "@/lib/i18n";

function scrollToProducts() {
  document.getElementById("termekek")?.scrollIntoView({ behavior: "smooth" });
}

export function HeroOverlay({ onCta }: { onCta: () => void }) {
  const t = useT();
  const [hp, setHp] = useState(0);
  const headingLines = t.hero.heading.split("\n");

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
    <section className="relative min-h-screen w-full overflow-hidden bg-background flex flex-col justify-center gap-2 py-16 sm:py-20">
      {/* Logo — capa fija arriba de todo */}
      <div
        className="relative z-30 flex justify-center mb-2"
        style={{ transform: `translateY(calc(${hp * 10}px))` }}
      >
        <img
          src="/azkomoly_new_logo.png"
          alt="AZKOMOLY"
          className="h-10 sm:h-12 w-auto"
          draggable={false}
        />
      </div>

      {/* Capa 1 — H1, dos líneas máximo, corta arriba / larga abajo */}
      <div
        className="relative z-0 px-4"
        style={{ transform: `translateY(calc(${hp * 20}px))` }}
      >
        <h1
          className="text-fire text-3d-fire text-center leading-[0.78] tracking-[-0.01em] select-none"
          style={{ fontFamily: "'Danfo', var(--font-display)" }}
        >
          {headingLines.map((line, i) => (
            <span
              key={i}
              className="block"
              style={{ fontSize: "clamp(3rem, 10vw, 8rem)" }}
            >
              {line}
            </span>
          ))}
        </h1>
      </div>

      {/* Capa 2 — imagen + (capa 3 H2 / capa 4 CTA) agrupadas, superpuestas
          sobre la segunda línea del H1 */}
      <div
        className="relative z-10 -mt-[11vw] sm:-mt-[4vw] flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-10 px-6"
        style={{ transform: `translateY(calc(${hp * 45}px))` }}
      >
        <img
          src="/azkomoly-caja-hero.png"
          alt="AZKOMOLY meglepetés doboz"
          className="w-[58vw] sm:w-[33vw] max-w-[320px] sm:max-w-[390px] h-auto drop-shadow-[0_30px_40px_rgba(0,0,0,0.18)] pointer-events-none"
          draggable={false}
          fetchPriority="high"
          decoding="sync"
        />

        <div className="flex flex-col items-center sm:items-start gap-4 text-center sm:text-left">
          <h2
            className="text-base sm:text-lg text-foreground/60 max-w-xs"
            style={{ fontFamily: "'ADLaM Display', var(--font-sans)" }}
          >
            {t.hero.tagline}
          </h2>
          <button
            onClick={scrollToProducts}
            className="btn-drip bg-fire text-primary-foreground text-lg sm:text-xl px-8 py-3.5 rounded-full hover:-translate-y-1 transition-all whitespace-nowrap"
            style={{ fontFamily: "'ADLaM Display', var(--font-sans)" }}
          >
            {t.hero.cta}
          </button>
        </div>
      </div>

      <button
        onClick={scrollToProducts}
        aria-label={t.hero.scroll}
        className="absolute inset-x-0 bottom-5 z-20 flex justify-center animate-bounce-down text-fire"
      >
        <ChevronDown className="h-8 w-8" strokeWidth={3} />
      </button>
    </section>
  );
}
