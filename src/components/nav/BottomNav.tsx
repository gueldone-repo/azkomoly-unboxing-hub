import { useCallback, useEffect, useMemo, useRef, useState, type ElementType } from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Home,
  Info,
  Package,
  ShoppingBag,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { Dock, DockIcon, DockItem, DockLabel } from "@/components/core/dock";
import { useT } from "@/lib/i18n";
import { useShopifyCart } from "@/lib/shopify/cart-store";
import { cn } from "@/lib/utils";

const LANDING_SECTIONS = ["termekek", "hogyan", "gyik", "kapcsolat"] as const;
const DESKTOP_REVEAL_DISTANCE = 160;
const DESKTOP_HIDE_DISTANCE = 220;
const DESKTOP_HIDE_DELAY = 900;

type NavKey = "home" | "shop" | "about" | "faq";
type NavItem = {
  key: NavKey;
  label: string;
  href: string;
  active: boolean;
  icon: ElementType<{ className?: string; strokeWidth?: number }>;
};

function isHomePath(pathname: string): boolean {
  return pathname === "/" || pathname === "/en";
}

function getHomeHref(pathname: string): "/" | "/en" {
  return pathname === "/en" || pathname.startsWith("/en/") ? "/en" : "/";
}

function getCurrentSectionIndex(): number {
  const centerY = window.innerHeight / 2;
  let bestIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;

  LANDING_SECTIONS.forEach((id, index) => {
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

export function BottomNav() {
  const t = useT();
  const location = useRouterState({ select: (s) => s.location });
  const pathname = location.pathname;
  const hash = location.hash;
  const homeHref = getHomeHref(pathname);
  const onHome = isHomePath(pathname);
  const prefersReducedMotion = useReducedMotion();
  const count = useShopifyCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const setCartOpen = useShopifyCart((s) => s.setOpen);
  // El panel del carrito es `z-50` y esta barra `z-[65]`: se montaba encima y
  // tapaba el botón de pagar. Con el carrito abierto la barra desaparece — en
  // ese momento el único trabajo de la pantalla es cerrar la compra.
  const cartOpen = useShopifyCart((s) => s.isOpen);
  const [desktopVisible, setDesktopVisible] = useState(false);
  const lastPointerY = useRef<number | null>(null);
  const hideTimer = useRef<number | null>(null);

  const navItems = useMemo<NavItem[]>(
    () => [
      {
        key: "home",
        label: t.nav.home,
        href: homeHref,
        active: onHome && hash !== "#termekek",
        icon: Home,
      },
      {
        key: "shop",
        label: t.nav.shop,
        href: `${homeHref}#termekek`,
        active: onHome && hash === "#termekek",
        icon: Package,
      },
      { key: "about", label: t.nav.about, href: "/about", active: pathname === "/about", icon: Info },
      { key: "faq", label: t.nav.faq, href: "/faq", active: pathname === "/faq", icon: HelpCircle },
    ],
    [hash, homeHref, onHome, pathname, t.nav.about, t.nav.faq, t.nav.home, t.nav.shop],
  );

  const clearHideTimer = useCallback(() => {
    if (hideTimer.current === null) return;
    window.clearTimeout(hideTimer.current);
    hideTimer.current = null;
  }, []);

  const scheduleDesktopHide = useCallback(() => {
    clearHideTimer();
    hideTimer.current = window.setTimeout(() => setDesktopVisible(false), DESKTOP_HIDE_DELAY);
  }, [clearHideTimer]);

  // Antes esto escuchaba `pointermove` en toda la ventana y el dock saltaba
  // solo al acercar el ratón abajo: intrusivo, aparecía sin que nadie lo
  // pidiera, y encima corría en cada frame de movimiento. Ahora el dock sólo
  // sale cuando el usuario lo saca por la lengüeta. Se conserva el temporizador
  // para replegarlo al alejarse.
  useEffect(() => clearHideTimer, [clearHideTimer]);

  const scrollTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const jumpSection = useCallback((direction: -1 | 1) => {
    const next = Math.min(
      LANDING_SECTIONS.length - 1,
      Math.max(0, getCurrentSectionIndex() + direction),
    );
    scrollToElement(LANDING_SECTIONS[next]);
  }, []);

  const onAnchorClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      const [path, anchor] = href.split("#");
      if (!anchor || path !== homeHref || !onHome) return;

      event.preventDefault();
      scrollToElement(anchor);
      window.history.replaceState(null, "", `${homeHref}#${anchor}`);
    },
    [homeHref, onHome],
  );

  // Con el carrito abierto la navegación estorba: competía por encima del panel
  // y el usuario tocaba "Inicio" cuando quería pagar.
  if (cartOpen) return null;

  return (
    <>
      <nav
        aria-label={t.nav.primary}
        className="fixed bottom-4 left-1/2 z-[65] hidden -translate-x-1/2 lg:block"
        onFocusCapture={() => {
          clearHideTimer();
          setDesktopVisible(true);
        }}
        onBlurCapture={scheduleDesktopHide}
        onMouseEnter={() => {
          clearHideTimer();
          setDesktopVisible(true);
        }}
        onMouseLeave={scheduleDesktopHide}
      >
        {/* Lengüeta: lo único visible en reposo. Discreta, pegada al borde, y
            sacas el dock cuando tú quieres — con el cursor o con el teclado. */}
        <motion.button
          type="button"
          aria-label={t.nav.primary}
          aria-expanded={desktopVisible}
          onClick={() => {
            clearHideTimer();
            setDesktopVisible((v) => !v);
          }}
          initial={false}
          animate={{
            opacity: desktopVisible ? 0 : 1,
            y: desktopVisible ? 14 : 0,
            pointerEvents: desktopVisible ? "none" : "auto",
          }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.18, ease: "easeOut" }}
          className="absolute bottom-0 left-1/2 grid h-6 w-16 -translate-x-1/2 place-items-center rounded-t-full border border-b-0 border-black/10 bg-white/92 text-foreground/45 shadow-[0_-6px_18px_rgba(13,13,13,0.10)] backdrop-blur transition-colors hover:text-fire"
        >
          <ChevronUp className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
        </motion.button>

        <motion.div
          initial={false}
          animate={{
            opacity: desktopVisible ? 1 : 0,
            y: desktopVisible ? 0 : 22,
            scale: desktopVisible ? 1 : 0.96,
            pointerEvents: desktopVisible ? "auto" : "none",
          }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.22, ease: "easeOut" }}
        >
          <Dock baseSize={48} magnifiedSize={74} distance={155}>
            <DockAction
              ariaLabel={t.nav.scrollTop}
              label={t.nav.scrollTop}
              icon={ChevronUp}
              onClick={scrollTop}
            />
            {/* About/FAQ do not contain the landing section anchors, so section arrows
                hide there instead of navigating users away from the page they chose. */}
            {onHome && (
              <>
                <DockAction
                  ariaLabel={t.nav.prevSection}
                  label={t.nav.prevSection}
                  icon={SkipBack}
                  onClick={() => jumpSection(-1)}
                />
                <DockAction
                  ariaLabel={t.nav.nextSection}
                  label={t.nav.nextSection}
                  icon={SkipForward}
                  onClick={() => jumpSection(1)}
                />
              </>
            )}
            <span className="mx-1 h-8 w-px self-center bg-black/10" aria-hidden="true" />
            {navItems.map((item) => (
              <DockLink key={item.key} item={item} onAnchorClick={onAnchorClick} />
            ))}
            <DockCartButton count={count} label={t.nav.cart} onClick={() => setCartOpen(true)} />
          </Dock>
        </motion.div>
      </nav>

      <nav
        aria-label={t.nav.primary}
        className="fixed inset-x-0 bottom-0 z-[65] border-t border-black/[0.07] bg-white/94 px-3 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-2 shadow-[0_-16px_45px_rgba(13,13,13,0.10)] backdrop-blur-xl lg:hidden"
      >
        <div className="mx-auto flex max-w-md items-end justify-between gap-1 rounded-[28px] bg-[#0D0D0D]/[0.035] p-1.5">
          <MobileIconButton ariaLabel={t.nav.scrollTop} icon={ChevronUp} onClick={scrollTop} />
          {/* About/FAQ do not contain the landing section anchors, so section arrows
              hide there instead of navigating users away from the page they chose. */}
          {onHome && (
            <>
              <MobileIconButton
                ariaLabel={t.nav.prevSection}
                icon={ChevronDown}
                iconClassName="rotate-90"
                onClick={() => jumpSection(-1)}
              />
              <MobileIconButton
                ariaLabel={t.nav.nextSection}
                icon={ChevronDown}
                iconClassName="-rotate-90"
                onClick={() => jumpSection(1)}
              />
            </>
          )}
          {navItems.map((item) => (
            <MobileNavLink key={item.key} item={item} onAnchorClick={onAnchorClick} />
          ))}
          <MobileCartButton count={count} label={t.nav.cart} onClick={() => setCartOpen(true)} />
        </div>
      </nav>
    </>
  );
}

function DockLink({
  item,
  onAnchorClick,
}: {
  item: NavItem;
  onAnchorClick: (event: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}) {
  const Icon = item.icon;

  return (
    <DockItem>
      <DockIcon>
        <a
          href={item.href}
          aria-label={item.label}
          aria-current={item.active ? "page" : undefined}
          onClick={(event) => onAnchorClick(event, item.href)}
          className={cn(
            "grid h-full w-full place-items-center rounded-full border border-black/10 bg-white text-foreground/70 shadow-sm transition-colors hover:text-fire focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fire motion-reduce:transition-none",
            item.active && "border-fire/40 bg-fire text-white hover:text-white",
          )}
        >
          <Icon className="h-[52%] w-[52%]" strokeWidth={item.active ? 2.5 : 2} />
        </a>
      </DockIcon>
      <DockLabel>{item.label}</DockLabel>
    </DockItem>
  );
}

function DockAction({
  ariaLabel,
  label,
  icon: Icon,
  onClick,
}: {
  ariaLabel: string;
  label: string;
  icon: ElementType<{ className?: string; strokeWidth?: number }>;
  onClick: () => void;
}) {
  return (
    <DockItem>
      <DockIcon>
        <button
          type="button"
          aria-label={ariaLabel}
          onClick={onClick}
          className="grid h-full w-full place-items-center rounded-full border border-black/10 bg-white text-foreground/65 shadow-sm transition-colors hover:text-fire focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fire motion-reduce:transition-none"
        >
          <Icon className="h-[50%] w-[50%]" strokeWidth={2.1} />
        </button>
      </DockIcon>
      <DockLabel>{label}</DockLabel>
    </DockItem>
  );
}

function DockCartButton({
  count,
  label,
  onClick,
}: {
  count: number;
  label: string;
  onClick: () => void;
}) {
  return (
    <DockItem>
      <DockIcon>
        <button
          type="button"
          aria-label={label}
          onClick={onClick}
          className="relative grid h-full w-full place-items-center rounded-full border border-fire/30 bg-fire text-white shadow-sm transition-colors hover:bg-[#4d248f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fire focus-visible:ring-offset-2 motion-reduce:transition-none"
        >
          <ShoppingBag className="h-[50%] w-[50%]" strokeWidth={2.15} />
          {count > 0 && <Badge count={count} className="-right-1 -top-1" />}
        </button>
      </DockIcon>
      <DockLabel>{label}</DockLabel>
    </DockItem>
  );
}

function MobileNavLink({
  item,
  onAnchorClick,
}: {
  item: NavItem;
  onAnchorClick: (event: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}) {
  const Icon = item.icon;

  return (
    <a
      href={item.href}
      aria-label={item.label}
      aria-current={item.active ? "page" : undefined}
      onClick={(event) => onAnchorClick(event, item.href)}
      className={cn(
        "relative flex h-14 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl px-1 text-foreground/55 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fire motion-reduce:transition-none",
        item.active && "bg-white text-fire shadow-[0_7px_20px_rgba(13,13,13,0.10)]",
      )}
    >
      <Icon className="h-5 w-5" strokeWidth={item.active ? 2.5 : 2} />
      <span className="max-w-full truncate font-sans text-[9px] font-semibold leading-none">
        {item.label}
      </span>
    </a>
  );
}

function MobileIconButton({
  ariaLabel,
  icon: Icon,
  iconClassName,
  onClick,
}: {
  ariaLabel: string;
  icon: ElementType<{ className?: string; strokeWidth?: number }>;
  iconClassName?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className="grid h-11 w-9 shrink-0 place-items-center rounded-2xl text-foreground/45 transition-colors hover:bg-white hover:text-fire focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fire motion-reduce:transition-none"
    >
      <Icon className={cn("h-4.5 w-4.5", iconClassName)} strokeWidth={2.2} />
    </button>
  );
}

function MobileCartButton({
  count,
  label,
  onClick,
}: {
  count: number;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="relative flex h-14 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl bg-fire px-1 text-white shadow-[0_8px_22px_rgba(91,46,168,0.30)] transition-colors hover:bg-[#4d248f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fire focus-visible:ring-offset-2 motion-reduce:transition-none"
    >
      <span className="relative">
        <ShoppingBag className="h-5 w-5" strokeWidth={2.2} />
        {count > 0 && <Badge count={count} className="-right-2 -top-2" />}
      </span>
      <span className="max-w-full truncate font-sans text-[9px] font-semibold leading-none">
        {label}
      </span>
    </button>
  );
}

function Badge({ count, className }: { count: number; className?: string }) {
  return (
    <span
      className={cn(
        "absolute grid h-4 min-w-4 place-items-center rounded-full bg-[#0D0D0D] px-1 font-sans text-[10px] font-bold leading-none text-white ring-2 ring-white",
        className,
      )}
    >
      {count}
    </span>
  );
}
