import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube } from "lucide-react";

import { DripDivider } from "@/components/DripDivider";
import { SiteFooter } from "@/components/SiteFooter";
import { useT, useI18n } from "@/lib/i18n";

/**
 * Cuerpo de /about y /en/about. Vive fuera de las rutas para que las dos
 * versiones de idioma rendericen exactamente lo mismo: el texto sale del
 * diccionario (antes estaba escrito en húngaro dentro del archivo de ruta, por
 * eso /about seguía en húngaro con el sitio en inglés).
 */
const TITLE_STYLE = {
  fontFamily: "'Anton', var(--font-display)",
  letterSpacing: "-0.02em",
  lineHeight: 0.85,
} as const;

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V9.01a8.16 8.16 0 0 0 4.77 1.52V7.08a4.85 4.85 0 0 1-1.84-.39z" />
    </svg>
  );
}

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/azkomoly.hu/", Icon: Instagram },
  { label: "TikTok", href: "https://www.tiktok.com/@azkomoly.hu", Icon: TikTokIcon },
  { label: "YouTube", href: "https://www.youtube.com/@AzKomolyHungary", Icon: Youtube },
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61590505527795",
    Icon: Facebook,
  },
];

export function AboutPageBody() {
  const t = useT();
  const { lang } = useI18n();
  const homeHref = lang === "hu" ? "/" : "/en";

  return (
    <main className="bg-background pt-16">
      {/* Sin breadcrumb: se leía como una barra de "volver" redundante —
          el navbar ya cubre esa navegación (pedido de Diego). */}
      <section id="about-intro" className="bg-background px-6 pt-14 pb-12 sm:pt-20 sm:pb-16 flex flex-col items-center text-center gap-6">
        <a href={homeHref} aria-label="AZKOMOLY">
          <img src="/azkomoly_new_logo.webp" alt="AZKOMOLY" className="h-24 sm:h-32 w-auto" />
        </a>
        {/* Sin `text-3d-fire`: el morado con sombra negra apilada se leía sucio. */}
        <h1 className="text-fire text-[clamp(2.75rem,13vw,7rem)] uppercase" style={TITLE_STYLE}>
          {t.about.title}
        </h1>
        <p className="font-sans text-sm sm:text-base text-foreground/70 max-w-md">
          {t.about.intro}
        </p>
      </section>

      {/* bgColor = color de la sección de abajo, si no queda una línea recta. */}
      <DripDivider variant="organic" mainColor="#FFFFFF" bgColor="#5B2EA8" shadowColor="#0D0D0D" depth={4} height={34} />
      <section id="about-goal" className="bg-fire px-6 py-14 sm:py-20">
        <div className="mx-auto max-w-2xl flex flex-col gap-5 text-center sm:text-left">
          <h2 className="text-white text-[clamp(2rem,9vw,4rem)] uppercase" style={TITLE_STYLE}>
            {t.about.goalTitle}
          </h2>
          <p className="font-sans text-white/90 text-base sm:text-lg leading-relaxed">
            {t.about.goalP1}
          </p>
          <p className="font-sans text-white/80 text-sm sm:text-base leading-relaxed">
            {t.about.goalP2}
          </p>
        </div>
      </section>

      <DripDivider variant="organic" mainColor="#5B2EA8" bgColor="#FFFFFF" shadowColor="#0D0D0D" depth={4} height={34} />
      <section id="about-who" className="bg-background px-6 py-14 sm:py-20">
        <div className="mx-auto max-w-2xl flex flex-col gap-5 text-center sm:text-left">
          <h2 className="text-fire text-[clamp(2rem,9vw,4rem)] uppercase" style={TITLE_STYLE}>
            {t.about.whoTitle}
          </h2>
          <p className="font-sans text-foreground text-base sm:text-lg leading-relaxed font-semibold">
            {t.about.whoLead}
          </p>
          <p className="font-sans text-foreground/80 text-base leading-relaxed">
            {t.about.whoBody}
          </p>
          <div className="flex flex-wrap gap-3 justify-center sm:justify-start pt-2">
            <span className="rounded-full bg-fire text-white font-sans text-sm px-5 py-2 btn-drip">
              {t.about.badgeHungarian}
            </span>
            <span className="rounded-full bg-fire text-white font-sans text-sm px-5 py-2 btn-drip">
              {t.about.badgeOriginal}
            </span>
          </div>
          <div className="pt-4 flex justify-center sm:justify-start">
            <Link
              to={homeHref}
              className="rounded-full bg-fire text-white font-sans font-semibold tracking-wide uppercase px-7 py-3 btn-drip"
            >
              {t.about.seeBoxes}
            </Link>
          </div>
        </div>
      </section>

      <DripDivider variant="organic" mainColor="#FFFFFF" bgColor="#5B2EA8" shadowColor="#0D0D0D" depth={4} height={34} />
      <section id="about-follow" className="bg-fire px-6 py-14 sm:py-20 flex flex-col items-center text-center gap-6">
        <img src="/azkomoly_new_logo_negativo.webp" alt="" aria-hidden className="h-16 w-auto" />
        <h2 className="text-white text-[clamp(2rem,9vw,4rem)] uppercase" style={TITLE_STYLE}>
          {t.about.followTitle}
        </h2>
        <p className="font-sans text-white/85 max-w-md text-sm sm:text-base">
          {t.about.followSub}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-xl pt-2">
          {SOCIALS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="rounded-2xl bg-fire text-white border-2 border-white/60 hover:text-black hover:border-black hover:-translate-y-0.5 transition-all flex flex-col items-center gap-2 py-6 btn-drip"
            >
              <Icon className="h-8 w-8" />
              <span className="font-sans text-xs uppercase tracking-widest">{label}</span>
            </a>
          ))}
        </div>
      </section>

      <SiteFooter productsHref={`${homeHref === "/" ? "" : homeHref}/#termekek`} />
    </main>
  );
}
