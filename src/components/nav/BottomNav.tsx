import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Package, Info, HelpCircle, ShoppingBag } from "lucide-react";
import { useShopifyCart } from "@/lib/shopify/cart-store";
import { useT } from "@/lib/i18n";

/**
 * Barra de navegación inferior, al alcance del pulgar.
 *
 * El objetivo es que la gente entre a los productos y se quede: los destinos
 * que hacen ganar dinero (la tienda y el carrito) quedan donde el pulgar llega
 * sin recolocar la mano, en vez de escondidos tras la hamburguesa de arriba.
 *
 * Sólo móvil y tablet (`lg:hidden`). En escritorio el navbar superior ya está
 * a la vista y una barra flotante abajo sólo taparía contenido.
 *
 * Detalles que la hacen sentir nativa:
 *  - `pb-[env(safe-area-inset-bottom)]` para no quedar debajo de la barra de
 *    gestos del iPhone.
 *  - El item activo se resuelve por ruta real, no por estado manual.
 *  - El carrito lleva su contador, igual que el del navbar.
 */

const ICONS = { home: Home, shop: Package, about: Info, faq: HelpCircle, cart: ShoppingBag };

export function BottomNav() {
  const t = useT();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const count = useShopifyCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  // El carrito vive en el store, así que la barra puede abrirlo sin que la
  // página tenga que pasarle nada.
  const setCartOpen = useShopifyCart((s) => s.setOpen);

  // `/en` y `/` son la misma home en distinto idioma; el prefijo se conserva
  // para no sacar al usuario de su idioma al tocar un destino.
  const isEn = pathname === "/en" || pathname.startsWith("/en/");
  const base = isEn ? "/en" : "";
  const isHome = pathname === "/" || pathname === "/en";

  const items = [
    { key: "home", label: t.nav.home, to: `${base}/` || "/", active: isHome, hash: "" },
    { key: "shop", label: t.nav.shop, to: `${base}/` || "/", active: false, hash: "#termekek" },
    { key: "about", label: t.nav.about, to: "/about", active: pathname === "/about", hash: "" },
    { key: "faq", label: t.nav.faq, to: "/faq", active: pathname === "/faq", hash: "" },
  ] as const;

  return (
    <nav
      aria-label={t.nav.primary}
      className="lg:hidden fixed bottom-0 inset-x-0 z-[65] border-t border-black/[0.07] bg-white/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="grid grid-cols-5 items-stretch">
        {items.map((it) => {
          const Icon = ICONS[it.key];
          const href = it.hash ? `${it.to}${it.hash}` : it.to;
          return (
            <li key={it.key} className="flex">
              <a
                href={href}
                aria-current={it.active ? "page" : undefined}
                className={`flex flex-1 flex-col items-center justify-center gap-1 py-2.5 transition-colors ${
                  it.active ? "text-fire" : "text-foreground/55 hover:text-foreground"
                }`}
              >
                <Icon className="h-[22px] w-[22px]" strokeWidth={it.active ? 2.4 : 1.9} />
                <span className="font-sans text-[10px] font-semibold leading-none">{it.label}</span>
              </a>
            </li>
          );
        })}

        <li className="flex">
          <button
            onClick={() => setCartOpen(true)}
            aria-label={t.nav.cart}
            className="relative flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-foreground/55 transition-colors hover:text-foreground"
          >
            <span className="relative">
              <ShoppingBag className="h-[22px] w-[22px]" strokeWidth={1.9} />
              {count > 0 && (
                <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-fire px-1 font-sans text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </span>
            <span className="font-sans text-[10px] font-semibold leading-none">{t.nav.cart}</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}

/** Alias tipado para que TypeScript no se queje del índice de ICONS. */
export type BottomNavKey = keyof typeof ICONS;
