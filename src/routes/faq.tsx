import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Instagram, Facebook, Youtube } from "lucide-react";
import { DripDivider } from "@/components/DripDivider";
import { useT } from "@/lib/i18n";
import { DICTIONARIES } from "@/lib/i18n/dictionary";
import { seoLinksHuOnly, jsonLd, faqSchema } from "@/lib/seo";
import logoAsset from "@/assets/azkomoly-logo.png.asset.json";

export const Route = createFileRoute("/faq")({
  head: () => {
    return {
      meta: [
        { title: "GYIK — AZKOMOLY mystery box kérdések és válaszok" },
        {
          name: "description",
          content:
            "Szállítás, mystery box működése, visszaküldés és fizetés — minden gyakori kérdés egy helyen az AZKOMOLY-nál.",
        },
        { property: "og:title", content: "GYIK — AZKOMOLY" },
        {
          property: "og:description",
          content:
            "Szállítás, mystery box működése, visszaküldés és fizetés — minden gyakori kérdés egy helyen.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [
        // Las fuentes se cargan una sola vez en __root.tsx (ver comentario ahí).
        ...seoLinksHuOnly("/faq"),
      ],
      // El FAQ real (7 pares Q/A del diccionario) vivía como schema en la
      // landing; se mudó acá con el contenido visible.
      scripts: [jsonLd(faqSchema(DICTIONARIES.hu.faq.items, "hu"))],
    };
  },
  component: FaqPage,
});

const TITLE_STYLE = {
  fontFamily: "'Anton', var(--font-display)",
  letterSpacing: "-0.02em",
  lineHeight: 0.85,
} as const;

const CONTACT_EMAIL = "azkomoly.hu@gmail.com";

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

function FaqPage() {
  return (
    <main className="bg-background">
      <FaqHero />
      <FaqAccordion />
      <NeedHelp />
      <Footer />
    </main>
  );
}

function FaqHero() {
  return (
    <section className="bg-background px-6 pt-14 pb-10 sm:pt-20 sm:pb-14 flex flex-col items-center text-center gap-6">
      <Link to="/" aria-label="AZKOMOLY">
        <img
          src={logoAsset.url}
          alt="AZKOMOLY logó"
          className="h-24 sm:h-32 w-auto"
          style={{ filter: "brightness(0)" }}
        />
      </Link>
      <h1 className="text-fire text-3d-fire text-[clamp(3rem,15vw,7rem)] uppercase" style={TITLE_STYLE}>
        FAQ
      </h1>
      <p className="font-sans text-sm sm:text-base text-foreground/70 max-w-md">
        [Placeholder — rövid bevezető: itt megtalálod a leggyakoribb kérdéseket.]
      </p>
    </section>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`rounded-2xl border overflow-hidden ${
        open ? "border-fire/60 bg-fire/5" : "border-cardboard/30 bg-dark-bg"
      } transition-all duration-300`}
    >
      <button
        type="button"
        className="w-full flex items-center justify-between p-5 text-left gap-4"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-display text-base sm:text-lg text-foreground">{q}</span>
        <span
          className="shrink-0 font-display text-2xl text-fire transition-transform duration-300"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
          aria-hidden
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

function FaqAccordion() {
  // Tal cual salió de la home (mismos 7 pares Q/A del diccionario) —
  // pendiente de rediseñar/categorizar en una próxima sesión.
  const t = useT();
  return (
    <section className="bg-background px-6 pb-16">
      <div className="mx-auto max-w-3xl flex flex-col gap-2">
        {t.faq.items.map((f) => (
          <FAQItem key={f.q} q={f.q} a={f.a} />
        ))}
      </div>
    </section>
  );
}

function NeedHelp() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const message = String(form.get("message") ?? "");
    const body = `Név: ${name}\nEmail: ${email}\n\n${message}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      "AZKOMOLY — kérdés",
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <>
      {/* bgColor = color de la sección de abajo: sin esto el morado arranca
          después del divisor con el borde recto y se ve la línea horizontal. */}
      <DripDivider variant="organic" mainColor="#FFFFFF" bgColor="#5B2EA8" shadowColor="#0D0D0D" depth={4} height={34} />
      <section className="bg-fire px-6 py-14 sm:py-20">
        <div className="mx-auto max-w-xl flex flex-col gap-6 text-center">
          <h2 className="text-white text-3d-fire text-[clamp(2rem,9vw,3.5rem)] uppercase" style={TITLE_STYLE}>
            Still need help?
          </h2>
          <p className="font-sans text-white/85 text-sm sm:text-base">
            [Placeholder — írj nekünk, és 24 órán belül válaszolunk.]
          </p>

          <form onSubmit={onSubmit} className="flex flex-col gap-3 text-left">
            <input
              name="name"
              required
              placeholder="Név"
              className="rounded-2xl bg-white/95 text-black font-sans text-base px-4 py-3 outline-none focus:ring-2 focus:ring-black/40"
            />
            <input
              name="email"
              type="email"
              required
              placeholder="Email"
              className="rounded-2xl bg-white/95 text-black font-sans text-base px-4 py-3 outline-none focus:ring-2 focus:ring-black/40"
            />
            <textarea
              name="message"
              required
              rows={4}
              placeholder="Üzenet"
              className="rounded-2xl bg-white/95 text-black font-sans text-base px-4 py-3 outline-none focus:ring-2 focus:ring-black/40 resize-none"
            />
            <button
              type="submit"
              className="rounded-full bg-fire text-white border-2 border-white/60 font-sans font-semibold uppercase tracking-wide px-7 py-3 btn-drip hover:border-black self-center"
            >
              Email us!
            </button>
          </form>

          {sent && (
            <p className="font-sans text-xs text-white/80">
              [Placeholder — megnyitottuk a levelezőprogramod. Ha nem indult el, írj ide:]{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
                {CONTACT_EMAIL}
              </a>
            </p>
          )}

          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-sans text-xs text-white/70 hover:text-white underline"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
      </section>
    </>
  );
}

function Footer() {
  const t = useT();
  return (
    <footer className="bg-fire px-6 pt-6 pb-12 flex flex-col items-center gap-4">
      <p className="font-display text-white text-lg tracking-wider">{t.footer.follow}</p>
      <div className="flex gap-4 flex-wrap justify-center">
        {SOCIALS.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="h-12 w-12 rounded-2xl grid place-items-center border-2 border-white/50 text-white hover:text-black hover:border-black hover:-translate-y-0.5 transition-all"
          >
            <Icon className="h-6 w-6" />
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
  );
}
