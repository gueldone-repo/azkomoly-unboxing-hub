import { createFileRoute, Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube } from "lucide-react";
import { DripDivider } from "@/components/DripDivider";
import { SiteBreadcrumb } from "@/components/SiteBreadcrumb";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/nav/SiteNav";
import { SocialProofMarquee } from "@/components/SocialProofMarquee";
import { seoLinksHuOnly } from "@/lib/seo";
import logoAsset from "@/assets/azkomoly-logo.png.asset.json";

export const Route = createFileRoute("/about")({
  head: () => {
    return {
      meta: [
        { title: "About Us — AZKOMOLY | 100% magyar mystery box" },
        {
          name: "description",
          content:
            "Ismerd meg az AZKOMOLY-t: 100% magyar csapat, eredeti termékek és meglepetés élmények minden dobozban.",
        },
        { property: "og:title", content: "About Us — AZKOMOLY" },
        {
          property: "og:description",
          content:
            "Ismerd meg az AZKOMOLY-t: 100% magyar csapat, eredeti termékek és meglepetés élmények minden dobozban.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [
        // Las fuentes se cargan una sola vez en __root.tsx (ver comentario ahí).
        ...seoLinksHuOnly("/about"),
      ],
    };
  },
  component: AboutPage,
});

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
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61590505527795", Icon: Facebook },
];

function AboutPage() {
  return (
    <main className="bg-background pt-16">
      <SiteNav />
      <SiteBreadcrumb trail={[{ name: "AZKOMOLY", path: "/" }, { name: "About Us" }]} />
      <AboutHero />
      <OurGoal />
      <WhoWeAre />
      {/* "Real unboxings" — vivía en Home, Diego pidió moverla acá tal cual
          estaba (mismo componente, sin cambios). */}
      <SocialProofMarquee />
      <FollowUs />
      <SiteFooter productsHref="/#termekek" />
    </main>
  );
}

function AboutHero() {
  return (
    <section className="bg-background px-6 pt-14 pb-12 sm:pt-20 sm:pb-16 flex flex-col items-center text-center gap-6">
      <Link to="/" aria-label="AZKOMOLY">
        <img
          src={logoAsset.url}
          alt="AZKOMOLY logó"
          className="h-24 sm:h-32 w-auto"
          style={{ filter: "brightness(0)" }}
        />
      </Link>
      <h1
        className="text-fire text-3d-fire text-[clamp(2.75rem,13vw,7rem)] uppercase"
        style={TITLE_STYLE}
      >
        About Us
      </h1>
      <p className="font-sans text-sm sm:text-base text-foreground/70 max-w-md">
        100% magyar mystery box csapat. Eredeti termékek, valódi meglepetés — semmi extra.
      </p>
    </section>
  );
}

function OurGoal() {
  return (
    <>
      {/* bgColor = color de la sección de abajo: el morado tiene que empezar
          DENTRO del divisor, si no la sección arranca después con el borde
          superior recto y se ve una línea horizontal debajo de la onda. */}
      <DripDivider variant="organic" mainColor="#FFFFFF" bgColor="#5B2EA8" shadowColor="#0D0D0D" depth={4} height={34} />
      <section className="bg-fire px-6 py-14 sm:py-20">
        <div className="mx-auto max-w-2xl flex flex-col gap-5 text-center sm:text-left">
          <h2
            className="text-white text-3d-fire text-[clamp(2rem,9vw,4rem)] uppercase"
            style={TITLE_STYLE}
          >
            Our Goal
          </h2>
          <p className="font-sans text-white/90 text-base sm:text-lg leading-relaxed">
            Az AZKOMOLY azért létezik, mert hiszünk abban, hogy a vásárlás lehet izgalmas is,
            nem csak praktikus. Minden doboz egy kis kockázat és egy nagy meglepetés — te
            választod a tétet, mi garantáljuk az értéket.
          </p>
          <p className="font-sans text-white/80 text-sm sm:text-base leading-relaxed">
            Nem akarunk még egy webshopot, ahol pontosan tudod, mi érkezik. Azt akarjuk,
            hogy amikor kibontod a dobozod, tényleg érezd azt a pillanatot — mintha ajándékot
            kapnál magadtól.
          </p>
        </div>
      </section>
    </>
  );
}

function WhoWeAre() {
  return (
    <>
      <DripDivider variant="organic" mainColor="#5B2EA8" bgColor="#FFFFFF" shadowColor="#0D0D0D" depth={4} height={34} />
      <section className="bg-background px-6 py-14 sm:py-20">
        <div className="mx-auto max-w-2xl flex flex-col gap-5 text-center sm:text-left">
          <h2
            className="text-fire text-3d-fire text-[clamp(2rem,9vw,4rem)] uppercase"
            style={TITLE_STYLE}
          >
            Who We Are
          </h2>
          <p className="font-sans text-foreground text-base sm:text-lg leading-relaxed">
            <strong>100% magyar vállalkozás vagyunk</strong>, és minden, amit árulunk,{" "}
            <strong>eredeti termék</strong>.
          </p>
          <p className="font-sans text-foreground/80 text-base leading-relaxed">
            Az AZKOMOLY egy maroknyi magyar csapat ötletéből indult, akiket idegesített, hogy
            a legtöbb webshopban semmi meglepetés nincs a vásárlásban. Elkezdtünk liquidation
            és túlkészletezett tételekből válogatni, és mystery boxokba rendezni őket — így
            minden doboz garantáltan minőségi, eredeti terméket tartalmaz, de sosem tudod
            pontosan, mit kapsz.
          </p>
          <div className="flex flex-wrap gap-3 justify-center sm:justify-start pt-2">
            <span className="rounded-full bg-fire text-white font-sans text-sm px-5 py-2 btn-drip">
              100% magyar
            </span>
            <span className="rounded-full bg-fire text-white font-sans text-sm px-5 py-2 btn-drip">
              Eredeti termékek
            </span>
          </div>
          <div className="pt-4 flex justify-center sm:justify-start">
            <Link
              to="/"
              className="rounded-full bg-fire text-white font-sans font-semibold tracking-wide uppercase px-7 py-3 btn-drip"
            >
              Nézd meg a dobozainkat
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function FollowUs() {
  return (
    <>
      <DripDivider variant="organic" mainColor="#FFFFFF" bgColor="#5B2EA8" shadowColor="#0D0D0D" depth={4} height={34} />
      <section className="bg-fire px-6 py-14 sm:py-20 flex flex-col items-center text-center gap-6">
        <img
          src={logoAsset.url}
          alt=""
          aria-hidden
          className="h-16 w-auto"
          style={{ filter: "brightness(0) invert(1)" }}
        />
        <h2
          className="text-white text-3d-fire text-[clamp(2rem,9vw,4rem)] uppercase"
          style={TITLE_STYLE}
        >
          Follow Us
        </h2>
        <p className="font-sans text-white/85 max-w-md text-sm sm:text-base">
          Kövesd az AZKOMOLY-t a közösségi médiában — minden unboxingot ott osztunk meg elsőként.
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
    </>
  );
}

