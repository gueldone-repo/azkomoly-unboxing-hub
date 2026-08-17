import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useT, useI18n } from "@/lib/i18n";
import { useSignupDialogStore } from "@/lib/signup-dialog-store";
import PillNav from "@/components/nav/PillNav";
import StaggeredMenu from "@/components/nav/StaggeredMenu";
import { SOCIAL_LINKS, SocialRow } from "@/components/social/SocialLogos";
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
    // "Real unboxings" se mudó a About — el link de reviews apunta ahí en
    // vez de a un ancla de la landing.
    { href: "/about#velemenyek", label: t.nav.reviews },
    { href: "/about", label: t.nav.about },
    { href: "/faq", label: t.nav.faq },
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
                onClick={() => setSignupOpen(true)}
                className="btn-3d hidden bg-fire px-5 py-2.5 font-sans text-xs font-semibold tracking-wide text-white sm:inline-flex"
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

      <StaggeredMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        items={navLinks.map((l) => ({ label: l.label, link: l.href, ariaLabel: l.label }))}
        socialItems={SOCIAL_LINKS.map((s) => ({ label: s.label, link: s.href }))}
        socialsTitle={t.footer.follow}
        position="right"
        colors={["#8F78B5", "#5B2EA8"]}
        accentColor="#5B2EA8"
        displayItemNumbering={false}
      />
    </>
  );
}
