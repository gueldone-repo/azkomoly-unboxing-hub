import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useT, useI18n } from "@/lib/i18n";
import { useSignupDialogStore } from "@/lib/state/signup-dialog-store";
import PillNav from "@/components/nav/PillNav";
import StaggeredMenu from "@/components/nav/StaggeredMenu";
import { SOCIAL_LINKS, SocialGlyph, SocialRow } from "@/components/social/SocialLogos";
import { LanguageToggle } from "@/components/LanguageToggle";
import { CartButton } from "@/components/cart/CartSheet";

/**
 * Navbar compartida — antes vivía sólo en `index.tsx` (`TopNav`), así que
 * About/FAQ/Blog/producto no tenían navegación real, sólo un logo suelto que
 * volvía a Home. Ahora la usan todas las páginas, mismo componente.
 *
 * `isHome`: los links a secciones de la landing (`#termekek`, `#hogyan`)
 * sólo existen ahí — en cualquier otra página tienen que apuntar primero a
 * la home y después al ancla (`/#termekek`), si no no hacen nada.
 */
export function SiteNav({ isHome = false }: { isHome?: boolean }) {
  const t = useT();
  const { lang } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const setSignupOpen = useSignupDialogStore((s) => s.setOpen);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const home = lang === "hu" ? "" : "/en";
  const anchor = (id: string) => (isHome ? `#${id}` : `${home}#${id}`);

  const navLinks = [
    { href: anchor("termekek"), label: t.nav.shop },
    { href: anchor("hogyan"), label: t.nav.how },
    // Los unboxings reales viven en la home; el link de reviews va a esa
    // sección, no a About (donde ya se quitó el bloque de videos).
    { href: anchor("velemenyek"), label: t.nav.reviews },
    { href: lang === "hu" ? "/about" : "/en/about", label: t.nav.about },
    { href: lang === "hu" ? "/faq" : "/en/faq", label: t.nav.faq },
    { href: lang === "hu" ? "/blog" : "/en/blog", label: t.nav.blog },
  ];

  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-[70] flex flex-col">
        <div className="w-full bg-white/90 backdrop-blur-md border-b border-black/[0.07]">
          <div className="mx-auto w-full max-w-7xl px-6 py-3 flex items-center justify-between gap-4">
            <a href={isHome ? "#top" : `${home || "/"}`} className="logo-link shrink-0">
              <img
                src="/azkomoly_new_logo.webp"
                alt="AZKOMOLY"
                className="logo-mark h-10 w-auto"
              />
            </a>
            {/* Sólo desktop de verdad (lg+) muestra los links de texto —
                antes arrancaba en `md` y la tablet ya recibía el menú
                hamburguesa "de escritorio", que no entra bien en ese ancho. */}
            <div className="hidden lg:block">
              <PillNav
                items={navLinks.map((l) => ({ label: l.label, href: l.href }))}
                baseColor="#5B2EA8"
                trackColor="transparent"
                pillColor="transparent"
                pillTextColor="#0D0D0D"
                hoveredPillTextColor="#FFFFFF"
              />
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <LanguageToggle className="hidden sm:inline-flex" />
              <SocialRow className="hidden md:flex !gap-3" iconClassName="h-[18px] w-[18px]" />
              <CartButton />
              <div className="hidden sm:contents">
                <button
                  onClick={() => setSignupOpen(true)}
                  className="btn-3d bg-fire px-5 py-2.5 font-sans text-xs font-semibold tracking-wide text-white"
                >
                  {t.nav.notify}
                </button>
              </div>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-label={menuOpen ? "Bezárás" : "Menü"}
                aria-expanded={menuOpen}
                aria-controls="staggered-menu-panel"
                className="lg:hidden grid place-items-center h-11 w-11 rounded-full border-2 border-black bg-white text-foreground shadow-[0_3px_0_#0D0D0D] active:translate-y-[2px] active:shadow-none transition-transform"
              >
                {menuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <StaggeredMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={navLinks.map((l) => ({ label: l.label, link: l.href, ariaLabel: l.label }))}
        // Íconos oficiales de marca (mismos que `SocialRow`), no el nombre en
        // texto de cada red — pedido de Diego.
        socialItems={SOCIAL_LINKS.map((s) => ({
          label: s.label,
          link: s.href,
          icon: <SocialGlyph path={s.path} className="h-5 w-5" style={{ color: s.brand }} />,
        }))}
        socialsTitle={t.footer.follow}
        position="right"
        colors={["#8F78B5", "#5B2EA8"]}
        accentColor="#5B2EA8"
        displayItemNumbering={false}
      />
    </>
  );
}
