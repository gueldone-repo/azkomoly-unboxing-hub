import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { DripDivider } from "@/components/DripDivider";
import { SiteBreadcrumb } from "@/components/SiteBreadcrumb";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/nav/SiteNav";
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

function FaqPage() {
  return (
    <main className="bg-background pt-16">
      <SiteNav />
      <SiteBreadcrumb trail={[{ name: "AZKOMOLY", path: "/" }, { name: "FAQ" }]} />
      <FaqHero />
      <FaqAccordion />
      <NeedHelp />
      <SiteFooter productsHref="/#termekek" />
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
        Minden, amit a mystery boxokról tudni érdemes — szállítás, méret, tartalom és minden,
        ami eddig kérdés volt.
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
            Nem találtad meg a válaszod? Írj nekünk, és 24 órán belül válaszolunk.
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
              Megnyitottuk a leveleződ. Ha nem indult el automatikusan, írj ide közvetlenül:{" "}
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

