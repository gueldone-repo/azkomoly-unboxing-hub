import { createFileRoute, Link } from "@tanstack/react-router";
import { PromoBanner } from "@/components/shop/PromoBanner";
import { ProductCard } from "@/components/shop/ProductCard";
import { SocialProof } from "@/components/shop/SocialProof";
import { MOCK_PRODUCTS } from "@/lib/mock-products";
import { ShieldCheck, Truck, Sparkles, RefreshCcw } from "lucide-react";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Bolt — AZKOMOLY mystery boxok" },
      {
        name: "description",
        content:
          "Mystery box-ok kategóriánként. Márkás cuccok, véletlenszerű tartalom, garantált érték. Drop #002 vasárnap.",
      },
      { property: "og:title", content: "AZKOMOLY · Bolt" },
      {
        property: "og:description",
        content: "Mystery box-ok kategóriánként. Drop #002 vasárnap.",
      },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  return (
    <main className="bg-background text-foreground">
      <ShopNav />

      <HeroBanner />

      <PromoBanner />

      <ProductsSection />

      <ValueProps />

      <SocialProof />

      <HowItWorks />

      <BigCTA />

      <FAQSection />

      <ShopFooter />
    </main>
  );
}

function ShopNav() {
  return (
    <nav className="sticky top-0 z-40 bg-dark-bg/95 backdrop-blur border-b-2 border-fire/40">
      <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl text-fire text-fire-glow">
          AZKOMOLY
        </Link>
        <div className="flex items-center gap-5 font-sans text-sm">
          <Link to="/shop" className="text-foreground hover:text-fire">
            Bolt
          </Link>
          <a href="#hogyan" className="text-foreground/80 hover:text-fire hidden sm:inline">
            Hogyan működik
          </a>
          <a href="#gyik" className="text-foreground/80 hover:text-fire hidden sm:inline">
            GYIK
          </a>
          <button className="relative bg-fire text-primary-foreground font-display px-4 py-2 graffiti-border">
            KOSÁR
            <span className="absolute -top-2 -right-2 bg-dark-bg text-fire border-2 border-fire text-xs h-6 w-6 grid place-items-center rounded-full font-sans">
              0
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}

function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-dark-bg">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_30%_20%,oklch(0.78_0.17_70/0.4),transparent_60%),radial-gradient(ellipse_at_80%_80%,oklch(0.66_0.12_65/0.3),transparent_60%)]" />
      <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(0deg,transparent_0_40px,oklch(0.78_0.17_70/0.5)_40px_41px)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-24 grid lg:grid-cols-[1.3fr_1fr] gap-10 items-center">
        <div>
          <span className="inline-block bg-fire/20 border border-fire/60 text-fire font-sans text-xs tracking-[0.3em] px-3 py-1 mb-5">
            DROP #002 · ÉLŐ
          </span>
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl text-foreground leading-[0.9]">
            MI VAN A<br />
            <span className="text-fire text-fire-glow">DOBOZBAN?</span>
          </h1>
          <p className="font-sans text-base sm:text-lg text-foreground/80 mt-6 max-w-lg">
            Márkás ruhák. Véletlenszerű tartalom. Nevetséges áron. Válassz
            kategóriát, fizess, kapd meg, nyisd ki. Ennyi.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#termekek"
              className="bg-fire text-primary-foreground font-display text-xl px-8 py-4 graffiti-border hover:translate-y-[-2px] transition-transform"
            >
              MUTASD A DOBOZOKAT
            </a>
            <a
              href="#hogyan"
              className="border-2 border-cardboard/60 text-foreground font-display text-xl px-8 py-4 hover:border-fire hover:text-fire transition-colors"
            >
              HOGYAN MŰKÖDIK?
            </a>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 font-sans text-xs text-foreground/70 tracking-widest">
            <span>✓ INGYENES SZÁLLÍTÁS 20E FT FELETT</span>
            <span>✓ 14 NAPOS GARANCIA</span>
            <span>✓ 100% MÁRKÁS</span>
          </div>
        </div>

        {/* Visual stack */}
        <div className="relative h-[380px] sm:h-[460px] hidden lg:block">
          <div className="absolute top-2 left-2 w-56 h-56 bg-cardboard graffiti-border rotate-[-8deg]" />
          <div className="absolute top-20 left-32 w-56 h-56 bg-fire graffiti-border rotate-[6deg] grid place-items-center">
            <span className="font-display text-9xl text-primary-foreground text-stroke-black">
              ?
            </span>
          </div>
          <div className="absolute bottom-2 right-2 w-44 h-44 bg-cardboard/60 graffiti-border rotate-[12deg]" />
        </div>
      </div>
    </section>
  );
}

function ProductsSection() {
  return (
    <section id="termekek" className="mx-auto max-w-7xl px-6 py-20">
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
    </section>
  );
}

function ValueProps() {
  const items = [
    {
      Icon: ShieldCheck,
      title: "100% MÁRKÁS",
      text: "Csak igazolt brand cucc. Nincs gagyi, nincs replika.",
    },
    {
      Icon: Sparkles,
      title: "GARANTÁLT ÉRTÉK",
      text: "Minden doboz tartalmának értéke meghaladja az árát.",
    },
    {
      Icon: Truck,
      title: "GYORS SZÁLLÍTÁS",
      text: "2–4 munkanap egész Magyarországon. Foxpost / GLS.",
    },
    {
      Icon: RefreshCcw,
      title: "14 NAP GARANCIA",
      text: "Ha valami sérült érkezik, cseréljük. Egyszerűen.",
    },
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
              <h3 className="font-display text-lg text-foreground tracking-wider">
                {title}
              </h3>
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
    {
      n: "01",
      title: "VÁLASSZ DOBOZT",
      text: "Mini, Klasszikus, Prémium vagy Legendás. Te döntöd el a tétet.",
    },
    {
      n: "02",
      title: "FIZESS",
      text: "Bankkártya, Apple Pay, Google Pay. 2 perc az egész.",
    },
    {
      n: "03",
      title: "VÁRJ 2–4 NAPOT",
      text: "Becsomagoljuk, elküldjük, jön a postás.",
    },
    {
      n: "04",
      title: "NYISD KI",
      text: "Vedd fel kamerával. Posztold. Címkézz be minket. Lehetsz a következő drop arca.",
    },
  ];
  return (
    <section id="hogyan" className="mx-auto max-w-7xl px-6 py-20">
      <p className="font-sans text-xs tracking-[0.35em] text-fire mb-2 text-center">
        4 LÉPÉS
      </p>
      <h2 className="font-display text-4xl sm:text-5xl text-foreground text-center mb-12">
        Hogyan működik?
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {steps.map((s) => (
          <div
            key={s.n}
            className="relative bg-dark-bg border-2 border-cardboard/50 p-6 hover:border-fire transition-colors"
          >
            <span className="absolute -top-5 -left-2 font-display text-6xl text-fire/30 leading-none">
              {s.n}
            </span>
            <h3 className="font-display text-2xl text-foreground mt-6">
              {s.title}
            </h3>
            <p className="font-sans text-sm text-foreground/70 mt-2 leading-relaxed">
              {s.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function BigCTA() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-fire" />
      <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(-45deg,transparent_0_24px,oklch(0.14_0_0/0.4)_24px_26px)]" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 text-center">
        <p className="font-display text-primary-foreground text-base sm:text-lg tracking-[0.4em] mb-4">
          NE OLVASS · NYISS
        </p>
        <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl text-primary-foreground text-stroke-black leading-[0.9]">
          AZ ELSŐ DOBOZ
          <br />
          MOST INDUL
        </h2>
        <a
          href="#termekek"
          className="inline-block mt-10 bg-dark-bg text-fire font-display text-xl sm:text-2xl px-10 py-5 border-4 border-dark-bg hover:bg-foreground hover:text-dark-bg transition-colors"
        >
          MUTASD A DOBOZOKAT →
        </a>
      </div>
    </section>
  );
}

function FAQSection() {
  const faqs = [
    {
      q: "Mi van a dobozban?",
      a: "Márkás ruhák és kiegészítők. A pontos tartalom véletlenszerű, de minden doboz minimum érték garantált — a tartalom értéke meghaladja a doboz árát.",
    },
    {
      q: "Választhatok méretet?",
      a: "Igen. A vásárlás során megadod a méreted (S/M/L/XL), és csak abban a méretben kapsz ruhát.",
    },
    {
      q: "Mi van, ha nem tetszik?",
      a: "14 napon belül visszaküldheted bontatlanul. Sérült termék esetén cseréljük.",
    },
    {
      q: "Mennyi a szállítás?",
      a: "Foxpost: 1490 Ft. GLS házhoz: 1990 Ft. 20.000 Ft feletti rendelés ingyenes.",
    },
    {
      q: "Mikor érkeznek új dobozok?",
      a: "Minden vasárnap 20:00-kor új drop. Iratkozz fel a hírlevélre, hogy elsőként szólj.",
    },
  ];
  return (
    <section id="gyik" className="mx-auto max-w-3xl px-6 py-20">
      <p className="font-sans text-xs tracking-[0.35em] text-fire mb-2 text-center">
        GYAKORI KÉRDÉSEK
      </p>
      <h2 className="font-display text-4xl sm:text-5xl text-foreground text-center mb-10">
        Még valami?
      </h2>
      <div className="space-y-3">
        {faqs.map((f) => (
          <details
            key={f.q}
            className="group bg-dark-bg border-2 border-cardboard/40 hover:border-fire/60 transition-colors"
          >
            <summary className="cursor-pointer list-none flex items-center justify-between p-5">
              <span className="font-display text-lg text-foreground">{f.q}</span>
              <span className="font-display text-2xl text-fire group-open:rotate-45 transition-transform">
                +
              </span>
            </summary>
            <p className="px-5 pb-5 font-sans text-sm text-foreground/80 leading-relaxed">
              {f.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

function ShopFooter() {
  return (
    <footer className="border-t border-cardboard/30 bg-dark-bg">
      <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-display text-fire text-xl">AZKOMOLY</p>
        <nav className="flex flex-wrap gap-x-4 gap-y-1 justify-center font-sans text-xs text-foreground/70">
          <Link to="/privacy" className="hover:text-fire">Adatvédelem</Link>
          <span>·</span>
          <Link to="/terms" className="hover:text-fire">Feltételek</Link>
          <span>·</span>
          <Link to="/cookies" className="hover:text-fire">Sütik</Link>
        </nav>
        <p className="font-sans text-xs text-foreground/60">© 2026 AZKOMOLY</p>
      </div>
    </footer>
  );
}
