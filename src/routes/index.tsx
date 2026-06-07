import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { appendLeadToSheet } from "@/lib/leads.functions";
import { Instagram, Facebook, Youtube, ShieldCheck, Truck, Sparkles, RefreshCcw } from "lucide-react";
import { CookieBanner } from "@/components/CookieBanner";
import { ScrubBackdrop } from "@/components/ScrubBackdrop";
import { HeroOverlay } from "@/components/HeroOverlay";
import { PromoBanner } from "@/components/shop/PromoBanner";
import { ProductCard } from "@/components/shop/ProductCard";
import { SocialProof } from "@/components/shop/SocialProof";
import { MOCK_PRODUCTS } from "@/lib/mock-products";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AZKOMOLY — Mi van a dobozban?" },
      {
        name: "description",
        content:
          "AZKOMOLY mystery box: márkás ruhák, véletlenszerű tartalom, nevetséges áron. Válassz dobozt, fizess, kapd meg, nyisd ki.",
      },
      { property: "og:title", content: "AZKOMOLY — Mi van a dobozban?" },
      {
        property: "og:description",
        content: "Márkás ruhák. Véletlenszerű tartalom. Nevetséges áron.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Space+Grotesk:wght@400;500;700&display=swap",
      },
    ],
  }),
  component: Landing,
});

const COUNTRY_CODES: { code: string; label: string; flag: string }[] = [
  { code: "+36", label: "Magyarország", flag: "🇭🇺" },
  { code: "+52", label: "México", flag: "🇲🇽" },
  { code: "+1", label: "USA / Canada", flag: "🇺🇸" },
  { code: "+34", label: "España", flag: "🇪🇸" },
  { code: "+44", label: "United Kingdom", flag: "🇬🇧" },
  { code: "+49", label: "Deutschland", flag: "🇩🇪" },
  { code: "+33", label: "France", flag: "🇫🇷" },
  { code: "+39", label: "Italia", flag: "🇮🇹" },
  { code: "+43", label: "Österreich", flag: "🇦🇹" },
  { code: "+40", label: "România", flag: "🇷🇴" },
  { code: "+421", label: "Slovensko", flag: "🇸🇰" },
  { code: "+420", label: "Česko", flag: "🇨🇿" },
  { code: "+48", label: "Polska", flag: "🇵🇱" },
  { code: "+385", label: "Hrvatska", flag: "🇭🇷" },
  { code: "+31", label: "Nederland", flag: "🇳🇱" },
  { code: "+32", label: "België", flag: "🇧🇪" },
  { code: "+41", label: "Schweiz", flag: "🇨🇭" },
];

const signupSchema = z.object({
  name: z.string().trim().min(1, "Add meg a neved.").max(120),
  email: z.string().trim().email("Érvénytelen email cím.").max(255),
  phone: z
    .string()
    .trim()
    .max(32)
    .regex(/^[0-9 ()\-]*$/, "Csak számok megengedettek.")
    .optional()
    .or(z.literal("")),
});

function Landing() {
  const [open, setOpen] = useState(false);

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <TopNav />

      {/* Hero + promo banner share the scroll-scrub video as backdrop */}
      <ScrubBackdrop>
        <HeroOverlay onCta={() => setOpen(true)} />
        <PromoBanner />
        <ProductsSection />
      </ScrubBackdrop>

      <ValueProps />
      <SocialProof />
      <HowItWorks />
      <BigCTA onCta={() => setOpen(true)} />
      <FAQSection />

      <div className="px-6 pt-16 pb-12">
        <Footer />
      </div>

      <SignupDialog open={open} onOpenChange={setOpen} />
      <CookieBanner />
    </main>
  );
}

function TopNav() {
  return (
    <nav className="sticky top-0 z-40 bg-dark-bg/85 backdrop-blur border-b-2 border-fire/40">
      <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
        <a href="#top" className="font-display text-2xl text-fire text-fire-glow">
          AZKOMOLY
        </a>
        <div className="flex items-center gap-5 font-sans text-sm">
          <a href="#termekek" className="text-foreground hover:text-fire">
            Bolt
          </a>
          <a href="#hogyan" className="text-foreground/80 hover:text-fire hidden sm:inline">
            Hogyan működik
          </a>
          <a href="#gyik" className="text-foreground/80 hover:text-fire hidden sm:inline">
            GYIK
          </a>
        </div>
      </div>
    </nav>
  );
}

function ProductsSection() {
  return (
    <section id="termekek" className="relative bg-dark-bg/15 backdrop-blur-[2px]">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <p className="font-sans text-xs tracking-[0.35em] text-fire mb-2">
              VÁLASZD A TÉTEDET
            </p>
            <h2 className="font-display text-4xl sm:text-5xl text-foreground">
              A dobozaink
            </h2>
          </div>
          <p className="font-sans text-sm text-foreground/60 max-w-sm">
            Minél nagyobb a doboz, annál nagyobb a dobás. Minden tier garantált
            minimum értékkel.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {MOCK_PRODUCTS.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ValueProps() {
  const items = [
    { Icon: ShieldCheck, title: "100% MÁRKÁS", text: "Csak igazolt brand cucc. Nincs gagyi, nincs replika." },
    { Icon: Sparkles, title: "GARANTÁLT ÉRTÉK", text: "Minden doboz tartalmának értéke meghaladja az árát." },
    { Icon: Truck, title: "GYORS SZÁLLÍTÁS", text: "2–4 munkanap egész Magyarországon. Foxpost / GLS." },
    { Icon: RefreshCcw, title: "14 NAP GARANCIA", text: "Ha valami sérült érkezik, cseréljük. Egyszerűen." },
  ];
  return (
    <section className="bg-dark-bg border-y border-cardboard/30 py-14">
      <div className="mx-auto max-w-7xl px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map(({ Icon, title, text }) => (
          <div key={title} className="flex gap-4 items-start">
            <span className="shrink-0 grid place-items-center h-12 w-12 border-2 border-fire/60 text-fire">
              <Icon className="h-6 w-6" />
            </span>
            <div>
              <h3 className="font-display text-lg text-foreground tracking-wider">{title}</h3>
              <p className="font-sans text-sm text-foreground/70 mt-1">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", title: "VÁLASSZ DOBOZT", text: "Mini, Klasszikus, Prémium vagy Legendás. Te döntöd el a tétet." },
    { n: "02", title: "FIZESS", text: "Bankkártya, Apple Pay, Google Pay. 2 perc az egész." },
    { n: "03", title: "VÁRJ 2–4 NAPOT", text: "Becsomagoljuk, elküldjük, jön a postás." },
    { n: "04", title: "NYISD KI", text: "Vedd fel kamerával. Posztold. Címkézz be minket." },
  ];
  return (
    <section id="hogyan" className="bg-background">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <p className="font-sans text-xs tracking-[0.35em] text-fire mb-2 text-center">
          4 LÉPÉS
        </p>
        <h2 className="font-display text-4xl sm:text-5xl text-foreground text-center mb-12">
          Hogyan működik?
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s) => (
            <div key={s.n} className="relative bg-dark-bg border-2 border-cardboard/50 p-6 hover:border-fire transition-colors">
              <span className="absolute -top-5 -left-2 font-display text-6xl text-fire/30 leading-none">
                {s.n}
              </span>
              <h3 className="font-display text-2xl text-foreground mt-6">{s.title}</h3>
              <p className="font-sans text-sm text-foreground/70 mt-2 leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BigCTA({ onCta }: { onCta: () => void }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-fire" />
      <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(-45deg,transparent_0_24px,oklch(0.14_0_0/0.4)_24px_26px)]" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 text-center">
        <p className="font-display text-primary-foreground text-base sm:text-lg tracking-[0.4em] mb-4">
          NE OLVASS · NYISS
        </p>
        <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl text-primary-foreground text-stroke-black leading-[0.9]">
          AZ ELSŐ DOBOZ<br />MOST INDUL
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="#termekek"
            className="inline-block bg-dark-bg text-fire font-display text-xl sm:text-2xl px-10 py-5 border-4 border-dark-bg hover:bg-foreground hover:text-dark-bg transition-colors"
          >
            MUTASD A DOBOZOKAT →
          </a>
          <button
            onClick={onCta}
            className="inline-block bg-transparent text-primary-foreground font-display text-xl sm:text-2xl px-10 py-5 border-4 border-dark-bg hover:bg-dark-bg hover:text-fire transition-colors"
          >
            ÉRTESÍTSETEK
          </button>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const faqs = [
    { q: "Mi van a dobozban?", a: "Márkás ruhák és kiegészítők. A tartalom véletlenszerű, de minden doboz minimum érték garantált — a tartalom értéke meghaladja a doboz árát." },
    { q: "Választhatok méretet?", a: "Igen. A vásárlás során megadod a méreted (S/M/L/XL), és csak abban a méretben kapsz ruhát." },
    { q: "Mi van, ha nem tetszik?", a: "14 napon belül visszaküldheted bontatlanul. Sérült termék esetén cseréljük." },
    { q: "Mennyi a szállítás?", a: "Foxpost: 1490 Ft. GLS házhoz: 1990 Ft. 20.000 Ft feletti rendelés ingyenes." },
    { q: "Mikor érkeznek új dobozok?", a: "Minden vasárnap 20:00-kor új drop. Iratkozz fel, hogy elsőként szólj." },
  ];
  return (
    <section id="gyik" className="bg-background">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <p className="font-sans text-xs tracking-[0.35em] text-fire mb-2 text-center">
          GYAKORI KÉRDÉSEK
        </p>
        <h2 className="font-display text-4xl sm:text-5xl text-foreground text-center mb-10">
          Még valami?
        </h2>
        <div className="space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="group bg-dark-bg border-2 border-cardboard/40 hover:border-fire/60 transition-colors">
              <summary className="cursor-pointer list-none flex items-center justify-between p-5">
                <span className="font-display text-lg text-foreground">{f.q}</span>
                <span className="font-display text-2xl text-fire group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="px-5 pb-5 font-sans text-sm text-foreground/80 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

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

function Footer() {
  return (
    <footer className="mt-16 pt-8 border-t border-cardboard/30 flex flex-col items-center gap-4">
      <p className="font-display text-fire text-lg tracking-wider">KÖVESS MINKET</p>
      <div className="flex gap-4 flex-wrap justify-center">
        {SOCIALS.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="h-12 w-12 grid place-items-center border-2 border-cardboard/60 text-cardboard hover:text-fire hover:border-fire hover:-translate-y-0.5 transition-all"
          >
            <Icon className="h-6 w-6" />
          </a>
        ))}
      </div>
      <nav className="flex flex-wrap gap-x-4 gap-y-1 justify-center font-sans text-xs text-muted-foreground mt-2">
        <Link to="/privacy" className="hover:text-fire">Adatvédelem</Link>
        <span>·</span>
        <Link to="/terms" className="hover:text-fire">Felhasználási feltételek</Link>
        <span>·</span>
        <Link to="/cookies" className="hover:text-fire">Süti szabályzat</Link>
      </nav>
      <p className="font-sans text-xs text-muted-foreground">
        © 2026 <span className="font-display text-fire">AZKOMOLY</span>
      </p>
    </footer>
  );
}

function SignupDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+36");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const appendToSheet = useServerFn(appendLeadToSheet);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!consent) {
      setStatus("error");
      setMessage("El kell fogadnod a feltételeket és az adatvédelmi tájékoztatót.");
      return;
    }
    const parsed = signupSchema.safeParse({ name, email, phone });
    if (!parsed.success) {
      setStatus("error");
      setMessage(parsed.error.issues[0]?.message ?? "Érvénytelen adat.");
      return;
    }
    setStatus("loading");
    setMessage("");

    const phoneTrim = parsed.data.phone?.trim();
    const emailLower = parsed.data.email.toLowerCase();
    const { error } = await supabase.from("azkomoly_leads").insert({
      name: parsed.data.name,
      email: emailLower,
      phone: phoneTrim ? phoneTrim : null,
      phone_country_code: phoneTrim ? countryCode : null,
      source: "landing",
    });

    if (error && error.code !== "23505") {
      setStatus("error");
      setMessage("Hiba történt. Próbáld újra.");
      return;
    }

    appendToSheet({
      data: {
        name: parsed.data.name,
        email: emailLower,
        countryCode: phoneTrim ? countryCode : null,
        phone: phoneTrim || null,
      },
    }).catch((err) => console.error("Sheet append error", err));

    if (error?.code === "23505") {
      setStatus("success");
      setMessage("✅ Már fent vagy a listán!");
      return;
    }
    setStatus("success");
    setMessage("✅ Bent vagy! Hamarosan nyílik a doboz.");
    setName("");
    setEmail("");
    setPhone("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-dark-bg border-fire/60 graffiti-border w-[94vw] max-w-md p-5 sm:p-6">
        <DialogHeader className="pb-1">
          <DialogTitle className="font-display text-2xl sm:text-3xl text-fire text-fire-glow text-center">
            FELIRATKOZÁS
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:gap-4 mt-1">
          <div>
            <label htmlFor="name" className="block font-sans text-sm text-white mb-1">Név</label>
            <input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={120}
              placeholder="Név"
              className="w-full bg-background border-2 border-cardboard/60 focus:border-fire text-white px-4 py-3 text-base font-sans focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-sans text-sm text-white mb-1">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={255}
              placeholder="te@email.hu"
              className="w-full bg-background border-2 border-cardboard/60 focus:border-fire text-white px-4 py-3 text-base font-sans focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block font-sans text-sm text-white mb-1">
              Telefon <span className="text-muted-foreground">(opcionális)</span>
            </label>
            <div className="flex gap-2">
              <Select value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger className="w-[110px] sm:w-[130px] shrink-0 bg-background border-2 border-cardboard/60 text-white font-sans py-3 px-3 text-base min-h-[52px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-dark-bg border-cardboard/60 text-white max-h-72 min-w-[180px]">
                  {COUNTRY_CODES.map((c) => (
                    <SelectItem key={c.code} value={c.code} className="font-sans text-base">
                      <span className="mr-2">{c.flag}</span>
                      {c.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={32}
                placeholder="20 123 4567"
                className="flex-1 min-w-0 bg-background border-2 border-cardboard/60 focus:border-fire text-white px-4 py-3 text-base font-sans focus:outline-none transition-colors min-h-[52px]"
              />
            </div>
          </div>

          <label className="flex items-start gap-2 text-xs sm:text-sm text-white/90 font-sans">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 accent-fire"
              required
            />
            <span>
              Elfogadom a{" "}
              <Link to="/terms" className="text-fire underline" target="_blank">feltételeket</Link>{" "}
              és az{" "}
              <Link to="/privacy" className="text-fire underline" target="_blank">adatvédelmi tájékoztatót</Link>
              . Hozzájárulok, hogy adataimat <strong>marketing célokra</strong> felhasználjátok.
            </span>
          </label>

          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-1 sm:mt-2 bg-fire text-primary-foreground font-display text-lg sm:text-xl px-6 py-4 graffiti-border hover:translate-y-[-2px] transition-transform disabled:opacity-60"
          >
            {status === "loading" ? "..." : "KÜLDÉS"}
          </button>

          {message && (
            <p
              role="status"
              className={`font-sans text-sm text-center ${status === "success" ? "text-fire" : "text-destructive"}`}
            >
              {message}
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
