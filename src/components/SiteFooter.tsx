import { Link } from "@tanstack/react-router";
import { SOCIAL_LINKS, SocialGlyph } from "@/components/social/SocialLogos";
import { useT } from "@/lib/i18n";

function TapeCorner({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 92 46" aria-hidden="true" className={className}>
      <path d="M4 12 88 2 82 34 0 44Z" fill="#222222" opacity="0.96" />
      <path d="M15 13 22 38M42 8 49 35M69 5 75 30" stroke="#3A3A3A" strokeWidth="3" />
    </svg>
  );
}

/**
 * Footer "taped" (tarjeta blanca con cintas + sombra dura) — nació en Home
 * (`index.tsx`) y hasta ahora `about.tsx`/`faq.tsx` seguían con una versión
 * vieja y simple (`bg-fire` plano, sin tarjeta), lo que hacía que esas páginas
 * se vieran menos terminadas que Home. Compartido acá para que las 4 páginas
 * (Home, About, FAQ, Blog) usen el mismo footer real.
 *
 * `productsHref`: el link "Termékek"/"Products" apunta a un ancla (`#termekek`)
 * que sólo existe en la landing — en páginas que no son la landing hay que
 * pasarle la ruta completa (`/#termekek` o `/en#termekek`).
 */
export function SiteFooter({ productsHref = "#termekek" }: { productsHref?: string }) {
  const t = useT();
  const links = [
    { to: "/about", label: t.footer.about },
    { to: "/faq", label: t.footer.faq },
    { to: "/blog", label: t.footer.blog },
    { to: "/privacy", label: t.footer.privacy },
    { to: "/terms", label: t.footer.terms },
    { to: "/cookies", label: t.footer.cookies },
  ] as const;

  return (
    <div className="relative bg-fire px-4 py-12 sm:px-6 sm:py-16">
      <footer
        id="kapcsolat"
        className="relative mx-auto max-w-6xl rounded-md border-2 border-black bg-white px-5 py-10 text-black shadow-[12px_12px_0_#0D0D0D] sm:px-10"
      >
        <TapeCorner className="absolute -left-5 -top-4 h-12 w-24 -rotate-12" />
        <TapeCorner className="absolute -right-5 -top-4 h-12 w-24 rotate-12" />
        <TapeCorner className="absolute -bottom-4 -left-5 h-12 w-24 rotate-12" />
        <TapeCorner className="absolute -bottom-4 -right-5 h-12 w-24 -rotate-12" />

        <div className="grid gap-8 md:grid-cols-[1fr_1.2fr] md:items-end">
          <div>
            <img src="/azkomoly_new_logo.webp" alt="AZKOMOLY" className="h-12 w-auto" />
            <p className="mt-5 max-w-sm font-sans text-sm leading-relaxed text-black/68">
              {t.footer.tagline}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.key}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid h-11 w-11 place-items-center rounded-full border-2 border-black bg-white transition-all hover:-translate-y-0.5 hover:bg-fire hover:text-white"
                  style={{ color: s.brand }}
                >
                  <SocialGlyph path={s.path} className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="md:text-right">
            <nav className="mb-5 flex flex-wrap gap-x-4 gap-y-2 font-sans text-sm font-bold uppercase tracking-wide md:justify-end">
              <a href={productsHref} className="hover:text-fire">{t.footer.products}</a>
              {links.map((link) => (
                <Link key={link.to} to={link.to} className="hover:text-fire">
                  {link.label}
                </Link>
              ))}
            </nav>
            <p className="font-sans text-xs leading-relaxed text-black/62">
              <strong className="text-black">Oscar Investments Kft.</strong><br />
              {t.footer.taxNumber}: 32331486-2-09<br />
              {t.footer.companyNumber}: 09 09 036321
            </p>
            <p className="mt-4 font-sans text-xs text-black/54">
              © 2026 AZKOMOLY. {t.footer.rights}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
