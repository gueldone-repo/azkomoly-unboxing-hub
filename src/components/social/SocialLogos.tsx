import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { siInstagram, siTiktok, siYoutube, siFacebook } from "simple-icons";

/**
 * Logos OFICIALES de las redes, en un solo sitio.
 *
 * Los paths vienen del paquete `simple-icons`, que publica el trazo oficial de
 * cada marca. Antes el sitio usaba los iconos genéricos de lucide-react (líneas
 * dibujadas "a la manera de"), que no son los logos reales; y el de TikTok era
 * un path suelto copiado dentro de index.tsx.
 *
 * Los enlaces también viven acá: estaban duplicados en dos sitios de index.tsx
 * y la copia del navbar tenía `href="#"` en Facebook, YouTube y TikTok, así que
 * tres de los cuatro iconos de la barra superior no llevaban a ninguna parte.
 */

export type SocialKey = "instagram" | "tiktok" | "youtube" | "facebook";

export const SOCIAL_LINKS: {
  key: SocialKey;
  label: string;
  href: string;
  path: string;
  /** Color de marca oficial, tal como lo publica cada compañía. */
  brand: string;
}[] = [
  {
    key: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/azkomoly.hu/",
    path: siInstagram.path,
    brand: `#${siInstagram.hex}`,
  },
  {
    key: "tiktok",
    label: "TikTok",
    href: "https://www.tiktok.com/@azkomoly.hu",
    path: siTiktok.path,
    brand: `#${siTiktok.hex}`,
  },
  {
    key: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/@AzKomolyHungary",
    path: siYoutube.path,
    brand: `#${siYoutube.hex}`,
  },
  {
    key: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61590505527795",
    path: siFacebook.path,
    brand: `#${siFacebook.hex}`,
  },
];

export function SocialGlyph({
  path,
  className = "",
  style,
}: {
  path: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

/**
 * Fila de logos.
 *
 * `tone`:
 *  - "brand"  → cada logo en su color oficial. Sólo sobre fondo claro.
 *  - "white"  → todos en blanco, para las secciones moradas. El negro oficial
 *               de TikTok sobre morado no se distingue, y el azul de Facebook
 *               queda casi ilegible, así que ahí la forma oficial se mantiene
 *               pero el relleno se unifica.
 */
export function SocialRow({
  tone = "brand",
  className = "",
  iconClassName = "h-5 w-5",
}: {
  tone?: "brand" | "white";
  className?: string;
  iconClassName?: string;
}) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {SOCIAL_LINKS.map((s) => (
        <a
          key={s.key}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          className="transition-transform duration-200 hover:-translate-y-0.5"
          style={{ color: tone === "brand" ? s.brand : "#FFFFFF" }}
        >
          <SocialGlyph path={s.path} className={iconClassName} />
        </a>
      ))}
    </div>
  );
}

const RAIL_HIDE_DELAY = 900;
/** En touch no hay `mouseleave` que dispare el cierre — se cierra solo tras
 *  este tiempo desde que se abrió, dando lugar a leer/tocar un ícono. */
const RAIL_HIDE_DELAY_TOUCH = 2600;

/**
 * Columna lateral del hero. Pedido de George: que se pueda seguir a AZKOMOLY
 * de inmediato, sin buscar. Queda pegada al borde izquierdo, fuera del camino
 * del CTA de compra, así no compiten por el mismo clic.
 *
 * Visible en todos los tamaños (antes `hidden lg:flex`, sólo mostraba en
 * desktop). En touch el patrón de hover no existe, así que el tap abre la
 * lengüeta y un timer más largo (`RAIL_HIDE_DELAY_TOUCH`) la cierra sola en
 * vez de depender de `mouseleave`, que nunca dispara en un dispositivo táctil.
 *
 * Antes quedaba siempre visible tapando contenido durante todo el scroll.
 * Ahora se esconde detrás de una lengüeta — mismo patrón que el dock de
 * navegación inferior (`BottomNav.tsx`): la lengüeta es lo único visible en
 * reposo, y el hover/click/foco la revela con un timer de cierre al alejarse.
 */
export function SocialRail() {
  const prefersReducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const hideTimer = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none)");
    setIsTouch(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const clearHideTimer = useCallback(() => {
    if (hideTimer.current === null) return;
    window.clearTimeout(hideTimer.current);
    hideTimer.current = null;
  }, []);

  const scheduleHide = useCallback(
    (delay = RAIL_HIDE_DELAY) => {
      clearHideTimer();
      hideTimer.current = window.setTimeout(() => setVisible(false), delay);
    },
    [clearHideTimer],
  );

  useEffect(() => clearHideTimer, [clearHideTimer]);

  // En touch, abrir programa su propio cierre automático (no hay mouseleave).
  useEffect(() => {
    if (!isTouch || !visible) return;
    scheduleHide(RAIL_HIDE_DELAY_TOUCH);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTouch, visible]);

  return (
    <>
      <div className="flex fixed left-0 top-1/2 z-30 -translate-y-1/2">
        <motion.button
          type="button"
          aria-label="Kövess minket"
          aria-expanded={visible}
          onClick={() => {
            clearHideTimer();
            setVisible((v) => !v);
          }}
          onMouseEnter={() => {
            if (isTouch) return;
            clearHideTimer();
            setVisible(true);
          }}
          initial={false}
          animate={{ opacity: visible ? 0 : 1, pointerEvents: visible ? "none" : "auto" }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.18, ease: "easeOut" }}
          className="grid h-16 w-8 lg:h-14 lg:w-6 place-items-center rounded-r-xl border border-l-0 border-black/10 bg-white/92 text-foreground/45 shadow-[6px_0_18px_rgba(13,13,13,0.10)] backdrop-blur transition-colors hover:text-fire"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
        </motion.button>
      </div>

      <div
        className="flex fixed left-3 top-1/2 z-30 -translate-y-1/2 flex-col items-center gap-1"
        onMouseEnter={() => {
          if (isTouch) return;
          clearHideTimer();
          setVisible(true);
        }}
        onMouseLeave={() => {
          if (isTouch) return;
          scheduleHide();
        }}
        onFocusCapture={() => {
          clearHideTimer();
          setVisible(true);
        }}
        onBlurCapture={() => scheduleHide()}
      >
        <motion.div
          initial={false}
          animate={{
            opacity: visible ? 1 : 0,
            x: visible ? 0 : -12,
            scale: visible ? 1 : 0.96,
            pointerEvents: visible ? "auto" : "none",
          }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.22, ease: "easeOut" }}
          className="flex flex-col items-center gap-1"
        >
          {SOCIAL_LINKS.map((s) => (
            <a
              key={s.key}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="grid place-items-center h-11 w-11 rounded-full bg-white/85 backdrop-blur-sm shadow-[0_4px_14px_rgba(13,13,13,0.10)] transition-all duration-200 hover:scale-110 hover:bg-white hover:shadow-[0_6px_20px_rgba(13,13,13,0.18)]"
              style={{ color: s.brand }}
            >
              <SocialGlyph path={s.path} className="h-[18px] w-[18px]" />
            </a>
          ))}
        </motion.div>
      </div>
    </>
  );
}
