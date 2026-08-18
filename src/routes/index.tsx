import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { motion, useReducedMotion } from "motion/react";
import { getUrgencyDeadline } from "@/lib/urgency.functions";
import { MousePointer2, ChevronLeft, ChevronRight } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { SOCIAL_REVIEWS } from "@/components/SocialProofMarquee";
import { SiteNav } from "@/components/nav/SiteNav";
import { useSignupDialogStore } from "@/lib/state/signup-dialog-store";

import { HeroV2 } from "@/components/HeroV2";
import TextLoop from "@/components/TextLoop";
import { SOCIAL_LINKS, SocialGlyph, SocialRail } from "@/components/social/SocialLogos";
import { ProductTiltCard } from "@/components/shop/ProductTiltCard";
import { SlidingNumber } from "@/components/core/sliding-number";
import { ScrollFloat } from "@/components/text/ScrollFloat";
import { ScrollVelocity } from "@/components/text/ScrollVelocity";
import { Marquee } from "@/components/ui/marquee";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify/client";
import { useT, useI18n, readLangCookie } from "@/lib/i18n";
import { DICTIONARIES } from "@/lib/i18n/dictionary";
import { seoLinks } from "@/lib/seo";

/**
 * Overlays y widgets que no forman parte del primer render: se cargan en un
 * chunk aparte para que el JS inicial (hero + productos) sea más chico y la
 * página pinte antes. Antes venían todos en el bundle de la landing.
 */
const DiscountWidget = lazy(() =>
  import("@/components/DiscountWidget").then((m) => ({ default: m.DiscountWidget })),
);
const IntroVideoModal = lazy(() =>
  import("@/components/IntroVideoModal").then((m) => ({ default: m.IntroVideoModal })),
);
const CookieBanner = lazy(() =>
  import("@/components/CookieBanner").then((m) => ({ default: m.CookieBanner })),
);

export const Route = createFileRoute("/")({
  head: () => {
    const lang = readLangCookie();
    const t = DICTIONARIES[lang];
    return {
      meta: [
        { title: t.meta.title },
        { name: "description", content: t.meta.description },
        { property: "og:title", content: t.meta.ogTitle },
        { property: "og:description", content: t.meta.ogDescription },
        { property: "og:type", content: "website" },
      ],
      links: [
        // Las fuentes se cargan una sola vez en __root.tsx (ver comentario ahí).
        // `/` es la versión húngara para crawlers y el x-default.
        ...seoLinks("/", lang),
        // Preload del héroe: es el LCP de la landing, sin esto el navegador
        // recién lo descubre después de hidratar y la página se siente lenta.
        { rel: "preload", as: "image", href: "/azkomoly_new_HERO_2.webp", type: "image/webp" },
      ],
      // El FAQ (y su schema FAQPage) se mudó a /faq — ver faq.tsx.
    };
  },
  component: Landing,
});

export function Landing() {
  // BoxSpinner popup disabled for now — will come back rebuilt on
  // https://headlessui.com/react/dialog. Keep closeBox/boxVisible plumbing
  // removed rather than dead-code so nothing half-fires in the meantime.

  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Sin `min-h-screen`: forzaba el `<main>` a medir al menos una pantalla
  // completa, y si el contenido real era más corto (pasa seguido en
  // celular), el fondo blanco del `<main>` se estiraba de más y quedaba
  // un tramo vacío después del footer morado. El contenido real ya define
  // la altura, no hace falta forzarla.
  return (
    <main className="relative bg-background text-foreground">
      <SiteNav isHome />

      <UrgencyClock />
      <HeroV2 />
      {/* Pedido de George: que se pueda seguir a AZKOMOLY sin buscar. Columna
          pegada al borde izquierdo, fuera del camino del CTA de compra. */}
      <SocialRail />
      <ProductsSection />
      <VelocityBand />
      <LifestyleStrip />
      <FollowUsRow />
      <HowItWorks />
      <BigCTA />
      <ClosingScrollFloat />

      <SiteFooter />

      {/* Reusa el mismo SignupDialog global (`__root.tsx`): el widget es
          sólo el anzuelo, abre el mismo formulario que la navbar. */}
      <Suspense fallback={null}>
        <DiscountWidget />
        <IntroVideoModal />
        <CookieBanner />
      </Suspense>

    </main>
  );
}


// Cuenta 5 minutos reales (por ahora — pendiente definir con Diego qué pasa
// al llegar a 0 y el código de descuento de Shopify para quien compre a
// tiempo). Guardado en sessionStorage para que sea honesto: si el usuario
// refresca, sigue contando desde donde iba, no se reinicia.
const URGENCY_DURATION_SECONDS = 5 * 60;

function getSecondsRemaining(deadline: number) {
  return Math.max(0, Math.round((deadline - Date.now()) / 1000));
}

function UrgencyClock() {
  const t = useT();
  // El deadline lo decide el servidor por IP (ver urgency.functions.ts), no
  // el navegador: así cada IP nueva arranca su propio 5:00 y refrescar o
  // abrir otra pestaña desde la misma IP no lo reinicia gratis.
  const [deadline, setDeadline] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(URGENCY_DURATION_SECONDS);

  useEffect(() => {
    let cancelled = false;
    getUrgencyDeadline().then((res) => {
      if (!cancelled) setDeadline(res.deadline);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (deadline == null) return;
    setRemaining(getSecondsRemaining(deadline));
    const timer = window.setInterval(() => setRemaining(getSecondsRemaining(deadline)), 1000);
    return () => window.clearInterval(timer);
  }, [deadline]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  // Al llegar a cero no tiene sentido mostrar 00:00 parpadeando: se cambia
  // por el aviso de que la oferta terminó (traducido).
  const ended = deadline != null && remaining <= 0;

  return (
    // z-[55], por DEBAJO del panel del menú (z-60). Estaba en z-[65] y se
    // montaba encima, tapando las opciones del menú hamburguesa.
    <section className="sticky top-[65px] z-[55] bg-black text-white shadow-[0_8px_24px_rgba(13,13,13,0.16)]">
      <div className="mx-auto flex min-h-11 max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center font-sans text-[11px] font-semibold uppercase tracking-wide sm:text-xs">
        {ended ? (
          <span className="text-white">{t.urgency.ended}</span>
        ) : (
          <>
            <span className="text-white/78">{t.urgency.prefix}</span>
            <span className="inline-flex items-center gap-1 rounded-sm bg-white px-2 py-1 text-fire">
              <SlidingNumber value={minutes} />
              <span>:</span>
              <SlidingNumber value={seconds} />
            </span>
            <span className="text-white/78">{t.urgency.suffix}</span>
          </>
        )}
      </div>
    </section>
  );
}

/**
 * Banda de marca — TextLoop de React Bits con la cinta ondulada.
 *
 * Vive DENTRO de la sección de productos, no entre secciones: suelta sobre el
 * fondo blanco pasaba desapercibida. Sobre el morado, con la cinta en blanco,
 * es lo primero que ve el ojo al entrar en la sección.
 *
 * El componente dibuja en un viewBox de 1200x520, así que a ancho completo
 * mediría ~665px de alto. Se recorta a una franja: el contenedor limita la
 * altura y el SVG va centrado dentro. La cinta cae justo en el centro vertical
 * del viewBox, así que centrarlo la deja centrada en la franja.
 */
function BrandWave() {
  // El SVG interno tiene un viewBox fijo (1200×520) y escala con
  // `preserveAspectRatio="meet"` según la dimensión más chica del
  // contenedor — en mobile esa dimensión es el alto (`min-h`), que antes
  // era el mismo valor fijo que en desktop. Resultado: en pantallas
  // angostas el factor de escala se desplomaba y "azkomoly.hu" quedaba
  // minúsculo. Ahora mobile tiene su propio alto mínimo Y su propio
  // `fontSize`/`ribbonWidth` (en unidades del viewBox, no px), así el
  // texto renderizado queda grande de verdad en celular, no sólo en desktop.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    setIsMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="relative w-full overflow-hidden h-[14vw] min-h-[170px] sm:min-h-[104px]"
    >
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
        {/* Vuelve el movimiento (Diego lo pidió de nuevo) — mismo patrón/forma
            de antes, con "azkomoly.hu" en vez del nombre suelto. */}
        <TextLoop
          text="azkomoly.hu"
          shape="wave"
          speed={isMobile ? 55 : 90}
          direction="reverse"
          separator="✦"
          curviness={isMobile ? 14 : 18}
          fontSize={isMobile ? 80 : 34}
          fontWeight={800}
          letterSpacing={2}
          uppercase
          color="#5B2EA8"
          ribbon
          ribbonColor="#FFFFFF"
          ribbonWidth={isMobile ? 130 : 56}
          /* No se detiene al pasar el cursor: es una banda decorativa, no algo
             que haya que leer con calma, y frenarla al rozarla parece un fallo. */
          pauseOnHover={false}
          style={{ fontFamily: "'Anton', var(--font-display)" }}
        />
      </div>
    </div>
  );
}

/** Cuántas cajas se muestran antes del botón "ver más". */
const PRODUCTS_PER_PAGE = 6;

function ProductsSection() {
  const t = useT();
  const { lang } = useI18n();
  const railRef = useRef<HTMLDivElement | null>(null);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [railState, setRailState] = useState({ canPrev: false, canNext: false });
  const visible = showAll ? products : products.slice(0, PRODUCTS_PER_PAGE);

  const updateRailState = () => {
    const el = railRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setRailState({
      canPrev: el.scrollLeft > 4,
      canNext: el.scrollLeft < max - 4,
    });
  };

  const scrollProducts = (direction: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * Math.max(280, el.clientWidth * 0.82), behavior: "smooth" });
  };

  useEffect(() => {
    setLoading(true);
    fetchProducts(20, undefined, lang).then((prods) => {
      setProducts(prods);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [lang]);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    updateRailState();
    el.addEventListener("scroll", updateRailState, { passive: true });
    window.addEventListener("resize", updateRailState);
    return () => {
      el.removeEventListener("scroll", updateRailState);
      window.removeEventListener("resize", updateRailState);
    };
  }, [loading, visible.length]);

  return (
    <>
      {/* Corte recto contra el hero, sin onda. El pt grande no es aire de
          adorno: es el hueco por donde baja la caja del hero, que cae sobre
          esta seccion por la izquierda. */}
      <section id="termekek" className="relative z-0 bg-fire">
        {/* Sticker de marca, arriba a la derecha: ocupa el hueco que quedaba
            justo debajo del CTA del hero, en el cuadrante que pidió Diego.
            z-10 = primera capa sobre el morado; se sale un poco por arriba
            (`-top`) para que pise el borde entre hero y esta sección, que es
            lo que le da el efecto de pegatina superpuesta. Visible también en
            mobile (antes `hidden lg:block`) — ahí queda pegado al borde
            derecho y se corta parcialmente a propósito, pedido de Diego. */}
        <img
          src="/decor/products-sticker.webp"
          alt=""
          aria-hidden="true"
          width={1378}
          height={1811}
          loading="lazy"
          draggable={false}
          /* Dentro de la sección morada, no a caballo entre las dos: la sección
             va en `z-0` y el hero en `z-10`, así que cualquier parte que se
             saliera por arriba quedaba tapada por el hero y se veía cortada,
             por mucho z-index que se le pusiera al sticker. Aquí abajo se ve
             entero y cubre el hueco que quedaba bajo el CTA. */
          className="pointer-events-none absolute right-0 top-[2vw] sm:right-[6vw] lg:right-[10vw] z-10 w-[42vw] sm:w-[30vw] max-w-[360px] -rotate-6 drop-shadow-[0_18px_30px_rgba(13,13,13,0.28)]"
        />
      {/* El colchón sólo hace falta en escritorio, que es donde la caja del
          hero desborda sobre esta sección. Por debajo de lg el hero apila sin
          solapes, así que un pt enorme dejaría un agujero morado vacío. */}
      <div className="mx-auto max-w-7xl px-6 pt-16 lg:pt-[9vw]">
        <div data-reveal className="mb-10">
          <p className="font-sans text-xs tracking-[0.35em] text-white/70 mb-3">
            {t.products.kicker}
          </p>
          <h2
            className="text-white leading-[0.85] tracking-[-0.02em] text-[clamp(2.6rem,7vw,5.5rem)]"
            style={{ fontFamily: "'Anton', var(--font-display)" }}
          >
            {t.products.heading}
          </h2>
        </div>
      </div>

      {/* La cinta va FUERA del contenedor centrado: dentro de `max-w-7xl` se
          quedaba en 1280px y por eso se veía cortada, sin llegar a los bordes
          de la pantalla. */}
      <BrandWave />

      <div className="mx-auto max-w-7xl px-6 pt-10 pb-20">
        {loading ? (
          <div className="flex flex-col gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="aspect-[4/3] sm:aspect-[21/9] bg-dark-bg/60 border-2 border-cardboard/20 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="font-sans text-white/60 text-center py-10">
            {t.products.empty}
          </p>
        ) : (
          /* Móvil: carril horizontal con scroll-snap. Cada caja ocupa casi
             toda la pantalla y el pulgar la engancha de una en una, en vez de
             obligar a recorrer una lista larga hacia abajo. Es el gesto que la
             gente ya trae aprendido de Instagram y TikTok.
             Desktop: rejilla, donde sí conviene comparar varias a la vez. */
          <div className="relative">
            <button
              type="button"
              onClick={() => scrollProducts(-1)}
              disabled={!railState.canPrev}
              aria-label={t.products.previous}
              className="sm:hidden absolute left-1 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border-2 border-black bg-white text-fire shadow-[0_8px_0_#0D0D0D,0_16px_24px_rgba(13,13,13,0.22)] transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70 active:scale-95 active:shadow-[0_3px_0_#0D0D0D] disabled:pointer-events-none disabled:opacity-35"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={() => scrollProducts(1)}
              disabled={!railState.canNext}
              aria-label={t.products.next}
              className="sm:hidden absolute right-1 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border-2 border-black bg-white text-fire shadow-[0_8px_0_#0D0D0D,0_16px_24px_rgba(13,13,13,0.22)] transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70 active:scale-95 active:shadow-[0_3px_0_#0D0D0D] disabled:pointer-events-none disabled:opacity-35"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <div
              ref={railRef}
              className="
                flex snap-x snap-mandatory gap-5 overflow-x-auto scrollbar-none
                -mx-6 px-6 pb-2
                sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 sm:overflow-visible sm:px-0
                lg:grid-cols-3
              "
              style={{ scrollPaddingInline: "1.5rem" }}
            >
              {visible.map((p) => (
                <div
                  key={p.node.id}
                  className="w-[82vw] max-w-[340px] shrink-0 snap-center sm:w-auto sm:max-w-none sm:shrink"
                >
                  <ProductTiltCard p={p} />
                </div>
              ))}
              </div>
          </div>
        )}

        {/* "Ver más" sólo aparece si de verdad hay más que ver. Con 20 productos
            la sección se volvería un muro; con 4 no tiene sentido el botón. */}
        {!loading && products.length > PRODUCTS_PER_PAGE && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setShowAll((v) => !v)}
              className="btn-3d bg-white px-8 py-3 font-sans text-sm font-bold uppercase tracking-wide text-fire"
            >
              {showAll ? t.products.showLess : `${t.products.showMore} (${products.length - PRODUCTS_PER_PAGE})`}
            </button>
          </div>
        )}
      </div>
      </section>
    </>
  );
}


function VelocityBand() {
  const t = useT();
  // Antes eran dos líneas en sentidos opuestos; Diego pidió dejar sólo la
  // morada con texto blanco, más lenta que antes (-5 → -3).
  return (
    <section className="overflow-hidden border-y-2 border-black bg-fire py-3">
      <ScrollVelocity
        text={t.velocity.textSecondary}
        baseVelocity={-3}
        className="font-display text-xl uppercase text-white sm:text-3xl"
      />
    </section>
  );
}

function LifestyleStrip() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const pausedRef = useRef(false);
  const all = [...SOCIAL_REVIEWS, ...SOCIAL_REVIEWS];

  // Auto-scroll that yields to user interaction.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let raf = 0;
    let last = performance.now();
    const SPEED = 65; // px/sec

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!pausedRef.current && el.scrollWidth > el.clientWidth) {
        const half = el.scrollWidth / 2;
        let next = el.scrollLeft + SPEED * dt;
        if (next >= half) next -= half;
        el.scrollLeft = next;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Loop infinito para CUALQUIER scroll (auto, arrastre o flechas): si se
    // pasa de la mitad (donde el set duplicado vuelve a empezar) o se va
    // negativo, lo reacomoda sin transición — nunca hay principio ni fin.
    const onScroll = () => {
      const half = el.scrollWidth / 2;
      if (half <= 0) return;
      if (el.scrollLeft >= half) el.scrollLeft -= half;
      else if (el.scrollLeft < 0) el.scrollLeft += half;
    };
    el.addEventListener("scroll", onScroll, { passive: true });

    const pause = () => { pausedRef.current = true; };
    const resumeSoon = () => {
      window.clearTimeout((el as any).__resumeT);
      (el as any).__resumeT = window.setTimeout(() => { pausedRef.current = false; }, 1800);
    };

    el.addEventListener("pointerdown", pause);
    el.addEventListener("pointerup", resumeSoon);
    el.addEventListener("pointercancel", resumeSoon);
    el.addEventListener("pointerleave", resumeSoon);
    el.addEventListener("wheel", () => { pause(); resumeSoon(); }, { passive: true });
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", resumeSoon);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("pointerdown", pause);
      el.removeEventListener("pointerup", resumeSoon);
      el.removeEventListener("pointercancel", resumeSoon);
      el.removeEventListener("pointerleave", resumeSoon);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", resumeSoon);
    };
  }, []);

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    pausedRef.current = true;
    el.scrollBy({ left: dir * 204, behavior: "smooth" });
    window.clearTimeout((el as any).__resumeT);
    (el as any).__resumeT = window.setTimeout(() => { pausedRef.current = false; }, 1800);
  };

  // Drag-to-scroll for mouse users.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let down = false;
    let startX = 0;
    let startLeft = 0;
    let moved = 0;

    const onDown = (e: PointerEvent) => {
      down = true;
      moved = 0;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      el.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      el.scrollLeft = startLeft - dx;
    };
    const onUp = (e: PointerEvent) => {
      down = false;
      el.releasePointerCapture?.(e.pointerId);
      (el as any).__lastDragDist = moved;
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    const dragged = (scrollerRef.current as any)?.__lastDragDist ?? 0;
    if (dragged > 6) e.preventDefault(); // suppress click after drag
  };

  return (
    // `#velemenyek`: el link "Vélemények / Reviews" del navbar apunta acá —
    // los unboxings reales viven en la home, no en About.
    <section id="velemenyek" className="relative scroll-mt-28 py-6 overflow-hidden border-y border-cardboard/20 bg-dark-bg/60">
      <button
        type="button"
        onClick={() => scrollByCard(-1)}
        aria-label="Előző"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 grid place-items-center h-10 w-10 rounded-full bg-fire text-white shadow-lg hover:-translate-x-0.5 hover:top-1/2 transition-transform"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => scrollByCard(1)}
        aria-label="Következő"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 grid place-items-center h-10 w-10 rounded-full bg-fire text-white shadow-lg hover:translate-x-0.5 hover:top-1/2 transition-transform"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      <div
        ref={scrollerRef}
        className="flex gap-3 overflow-x-auto scrollbar-none cursor-grab active:cursor-grabbing select-none"
        style={{ scrollbarWidth: "none", touchAction: "pan-x" }}
      >
        {all.map(({ src, href, platform }, i) => (
          <a
            key={i}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className="group relative shrink-0 h-64 w-48 overflow-hidden border border-cardboard/25 hover:border-fire/60 transition-colors duration-300"
            style={{ aspectRatio: "3/4" }}
            aria-label={platform === "tiktok" ? "Ver en TikTok" : "Ver en Instagram"}
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
              draggable={false}
              loading="lazy"
              decoding="async"
            />
            <span className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none" />
            <span
              className={`absolute top-2 right-2 grid place-items-center h-8 w-8 rounded-full shadow-lg pointer-events-none ${
                platform === "tiktok" ? "bg-black" : "bg-gradient-to-tr from-fire via-pink-500 to-purple-600"
              }`}
            >
              <SocialGlyph
                path={SOCIAL_LINKS.find((s) => s.key === platform)!.path}
                className="h-4 w-4 text-white"
              />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

function FollowUsRow() {
  const t = useT();
  const reduceMotion = useReducedMotion();
  return (
    // Envoltorio sin fondo propio: la garra vive DETRÁS de la franja morada
    // (`z-0`, arranca en `top-8`) y la franja (`z-10`, sí con `bg-fire`) le
    // tapa la vara — sólo asoma la mano+caja por abajo, sobre "How it works".
    // Eso da la sensación de capas/3D que pidió Diego: la garra "viene
    // saliendo" de detrás de la sección morada, no está pegada encima.
    // `top-8` (en vez de `top-0`) baja toda la imagen un poco más, así la
    // caja cuelga más adentro de la sección blanca.
    <div className="relative">
      <motion.img
        src="/decor/claw-decor.webp"
        alt=""
        aria-hidden="true"
        width={1434}
        height={1672}
        loading="lazy"
        draggable={false}
        className="pointer-events-none absolute right-[4%] sm:right-[10%] top-8 sm:top-10 z-0 w-[150px] sm:w-[220px] drop-shadow-[0_20px_28px_rgba(13,13,13,0.35)]"
        animate={reduceMotion ? undefined : { rotate: [-3, 3, -3] }}
        transition={reduceMotion ? undefined : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "top center" }}
      />
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 bg-fire px-4 py-6">
        <span className="mr-2 hidden font-sans text-xs font-bold uppercase tracking-[0.3em] text-white/78 sm:inline">
          {t.footer.follow}
        </span>
        {SOCIAL_LINKS.map((s) => (
          <a
            key={s.key}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className="group grid h-11 w-11 place-items-center overflow-hidden rounded-full border-2 border-white/45 bg-white/10 text-white transition-all hover:w-32 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-fire focus-visible:w-32 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
          >
            <span className="flex items-center gap-2 whitespace-nowrap px-3">
              <SocialGlyph path={s.path} className="h-5 w-5 shrink-0" />
              <span className="max-w-0 overflow-hidden font-sans text-xs font-bold uppercase opacity-0 transition-all group-hover:max-w-24 group-hover:opacity-100 group-focus-visible:max-w-24 group-focus-visible:opacity-100">
                {s.label}
              </span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

/**
 * Un mascota 3D por paso, en vez del video: el video quedaba encajonado en un
 * marco con borde/sombra dura que competía con el fondo blanco del sitio
 * ("no pertenece a la página" — feedback de Diego). Estas 4 imágenes son PNG
 * con transparencia real (verificado: alpha 0 en las esquinas), así que se
 * paran directo sobre `bg-dark-bg` sin ningún marco — se leen como parte del
 * diseño, no como un recorte de video pegado encima.
 */
const HOW_STEP_IMAGES = [
  "/how-it-works/step-1.webp", // bodega
  "/how-it-works/step-2.webp", // carga en la van
  "/how-it-works/step-3.webp", // en camino
  "/how-it-works/step-5.webp", // abre la caja
];

/**
 * Vuelve el video, pero esta vez sin el marco de borde+sombra dura que hacía
 * que se sintiera "pegado encima" del resto de la página — acá va sin borde,
 * mismo `bg-background` que el resto de la sección, así se lee como parte del
 * diseño y no como un recorte de video ajeno.
 */
function HowItWorksVideo() {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || reduceMotion) return;
    if (inView) el.play().catch(() => {});
    else el.pause();
  }, [inView, reduceMotion]);

  return (
    <div className="relative mx-auto max-w-4xl w-full aspect-video rounded-2xl overflow-hidden bg-background">
      <video
        ref={videoRef}
        src="/how-it-works/proceso.mp4"
        poster="/how-it-works/proceso-azkomoly.webp"
        muted
        loop
        playsInline
        preload="none"
        className="w-full h-full object-contain"
      />
    </div>
  );
}

function HowItWorks() {
  const t = useT();
  const reduceMotion = useReducedMotion();
  const steps = t.how.steps;
  return (
    <section id="hogyan" className="bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        <div data-reveal className="text-center mb-8">
          <p className="font-sans text-xs tracking-[0.4em] text-fire mb-3">
            {t.how.kicker}
          </p>
          <h2 className="font-display text-4xl sm:text-6xl text-fire">
            {t.how.heading}
          </h2>
        </div>

        <div data-reveal className="mb-8">
          <HowItWorksVideo />
        </div>

        {/* Mobile: columna vertical con línea que conecta los pasos —
            pedido explícito de Diego ("los pasos deben ser verticales con
            una buena animación"). Desde `sm` vuelve a la grilla horizontal. */}
        <motion.div
          className="flex flex-col gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-4 max-w-5xl mx-auto"
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "show"}
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.15 } },
          }}
        >
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              className="relative flex flex-col items-center text-center gap-2"
              variants={{
                hidden: { opacity: 0, y: 28 },
                show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
              }}
            >
              {i < steps.length - 1 && (
                /* Línea morada que une los pasos en mobile: se "dibuja"
                   sola al entrar en pantalla (scaleY desde arriba) y lleva
                   un punto que baja en loop, para que el recorrido se lea
                   como un flujo y no como 4 tarjetas sueltas. */
                <motion.span
                  aria-hidden="true"
                  className="sm:hidden absolute left-1/2 top-full h-8 w-[3px] -translate-x-1/2 origin-top overflow-hidden rounded-full bg-gradient-to-b from-fire to-fire/20"
                  initial={reduceMotion ? false : { scaleY: 0, opacity: 0 }}
                  whileInView={reduceMotion ? undefined : { scaleY: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <motion.span
                    className="absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-fire"
                    animate={reduceMotion ? undefined : { top: ["-8px", "48px"], opacity: [0, 1, 0] }}
                    transition={
                      reduceMotion
                        ? undefined
                        : { duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.25 }
                    }
                  />
                </motion.span>
              )}
              <motion.div
                className="aspect-square w-full max-w-[420px] sm:max-w-[320px] grid place-items-center"

                variants={{
                  hidden: { opacity: 0, scale: 0.7 },
                  show: {
                    opacity: 1,
                    scale: 1,
                    transition: { type: "spring", stiffness: 160, damping: 14, delay: 0.1 },
                  },
                }}
              >
                {/* Flotación suave e infinita, aparte de la entrada — pedido
                    de Diego ("con alguna animación"). Desfasada por índice
                    para que no floten los 4 exactamente igual. */}
                <motion.img
                  src={HOW_STEP_IMAGES[i]}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="max-h-full max-w-full object-contain"
                  animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
                  transition={
                    reduceMotion
                      ? undefined
                      : { duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }
                  }
                />
              </motion.div>
              <span className="font-display text-sm text-fire">{s.n}</span>
              <span className="font-display text-lg sm:text-base text-foreground uppercase tracking-wide max-w-[16ch]">
                {s.title}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function BigCTA() {
  const t = useT();
  const setSignupOpen = useSignupDialogStore((s) => s.setOpen);
  const lines = t.bigCta.heading.split("\n");
  const sectionRef = useRef<HTMLElement | null>(null);
  const [spot, setSpot] = useState({ x: 50, y: 50, active: false });
  const touchedRef = useRef(false);
  const SPOT_RADIUS = 140; // px

  function onMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    setSpot({ x: e.clientX - rect.left, y: e.clientY - rect.top, active: true });
  }

  function onTouchMove(e: React.TouchEvent<HTMLElement>) {
    const rect = sectionRef.current?.getBoundingClientRect();
    const touch = e.touches[0];
    if (!rect || !touch) return;
    touchedRef.current = true;
    setSpot({ x: touch.clientX - rect.left, y: touch.clientY - rect.top, active: true });
  }

  // Sin esto, en touch (sin mousemove) la sección quedaba una foto estática
  // de cajas cerradas — "no se anima" era literal en móvil/tablet. Al entrar
  // en pantalla en un dispositivo sin hover hace un barrido automático una
  // sola vez para mostrar el efecto; si el usuario ya la tocó con el dedo, el
  // barrido no pisa su control manual.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (!window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || touchedRef.current) return;
        touchedRef.current = true;
        io.disconnect();

        const rect = section.getBoundingClientRect();
        const duration = 1600;
        const start = performance.now();

        function step(now: number) {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - (1 - progress) * (1 - progress);
          setSpot({ x: rect.width * (0.18 + eased * 0.64), y: rect.height * 0.42, active: true });
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            window.setTimeout(() => setSpot((s) => ({ ...s, active: false })), 500);
          }
        }
        requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMouseMove}
      onMouseLeave={() => setSpot((s) => ({ ...s, active: false }))}
      onTouchMove={onTouchMove}
      onTouchEnd={() => setSpot((s) => ({ ...s, active: false }))}
      className="relative overflow-hidden"
    >
      {/* Fondo de abajo: lo que hay adentro de las cajas — solo se ve por el
          agujero circular que sigue al cursor */}
      <img
        src="/boxes inside.webp"
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />
      {/* Fondo de arriba: pared de cajas cerradas, con un agujero recortado
          en el cursor (radial mask) que deja ver la capa de abajo */}
      <img
        src="/boxes.webp"
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
        style={{
          WebkitMaskImage: spot.active
            ? `radial-gradient(circle ${SPOT_RADIUS}px at ${spot.x}px ${spot.y}px, transparent 0, transparent ${SPOT_RADIUS - 40}px, black ${SPOT_RADIUS}px)`
            : undefined,
          maskImage: spot.active
            ? `radial-gradient(circle ${SPOT_RADIUS}px at ${spot.x}px ${spot.y}px, transparent 0, transparent ${SPOT_RADIUS - 40}px, black ${SPOT_RADIUS}px)`
            : undefined,
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6 py-20 text-center">
        <img
          src="/azkomoly_new_logo_negativo.webp"
          alt="AZKOMOLY"
          loading="lazy"
          decoding="async"
          className="h-12 sm:h-14 w-auto mx-auto mb-6 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
        />
        <p className="font-display text-primary-foreground text-base sm:text-lg tracking-[0.4em] mb-4 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]">
          {t.bigCta.kicker}
        </p>
        {/* `clamp()` en vez de saltos fijos por breakpoint: en 320px el heading
            de dos líneas se apretaba contra el padding lateral. */}
        <h2 className="font-display text-[clamp(2.25rem,10vw,6rem)] text-primary-foreground text-stroke-black leading-[0.9]">
          {lines.map((line, i) => (
            <span key={i}>
              {line}
              {i < lines.length - 1 && <br />}
            </span>
          ))}
        </h2>

        {/* Hint del efecto de linterna — sólo en dispositivos con hover real
            (mouse/trackpad). Antes se ocultaba/mostraba por ancho de pantalla
            (`sm:`), así que en tablet (touch) decía "mueve el cursor" sobre
            algo que no responde al cursor porque no hay cursor. En touch el
            barrido automático hace de pista. */}
        <div
          className="hidden items-center gap-2 mt-6 px-4 py-2 rounded-full bg-black/35 backdrop-blur-sm [@media(hover:hover)]:inline-flex"
          style={{ fontFamily: "'ADLaM Display', var(--font-sans)" }}
        >
          <MousePointer2 className="h-4 w-4 text-white animate-bounce-down" style={{ animationDuration: "1.4s" }} />
          <span className="text-white text-sm tracking-wide">{t.bigCta.hoverHint}</span>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="#termekek"
            className="inline-block bg-dark-bg text-fire font-display text-xl sm:text-2xl px-10 py-5 rounded-2xl border-4 border-dark-bg hover:bg-foreground hover:text-dark-bg transition-colors"
          >
            {t.bigCta.showBoxes}
          </a>
          <button
            onClick={() => setSignupOpen(true)}
            className="btn-3d bg-fire px-10 py-5 font-display text-xl text-primary-foreground sm:text-2xl"
          >
            {t.bigCta.notify}
          </button>
        </div>
      </div>
    </section>
  );
}

function ClosingScrollFloat() {
  const t = useT();
  return (
    <section className="overflow-hidden bg-white px-4 py-8 text-center sm:py-12">
      <ScrollFloat
        text={t.closingFloat.text}
        className="mx-auto max-w-3xl font-display text-[clamp(1.6rem,6vw,3.75rem)] leading-[0.95] text-fire"
      />
    </section>
  );
}

