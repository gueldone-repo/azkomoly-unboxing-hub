import { useT } from "@/lib/i18n";

function scrollToProducts() {
  document.getElementById("termekek")?.scrollIntoView({ behavior: "smooth" });
}

/**
 * Hero v2 — reconstruido sobre la referencia que pasó Diego.
 *
 * Composición (desktop): el viewport se reparte en zonas que NO se pisan entre
 * texto y texto, y sí se pisan a propósito entre imagen y título.
 *
 *   ┌───────────────────────────────────────────┐
 *   │                        TITULO (arriba dcha)│  <- z-0, es el "fondo"
 *   │        ┌─────────┐                         │
 *   │        │  CAJA   │     tagline + CTA       │  <- CTA en zona limpia
 *   │        │ (z-20)  │     (z-30, dcha)        │
 *   └────────┴────┬────┴─────────────────────────┘
 *                 └── desborda sobre la sección siguiente
 *
 * La caja son dos tomas (cerrada / estallando) apiladas en el MISMO sitio; solo
 * cambia la opacidad, así el objeto no se mueve y se lee "la misma caja late",
 * no "dos fotos distintas". Ver .hero-swap-top en styles.css.
 *
 * En móvil no hay solape: el orden es caja, título, CTA, apilados. Intentar
 * mantener la superposición en 390px de ancho sólo produce texto ilegible.
 *
 * Sin listeners de scroll (el hero viejo corría uno por frame y re-renderizaba
 * React); acá el único movimiento es CSS.
 */
export function HeroV2() {
  const t = useT();
  const lines = t.hero.heading.split("\n");

  const title = (
    <h1
      className="text-fire leading-[0.82] tracking-[-0.02em] select-none"
      style={{
        fontFamily: "'Anton', var(--font-display)",
        fontSize: "clamp(2.75rem, 8.6vw, 7.5rem)",
      }}
    >
      {lines.map((line, i) => (
        <span key={i} className="block">
          {line}
        </span>
      ))}
    </h1>
  );

  const box = (
    <div className="relative w-full aspect-[1376/768]">
      <img
        src="/azkomoly_new_HERO_1.png"
        alt="AZKOMOLY meglepetés doboz"
        className="absolute inset-0 h-full w-full object-contain"
        draggable={false}
        fetchPriority="high"
        decoding="sync"
      />
      {/* Segunda toma encima, mismo encuadre. aria-hidden: para un lector de
          pantalla es la misma caja, no contenido nuevo. */}
      <img
        src="/azkomoly_new_HERO_2.png"
        alt=""
        aria-hidden="true"
        className="hero-swap-top absolute inset-0 h-full w-full object-contain"
        draggable={false}
        decoding="async"
      />
    </div>
  );

  const cta = (
    <div className="flex flex-col items-center lg:items-start gap-5 text-center lg:text-left">
      <p className="font-sans text-base sm:text-lg text-foreground/70 max-w-[28ch] leading-relaxed">
        {t.hero.tagline}
      </p>
      <button
        onClick={scrollToProducts}
        className="bg-fire text-white font-sans font-semibold tracking-wide text-base sm:text-lg px-8 py-4 rounded-full whitespace-nowrap shadow-[0_10px_30px_rgba(91,46,168,0.35)] transition-transform duration-200 hover:-translate-y-1 active:translate-y-0 active:scale-[0.98]"
      >
        {t.hero.cta}
      </button>
    </div>
  );

  return (
    // z-10 sobre la sección siguiente: sin esto, la caja que desborda hacia
    // abajo quedaría pintada DEBAJO del bloque de productos y se cortaría.
    <section className="relative z-10 w-full bg-background overflow-x-clip">
      {/* ---------- MÓVIL / TABLET: apilado, sin solapes ---------- */}
      <div className="lg:hidden flex flex-col items-center gap-6 px-6 pt-24 pb-0">
        <div className="w-full text-center [&_h1]:text-center">{title}</div>
        <div className="w-[92vw] max-w-[560px] -mb-[12vw]">{box}</div>
        <div className="w-full pb-[14vw]">{cta}</div>
      </div>

      {/* ---------- DESKTOP: composición por zonas ---------- */}
      <div className="hidden lg:block relative min-h-[100dvh]">
        {/* Título: cuadrante superior derecho. pointer-events-none para que
            nunca robe un click al CTA que tiene encima. */}
        <div className="pointer-events-none absolute top-[15%] right-[3vw] z-0 text-right">
          {title}
        </div>

        {/* Caja: entra por la izquierda, sube lo suficiente para morder la
            esquina del título (ese solape ES el diseño: la imagen es primera
            capa, el texto es fondo) y baja hasta salirse del hero. El bottom
            negativo es el desborde sobre la sección siguiente. */}
        <div className="absolute left-[6vw] bottom-[-5vw] z-20 w-[58vw] max-w-[950px]">
          {box}
        </div>

        {/* Tagline + CTA: banda derecha inferior, donde ni el título ni la
            caja llegan. Es la única zona del hero con fondo limpio. */}
        <div className="absolute right-[4vw] top-[58%] z-30 w-[32vw] max-w-[430px]">
          {cta}
        </div>
      </div>
    </section>
  );
}
