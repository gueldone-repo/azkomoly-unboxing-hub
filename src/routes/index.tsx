import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { appendLeadToSheet } from "@/lib/leads.functions";
import { ShieldCheck, Truck, Sparkles, Menu, X, MousePointer2, ChevronLeft, ChevronRight } from "lucide-react";
import { CookieBanner } from "@/components/CookieBanner";
import { IntroVideoModal } from "@/components/IntroVideoModal";

import { HeroV2 } from "@/components/HeroV2";
import { DiscountWidget } from "@/components/DiscountWidget";
import TextLoop from "@/components/TextLoop";
import PillNav from "@/components/nav/PillNav";
import StaggeredMenu from "@/components/nav/StaggeredMenu";
import { SOCIAL_LINKS, SocialGlyph, SocialRow, SocialRail } from "@/components/social/SocialLogos";
import { ProductTiltCard } from "@/components/shop/ProductTiltCard";
import { SocialProof } from "@/components/shop/SocialProof";
import { LanguageToggle } from "@/components/LanguageToggle";
import { CartButton } from "@/components/cart/CartSheet";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify/client";
import { useT, useI18n, readLangCookie } from "@/lib/i18n";
import { DICTIONARIES } from "@/lib/i18n/dictionary";
import { seoLinks, jsonLd, faqSchema } from "@/lib/seo";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Anton&family=Archivo+Black&family=Danfo&family=Nosifer&family=ADLaM+Display&family=Poppins:wght@400;500;700;800&display=swap",
        },
        // `/` es la versión húngara para crawlers y el x-default.
        ...seoLinks("/", lang),
      ],
      // El FAQ ya existe en el diccionario (7 pares Q/A en hu y en). Exponerlo
      // como FAQPage es la pieza de mayor impacto para que los motores
      // generativos citen respuestas de AZKOMOLY textualmente.
      scripts: [jsonLd(faqSchema(t.faq.items, lang))],
    };
  },
  component: Landing,
});

const COUNTRY_CODES: { code: string; label: string; flag: string }[] = [
  { code: "+36", label: "Magyarország", flag: "🇭🇺" },
  { code: "+52", label: "México", flag: "🇲🇽" },
  { code: "+1", label: "USA / Canada", flag: "🇺🇸" },
  { code: "+34", label: "España", flag: "🇪🇸" },
  { code: "+44", label: "United Kingdom", flag: "🇬🇧" },
  { code: "+49", label: "Deutschland", flag: "🇩🇪" },
  { code: "+33", label: "France", flag: "🇫🇷" },
  { code: "+39", label: "Italia", flag: "🇮🇹" },
  { code: "+43", label: "Österreich", flag: "🇦🇹" },
  { code: "+40", label: "România", flag: "🇷🇴" },
  { code: "+421", label: "Slovensko", flag: "🇸🇰" },
  { code: "+420", label: "Česko", flag: "🇨🇿" },
  { code: "+48", label: "Polska", flag: "🇵🇱" },
  { code: "+385", label: "Hrvatska", flag: "🇭🇷" },
  { code: "+31", label: "Nederland", flag: "🇳🇱" },
  { code: "+32", label: "België", flag: "🇧🇪" },
  { code: "+41", label: "Schweiz", flag: "🇨🇭" },
];

const signupSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  phone: z
    .string()
    .trim()
    .max(32)
    .regex(/^[0-9 ()\-]*$/)
    .optional()
    .or(z.literal("")),
});

export function Landing() {
  const [open, setOpen] = useState(false);
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

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <TopNav onCta={() => setOpen(true)} />

      <HeroV2 />
      {/* Pedido de George: que se pueda seguir a AZKOMOLY sin buscar. Columna
          pegada al borde izquierdo, fuera del camino del CTA de compra. */}
      <SocialRail />
      <ProductsSection />
      <LifestyleStrip />
      <FollowUsRow />
      <SocialProof />
      <HowItWorks />
      <BigCTA onCta={() => setOpen(true)} />
      <FAQSection />

      <Footer />

      <SignupDialog open={open} onOpenChange={setOpen} />
      {/* Reusa el mismo SignupDialog de arriba: el widget es sólo el anzuelo. */}
      <DiscountWidget onOpen={() => setOpen(true)} />
      <IntroVideoModal />
      <CookieBanner />

    </main>
  );
}


function TopNav({ onCta }: { onCta: () => void }) {
  const t = useT();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  // About y GYIK apuntan por fin a sus páginas reales (`/about`, `/faq`), que
  // Lovable generó y hasta ahora no estaban enlazadas desde ningún sitio: se
  // llegaba sólo escribiendo la URL a mano.
  const navLinks = [
    { href: "#termekek", label: t.nav.shop },
    { href: "#hogyan", label: t.nav.how },
    { href: "/about", label: t.nav.about },
    { href: "/faq", label: t.nav.faq },
    { href: "#kapcsolat", label: t.nav.contact },
  ];

  return (
    <>
      {/* z-[70]: por encima del panel del menú (z-60), para que el botón de
          cerrar y el carrito sigan alcanzables con el menú abierto. */}
      {/* Barra blanca, como en la referencia. Antes era una franja morada
          maciza que, con el hero también morado de título, cargaba el doble de
          morado del necesario. En blanco el logo respira y el morado queda
          reservado para lo que importa: los CTA.
          z-[70]: por encima del panel del menú (z-60), para que el botón de
          cerrar y el carrito sigan alcanzables con el menú abierto. */}
      <nav className="fixed top-0 inset-x-0 z-[70] flex flex-col">
        <div className="w-full bg-white/90 backdrop-blur-md border-b border-black/[0.07]">
        <div className="mx-auto w-full max-w-7xl px-6 py-3 flex items-center justify-between gap-4">
          <a href="#top" className="logo-link shrink-0">
            <img
              src="/azkomoly_new_logo.png"
              alt="AZKOMOLY"
              className="logo-mark h-10 w-auto"
            />
          </a>
          {/* Desktop: PillNav sin carril de fondo. En reposo los links son
              texto negro sobre la barra; al pasar el cursor sube el círculo
              morado y el texto pasa a blanco. */}
          <div className="hidden md:block">
            <PillNav
              items={navLinks.map((l) => ({ label: l.label, href: l.href }))}
              baseColor="#5B2EA8"
              trackColor="transparent"
              pillColor="transparent"
              pillTextColor="#0D0D0D"
              hoveredPillTextColor="#FFFFFF"
            />
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <LanguageToggle className="hidden sm:inline-flex" />
            <SocialRow className="hidden lg:flex !gap-3" iconClassName="h-[18px] w-[18px]" />
            <CartButton />
            <button
              onClick={onCta}
              className="hidden sm:inline-block bg-fire text-white font-sans font-semibold text-xs tracking-wide px-5 py-2.5 rounded-full hover:-translate-y-[2px] transition-transform"
            >
              {t.nav.notify}
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Bezárás" : "Menü"}
              aria-expanded={menuOpen}
              aria-controls="staggered-menu-panel"
              className="md:hidden grid place-items-center h-9 w-9 text-foreground"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        </div>
      </nav>

      {/* Menú móvil — StaggeredMenu: las capas de color entran escalonadas
          (lavanda y morado de marca) y detrás llega el panel con los items.
          Va controlado: el botón vive arriba, en el navbar. */}
      <StaggeredMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={navLinks.map((l) => ({ label: l.label, link: l.href, ariaLabel: l.label }))}
        socialItems={SOCIAL_LINKS.map((s) => ({ label: s.label, link: s.href }))}
        socialsTitle={t.footer.follow}
        position="right"
        colors={["#8F78B5", "#5B2EA8"]}
        accentColor="#5B2EA8"
      />
    </>
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
  return (
    // Sin `max-h`: ese tope fijo era justo lo que cortaba las crestas. El SVG
    // escala con el ancho de la pantalla, así que en monitores grandes la cinta
    // crecía más que su caja y se comía los bordes de arriba y abajo. Con la
    // altura atada al ancho (y un mínimo para el móvil), la proporción se
    // mantiene y nunca recorta.
    <div aria-hidden="true" className="relative w-full overflow-hidden h-[14vw] min-h-[104px]">
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
        <TextLoop
          text="Azkomoly"
          shape="wave"
          speed={90}
          direction="reverse"
          separator="✦"
          /* Onda más baja y cinta más fina: juntas ocupan ~26% del alto del
             SVG, así entra holgada en la franja en cualquier ancho. */
          curviness={18}
          fontSize={34}
          fontWeight={800}
          letterSpacing={2}
          uppercase
          color="#5B2EA8"
          ribbon
          ribbonColor="#FFFFFF"
          ribbonWidth={56}
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
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? products : products.slice(0, PRODUCTS_PER_PAGE);

  useEffect(() => {
    setLoading(true);
    fetchProducts(20, undefined, lang).then((prods) => {
      setProducts(prods);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [lang]);

  return (
    <>
      {/* Corte recto contra el hero, sin onda. El pt grande no es aire de
          adorno: es el hueco por donde baja la caja del hero, que cae sobre
          esta seccion por la izquierda. */}
      <section id="termekek" className="relative z-0 bg-fire">
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
          <div
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
        )}

        {/* "Ver más" sólo aparece si de verdad hay más que ver. Con 20 productos
            la sección se volvería un muro; con 4 no tiene sentido el botón. */}
        {!loading && products.length > PRODUCTS_PER_PAGE && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setShowAll((v) => !v)}
              className="rounded-full border-2 border-white/70 px-8 py-3 font-sans text-sm font-bold uppercase tracking-wide text-white transition-all hover:-translate-y-0.5 hover:bg-white hover:text-fire"
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


const SOCIAL_REVIEWS: { src: string; href: string; platform: "instagram" | "tiktok" }[] = [
  { src: "/review1.png", href: "https://www.instagram.com/reel/DbOVwukMheu/?utm_source=ig_web_button_share_sheet&igsh=MzRlODBiNWFlZA==", platform: "instagram" },
  { src: "/review2.png", href: "https://www.instagram.com/reel/DbAyYwQO_z9/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==", platform: "instagram" },
  { src: "/review3.png", href: "https://www.instagram.com/reel/DanS3tFsao4/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==", platform: "instagram" },
  { src: "/review4.png", href: "https://www.instagram.com/reel/DaLM-yzsLz_/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==", platform: "instagram" },
  { src: "/review5.png", href: "https://www.instagram.com/reel/DaFsFjgKlCR/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==", platform: "instagram" },
  { src: "/review6.png", href: "https://www.tiktok.com/@azkomoly.hu/video/7670098419981110550?is_from_webapp=1&sender_device=pc&web_id=7644208246575662593", platform: "tiktok" },
];

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
    <section className="relative py-6 overflow-hidden border-y border-cardboard/20 bg-dark-bg/60">
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
  return (
    <div className="flex items-center justify-center gap-6 py-6 bg-dark-bg/60 border-b border-cardboard/20">
      <span className="font-sans text-xs tracking-[0.3em] text-foreground/50 hidden sm:inline">
        {t.footer.follow}
      </span>
      {SOCIAL_LINKS.map((s) => (
        <a
          key={s.key}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          className="h-11 w-11 grid place-items-center rounded-full border-2 border-black/10 bg-white hover:-translate-y-0.5 hover:border-black/20 hover:shadow-[0_6px_16px_rgba(13,13,13,0.12)] transition-all"
          style={{ color: s.brand }}
        >
          <SocialGlyph path={s.path} className="h-5 w-5" />
        </a>
      ))}
    </div>
  );
}

function ValueProps() {
  const t = useT();
  const icons = [ShieldCheck, Sparkles, Truck];
  return (
    <section className="bg-dark-bg border-y border-cardboard/20 py-16">
      <div className="mx-auto max-w-4xl px-6 grid sm:grid-cols-3 gap-px bg-cardboard/20">
        {t.values.items.map((item, i) => {
          const Icon = icons[i];
          return (
            <div
              key={item.title}
              data-reveal
              data-delay={String(i + 1)}
              className="flex flex-col items-center text-center p-8 bg-dark-bg group hover:bg-fire/5 transition-colors duration-300"
            >
              <span className="grid place-items-center h-14 w-14 border-2 border-fire/50 text-fire mb-5 group-hover:border-fire group-hover:bg-fire/10 transition-all duration-300">
                <Icon className="h-7 w-7" />
              </span>
              <h3 className="font-display text-xl text-foreground tracking-wider mb-2">{item.title}</h3>
              <p className="font-sans text-sm text-foreground/60 leading-relaxed">{item.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function HowItWorks() {
  const t = useT();
  return (
    <section id="hogyan" className="bg-background">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div data-reveal className="text-center mb-14">
          <p className="font-sans text-xs tracking-[0.4em] text-fire mb-3">
            {t.how.kicker}
          </p>
          <h2 className="font-display text-4xl sm:text-6xl text-fire">
            {t.how.heading}
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {t.how.steps.map((s, i) => (
            <div
              key={s.n}
              data-reveal
              data-delay={String(i + 1)}
              className="relative bg-dark-bg border border-cardboard/30 p-7 overflow-hidden group hover:border-fire/70 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Watermark number */}
              <span className="absolute -bottom-4 -right-2 font-display leading-none text-fire/25 select-none pointer-events-none"
                style={{ fontSize: "8.5rem" }}>
                {s.n}
              </span>
              <span className="font-sans text-[10px] tracking-[0.4em] text-fire block mb-4">
                {s.n}
              </span>
              <h3 className="font-display text-2xl text-foreground mb-2">{s.title}</h3>
              <p className="font-sans text-sm text-foreground/60 leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BigCTA({ onCta }: { onCta: () => void }) {
  const t = useT();
  const lines = t.bigCta.heading.split("\n");
  const sectionRef = useRef<HTMLElement | null>(null);
  const [spot, setSpot] = useState({ x: 50, y: 50, active: false });
  const SPOT_RADIUS = 140; // px

  function onMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    setSpot({ x: e.clientX - rect.left, y: e.clientY - rect.top, active: true });
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMouseMove}
      onMouseLeave={() => setSpot((s) => ({ ...s, active: false }))}
      className="relative overflow-hidden"
    >
      {/* Fondo de abajo: lo que hay adentro de las cajas — solo se ve por el
          agujero circular que sigue al cursor */}
      <img
        src="/boxes inside.jpeg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />
      {/* Fondo de arriba: pared de cajas cerradas, con un agujero recortado
          en el cursor (radial mask) que deja ver la capa de abajo */}
      <img
        src="/boxes.jpeg"
        alt=""
        aria-hidden="true"
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
          src="/azkomoly_new_logo_negativo.png"
          alt="AZKOMOLY"
          className="h-12 sm:h-14 w-auto mx-auto mb-6 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
        />
        <p className="font-display text-primary-foreground text-base sm:text-lg tracking-[0.4em] mb-4 [text-shadow:0_2px_6px_rgba(0,0,0,0.6)]">
          {t.bigCta.kicker}
        </p>
        <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl text-primary-foreground text-stroke-black leading-[0.9]">
          {lines.map((line, i) => (
            <span key={i}>
              {line}
              {i < lines.length - 1 && <br />}
            </span>
          ))}
        </h2>

        {/* Hint del efecto de linterna — solo desktop, el hover no aplica en touch */}
        <div
          className="hidden sm:inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-full bg-black/35 backdrop-blur-sm"
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
            onClick={onCta}
            className="inline-block bg-transparent text-primary-foreground font-display text-xl sm:text-2xl px-10 py-5 rounded-2xl border-4 border-dark-bg hover:bg-dark-bg hover:text-fire transition-colors"
          >
            {t.bigCta.notify}
          </button>
        </div>
      </div>
    </section>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border ${open ? "border-fire/60 bg-fire/5" : "border-cardboard/30 bg-dark-bg"} transition-all duration-300`}>
      <button
        className="w-full flex items-center justify-between p-5 text-left gap-4"
        onClick={() => setOpen(!open)}
      >
        <span className="font-display text-lg text-foreground">{q}</span>
        <span
          className="shrink-0 font-display text-2xl text-fire transition-transform duration-300"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          +
        </span>
      </button>
      <div
        style={{
          maxHeight: open ? "600px" : "0",
          overflow: "hidden",
          transition: "max-height 0.4s ease-in-out",
        }}
      >
        <p className="px-5 pb-5 font-sans text-sm text-foreground/75 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

function FAQSection() {
  const t = useT();
  return (
    <section id="gyik" className="bg-background">
      <div className="mx-auto max-w-3xl px-6 py-24">
        <div data-reveal className="text-center mb-12">
          <p className="font-sans text-xs tracking-[0.4em] text-fire mb-3">
            {t.faq.kicker}
          </p>
          <h2 className="font-display text-4xl sm:text-5xl text-fire">
            {t.faq.heading}
          </h2>
        </div>
        <div className="space-y-2" data-reveal data-delay="1">
          {t.faq.items.map((f) => (
            <FAQItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const t = useT();
  return (
    <div className="relative mt-16">
      <footer id="kapcsolat" className="relative bg-fire px-6 pt-14 pb-12 flex flex-col items-center gap-4">
        <p className="font-display text-white text-lg tracking-wider">{t.footer.follow}</p>
        <div className="flex gap-4 flex-wrap justify-center">
          {/* Fondo blanco en cada botón para que el logo pueda ir en su color
              oficial: sobre el morado del footer, el negro de TikTok y el azul
              de Facebook se perderían. */}
          {SOCIAL_LINKS.map((s) => (
            <a
              key={s.key}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="h-12 w-12 grid place-items-center rounded-full bg-white hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(13,13,13,0.25)] transition-all"
              style={{ color: s.brand }}
            >
              <SocialGlyph path={s.path} className="h-5 w-5" />
            </a>
          ))}
        </div>
        <nav className="flex flex-wrap gap-x-4 gap-y-1 justify-center font-sans text-xs text-white/70 mt-2">
          <Link to="/privacy" className="hover:text-white">{t.footer.privacy}</Link>
          <span>·</span>
          <Link to="/terms" className="hover:text-white">{t.footer.terms}</Link>
          <span>·</span>
          <Link to="/cookies" className="hover:text-white">{t.footer.cookies}</Link>
        </nav>
        <p className="font-sans text-xs text-white/70">
          © 2026 <span className="font-display text-white">AZKOMOLY</span> · {t.footer.rights}
        </p>
      </footer>
    </div>
  );
}

function SignupDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const t = useT();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+36");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const appendToSheet = useServerFn(appendLeadToSheet);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!consent) {
      setStatus("error");
      setMessage(t.signup.errorConsent);
      return;
    }
    const parsed = signupSchema.safeParse({ name, email, phone });
    if (!parsed.success) {
      setStatus("error");
      setMessage(t.signup.errorGeneric);
      return;
    }
    setStatus("loading");
    setMessage("");

    const phoneTrim = parsed.data.phone?.trim();
    const emailLower = parsed.data.email.toLowerCase();
    const { error } = await supabase.from("azkomoly_leads").insert({
      name: parsed.data.name,
      email: emailLower,
      phone: phoneTrim ? phoneTrim : null,
      phone_country_code: phoneTrim ? countryCode : null,
      source: "landing",
    });

    if (error && error.code !== "23505") {
      setStatus("error");
      setMessage(t.signup.errorGeneric);
      return;
    }

    appendToSheet({
      data: {
        name: parsed.data.name,
        email: emailLower,
        countryCode: phoneTrim ? countryCode : null,
        phone: phoneTrim || null,
      },
    }).catch((err) => console.error("Sheet append error", err));

    if (error?.code === "23505") {
      setStatus("success");
      setMessage(t.signup.successExisting);
      return;
    }
    setStatus("success");
    setMessage(t.signup.successNew);
    setName("");
    setEmail("");
    setPhone("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-dark-bg border-fire/60 graffiti-border w-[94vw] max-w-md p-5 sm:p-6">
        <DialogHeader className="pb-1">
          <DialogTitle className="font-display text-2xl sm:text-3xl text-fire text-fire-glow text-center">
            {t.signup.title}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:gap-4 mt-1">
          <div>
            <label htmlFor="name" className="block font-sans text-sm text-foreground mb-1">{t.signup.name}</label>
            <input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={120}
              placeholder={t.signup.namePlaceholder}
              className="w-full bg-background border-2 border-cardboard/60 focus:border-fire text-foreground px-4 py-3 text-base font-sans focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-sans text-sm text-foreground mb-1">{t.signup.email}</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={255}
              placeholder="te@email.hu"
              className="w-full bg-background border-2 border-cardboard/60 focus:border-fire text-foreground px-4 py-3 text-base font-sans focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block font-sans text-sm text-foreground mb-1">
              {t.signup.phone} <span className="text-muted-foreground">{t.signup.optional}</span>
            </label>
            <div className="flex gap-2">
              <Select value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger className="w-[110px] sm:w-[130px] shrink-0 bg-background border-2 border-cardboard/60 text-foreground font-sans py-3 px-3 text-base min-h-[52px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-dark-bg border-cardboard/60 text-foreground max-h-72 min-w-[180px]">
                  {COUNTRY_CODES.map((c) => (
                    <SelectItem key={c.code} value={c.code} className="font-sans text-base">
                      <span className="mr-2">{c.flag}</span>
                      {c.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={32}
                placeholder={t.signup.phonePlaceholder}
                className="flex-1 min-w-0 bg-background border-2 border-cardboard/60 focus:border-fire text-foreground px-4 py-3 text-base font-sans focus:outline-none transition-colors min-h-[52px]"
              />
            </div>
          </div>

          <label className="flex items-start gap-2 text-xs sm:text-sm text-foreground/80 font-sans">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 accent-fire"
              required
            />
            <span>
              {t.signup.consentPre}
              <Link to="/terms" className="text-fire underline" target="_blank">{t.signup.consentTerms}</Link>
              {t.signup.consentMid}
              <Link to="/privacy" className="text-fire underline" target="_blank">{t.signup.consentPrivacy}</Link>
              {t.signup.consentPost}
            </span>
          </label>

          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-1 sm:mt-2 bg-fire text-primary-foreground font-display text-lg sm:text-xl px-6 py-4 graffiti-border hover:translate-y-[-2px] transition-transform disabled:opacity-60"
          >
            {status === "loading" ? t.signup.sending : t.signup.submit}
          </button>

          {message && (
            <p
              role="status"
              className={`font-sans text-sm text-center ${status === "success" ? "text-fire" : "text-destructive"}`}
            >
              {message}
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
