import { useState, type FormEvent } from "react";

import { DripDivider } from "@/components/DripDivider";
import { SiteFooter } from "@/components/SiteFooter";
import { useT, useI18n } from "@/lib/i18n";

/** Cuerpo compartido de /faq y /en/faq — todo el copy sale del diccionario. */
const TITLE_STYLE = {
  fontFamily: "'Anton', var(--font-display)",
  letterSpacing: "-0.02em",
  lineHeight: 0.85,
} as const;

const CONTACT_EMAIL = "azkomoly.hu@gmail.com";

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

function NeedHelp() {
  const t = useT();
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const message = String(form.get("message") ?? "");
    const body = `${t.faqPage.fieldName}: ${name}\n${t.faqPage.fieldEmail}: ${email}\n\n${message}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      "AZKOMOLY",
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <>
      <DripDivider variant="organic" mainColor="#FFFFFF" bgColor="#5B2EA8" shadowColor="#0D0D0D" depth={4} height={34} />
      <section id="faq-help" className="bg-fire px-6 py-14 sm:py-20">
        <div className="mx-auto max-w-xl flex flex-col gap-6 text-center">
          <h2 className="text-white text-[clamp(2rem,9vw,3.5rem)] uppercase" style={TITLE_STYLE}>
            {t.faqPage.helpTitle}
          </h2>
          <p className="font-sans text-white/85 text-sm sm:text-base">{t.faqPage.helpSub}</p>

          <form onSubmit={onSubmit} className="flex flex-col gap-3 text-left">
            <input
              name="name"
              required
              placeholder={t.faqPage.fieldName}
              className="rounded-2xl bg-white/95 text-black font-sans text-base px-4 py-3 outline-none focus:ring-2 focus:ring-black/40"
            />
            <input
              name="email"
              type="email"
              required
              placeholder={t.faqPage.fieldEmail}
              className="rounded-2xl bg-white/95 text-black font-sans text-base px-4 py-3 outline-none focus:ring-2 focus:ring-black/40"
            />
            <textarea
              name="message"
              required
              rows={4}
              placeholder={t.faqPage.fieldMessage}
              className="rounded-2xl bg-white/95 text-black font-sans text-base px-4 py-3 outline-none focus:ring-2 focus:ring-black/40 resize-none"
            />
            <button
              type="submit"
              className="rounded-full bg-fire text-white border-2 border-white/60 font-sans font-semibold uppercase tracking-wide px-7 py-3 btn-drip hover:border-black self-center"
            >
              {t.faqPage.send}
            </button>
          </form>

          {sent && (
            <p className="font-sans text-xs text-white/80">
              {t.faqPage.mailFallback}{" "}
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

export function FaqPageBody() {
  const t = useT();
  const { lang } = useI18n();
  const homeHref = lang === "hu" ? "/" : "/en";

  return (
    <main className="bg-background pt-16">
      {/* Sin breadcrumb: se leía como una barra de "volver" redundante —
          el navbar ya cubre esa navegación (pedido de Diego). */}

      <section id="faq-intro" className="bg-background px-6 pt-14 pb-10 sm:pt-20 sm:pb-14 flex flex-col items-center text-center gap-6">
        <a href={homeHref} aria-label="AZKOMOLY">
          <img src="/azkomoly_new_logo.webp" alt="AZKOMOLY" className="h-24 sm:h-32 w-auto" />
        </a>
        {/* Sin relieve negro: el morado plano se lee mucho mejor. */}
        <h1 className="text-fire text-[clamp(3rem,15vw,7rem)] uppercase" style={TITLE_STYLE}>
          {t.faqPage.title}
        </h1>
        <p className="font-sans text-sm sm:text-base text-foreground/70 max-w-md">
          {t.faqPage.intro}
        </p>
      </section>

      <section id="faq-list" className="bg-background px-6 pb-16">
        <div className="mx-auto max-w-3xl flex flex-col gap-2">
          {t.faq.items.map((f) => (
            <FAQItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </section>

      <NeedHelp />
      <SiteFooter productsHref={`${homeHref === "/" ? "" : homeHref}/#termekek`} />
    </main>
  );
}
