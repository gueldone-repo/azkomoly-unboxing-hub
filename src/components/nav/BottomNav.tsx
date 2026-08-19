import { useCallback, useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { ChevronUp } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { useT } from "@/lib/i18n";
import { useShopifyCart } from "@/lib/shopify/cart-store";
import { cn } from "@/lib/utils";

const LANDING_SECTIONS = ["termekek", "hogyan", "gyik", "kapcsolat"] as const;
// About y FAQ tienen sus propias secciones reales (ver ids agregados en
// AboutPageBody.tsx/FaqPageBody.tsx) — antes la flecha en esas páginas sólo
// hacía un scroll genérico de "una pantalla", sin saber qué había abajo.
// "kapcsolat" es el id del footer compartido (`SiteFooter.tsx`), así que
// sirve de última parada en cualquier ruta.
const ABOUT_SECTIONS = ["about-intro", "about-goal", "about-who", "about-reviews", "about-follow", "kapcsolat"] as const;
const FAQ_SECTIONS = ["faq-intro", "faq-list", "faq-help", "kapcsolat"] as const;

// "Después del hero": el hero mide ~1 pantalla, así que aparece pasado ese
// primer tramo. BOTTOM_MARGIN_PX: cuánto antes del final de la página se
// considera "cerca del final" para que la flecha ya apunte hacia arriba.
const REVEAL_AFTER_PX = 480;
const BOTTOM_MARGIN_PX = 160;

function isHomePath(pathname: string): boolean {
  return pathname === "/" || pathname === "/en";
}

function sectionsForPath(pathname: string): readonly string[] | null {
  if (isHomePath(pathname)) return LANDING_SECTIONS;
  if (pathname === "/about" || pathname === "/en/about") return ABOUT_SECTIONS;
  if (pathname === "/faq" || pathname === "/en/faq") return FAQ_SECTIONS;
  return null;
}

function getCurrentSectionIndex(sections: readonly string[]): number {
  const centerY = window.innerHeight / 2;
  let bestIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;

  sections.forEach((id, index) => {
    const el = document.getElementById(id);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const distance = Math.abs(rect.top + rect.height / 2 - centerY);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  });

  return bestIndex;
}

function scrollToElement(id: string): void {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Antes esto era un dock completo (escritorio: Dock flotante tras una
 * lengüeta; móvil: barra inferior fija con 6 iconos). Diego lo encontró
 * molesto y pidió sacarlo del todo en escritorio — el Home/Shop/About/FAQ ya
 * viven en el navbar de arriba (PillNav en desktop, menú hamburguesa en
 * móvil) y el carrito siempre está en el navbar, así que nada se pierde.
 *
 * En móvil queda una sola flecha flotante, que aparece pasado el hero:
 * apunta hacia abajo y avanza a la siguiente sección (en la landing) o baja
 * una pantalla (en el resto de páginas); cuando ya casi no queda página
 * debajo, se voltea hacia arriba y vuelve al tope.
 */
export function BottomNav() {
  const t = useT();
  const location = useRouterState({ select: (s) => s.location });
  const sections = sectionsForPath(location.pathname);
  const prefersReducedMotion = useReducedMotion();
  const cartOpen = useShopifyCart((s) => s.isOpen);

  const [visible, setVisible] = useState(false);
  const [pointDown, setPointDown] = useState(true);
  const ticking = useRef(false);

  useEffect(() => {
    function measure() {
      const scrollY = window.scrollY;
      const doc = document.documentElement;
      const nearBottom = scrollY + window.innerHeight >= doc.scrollHeight - BOTTOM_MARGIN_PX;
      setVisible(scrollY > REVEAL_AFTER_PX);
      setPointDown(!nearBottom);
      ticking.current = false;
    }

    function onScroll() {
      if (ticking.current) return;
      ticking.current = true;
      window.requestAnimationFrame(measure);
    }

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const handleClick = useCallback(() => {
    if (!pointDown) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (sections) {
      const next = Math.min(sections.length - 1, getCurrentSectionIndex(sections) + 1);
      scrollToElement(sections[next]);
    } else {
      window.scrollBy({ top: window.innerHeight * 0.85, behavior: "smooth" });
    }
  }, [sections, pointDown]);

  // Con el carrito abierto la flecha estorba: competía por encima del panel.
  if (cartOpen) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[65] flex justify-end pb-[calc(env(safe-area-inset-bottom)+16px)] pr-4 lg:hidden">
      <AnimatePresence>
        {visible && (
          <motion.button
            type="button"
            aria-label={pointDown ? t.nav.nextSection : t.nav.scrollTop}
            onClick={handleClick}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: 14, scale: 0.9 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="pointer-events-auto grid h-12 w-12 place-items-center rounded-full bg-fire text-white shadow-[0_10px_28px_rgba(91,46,168,0.35)] transition-transform active:scale-95"
          >
            <ChevronUp
              className={cn("h-5 w-5 transition-transform duration-300", pointDown && "rotate-180")}
              strokeWidth={2.5}
              aria-hidden="true"
            />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
