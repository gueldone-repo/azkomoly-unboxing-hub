import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { appendLeadToSheet } from "@/lib/leads.functions";
import { Instagram, Facebook, Youtube, ShieldCheck, Truck, Sparkles } from "lucide-react";
import { CookieBanner } from "@/components/CookieBanner";
import { ScrubBackdrop } from "@/components/ScrubBackdrop";
import { HeroOverlay } from "@/components/HeroOverlay";
import { ProductCard } from "@/components/shop/ProductCard";
import { SocialProof } from "@/components/shop/SocialProof";
import { LanguageToggle } from "@/components/LanguageToggle";
import { CartButton } from "@/components/cart/CartSheet";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify/client";
import { useT, useI18n, readLangCookie } from "@/lib/i18n";
import { DICTIONARIES } from "@/lib/i18n/dictionary";
import { seoLinks, jsonLd, faqSchema } from "@/lib/seo";

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
  head: () => {
    const lang = readLangCookie();
    const t = DICTIONARIES[lang];
    return {
      meta: [
        { title: t.meta.title },
        { name: "description", content: t.meta.description },
        { property: "og:title", content: t.meta.ogTitle },
        { property: "og:description", content: t.meta.ogDescription },
        { property: "og:type", content: "website" },
      ],
      links: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Space+Grotesk:wght@400;500;700&display=swap",
        },
        // `/` es la versión húngara para crawlers y el x-default.
        ...seoLinks("/", lang),
      ],
      // El FAQ ya existe en el diccionario (7 pares Q/A en hu y en). Exponerlo
      // como FAQPage es la pieza de mayor impacto para que los motores
      // generativos citen respuestas de AZKOMOLY textualmente.
      scripts: [jsonLd(faqSchema(t.faq.items, lang))],
    };
  },
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
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  phone: z
    .string()
    .trim()
    .max(32)
    .regex(/^[0-9 ()\-]*$/)
    .optional()
    .or(z.literal("")),
});

export function Landing() {
  const [open, setOpen] = useState(false);
  // BoxSpinner popup disabled for now — will come back rebuilt on
  // https://headlessui.com/react/dialog. Keep closeBox/boxVisible plumbing
  // removed rather than dead-code so nothing half-fires in the meantime.

  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <TopNav onCta={() => setOpen(true)} />

      <ScrubBackdrop>
        <HeroOverlay onCta={() => setOpen(true)} />
        <ProductsSection />
      </ScrubBackdrop>
      <LifestyleStrip />
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

function TopNav({ onCta }: { onCta: () => void }) {
  const t = useT();
  return (
    <nav className="sticky top-0 z-40 bg-dark-bg/85 backdrop-blur border-b-2 border-fire/40">
      <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between gap-4">
        <a href="#top" className="shrink-0">
          <img
            src="/AZKOMOLY.png"
            alt="AZKOMOLY"
            className="h-10 w-auto"
            style={{ filter: "brightness(0) invert(1)" }}
          />
        </a>
        <div className="flex items-center gap-4 sm:gap-5 font-sans text-sm">
          <a href="#termekek" className="text-foreground hover:text-fire transition-colors">
            {t.nav.shop}
          </a>
          <a href="#hogyan" className="text-foreground/80 hover:text-fire transition-colors hidden sm:inline">
            {t.nav.how}
          </a>
          <a href="#gyik" className="text-foreground/80 hover:text-fire transition-colors hidden sm:inline">
            {t.nav.faq}
          </a>
          <LanguageToggle />
          <CartButton />
          <button
            onClick={onCta}
            className="hidden sm:inline-block bg-fire text-primary-foreground font-display text-sm px-4 py-1.5 graffiti-border hover:translate-y-[-2px] transition-transform"
          >
            {t.nav.notify}
          </button>
        </div>
      </div>
    </nav>
  );
}

function ProductsSection() {
  const t = useT();
  const { lang } = useI18n();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchProducts(20, undefined, lang).then((prods) => {
      setProducts(prods);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [lang]);

  return (
    <section
      id="termekek"
      className="relative bg-gradient-to-b from-transparent via-background/60 to-background"
    >
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div data-reveal className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <p className="font-sans text-xs tracking-[0.35em] text-fire mb-2">
              {t.products.kicker}
            </p>
            <h2 className="font-display text-4xl sm:text-5xl text-foreground">
              {t.products.heading}
            </h2>
          </div>
        </div>
        {loading ? (
          <>
            {/* Mobile skeleton */}
            <div className="sm:hidden flex gap-4 overflow-x-auto pb-2 -mx-6 px-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="shrink-0 w-[78vw] aspect-square bg-dark-bg/60 border-2 border-cardboard/20 animate-pulse" />
              ))}
            </div>
            {/* Desktop skeleton */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-dark-bg/60 border-2 border-cardboard/20 animate-pulse" />
              ))}
            </div>
          </>
        ) : products.length === 0 ? (
          <p className="font-sans text-foreground/50 text-center py-10">
            {t.products.empty}
          </p>
        ) : (
          <>
            {/* Mobile: horizontal snap carousel */}
            <div className="sm:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 scrollbar-none">
              {products.map((p) => (
                <div key={p.node.id} className="snap-start shrink-0 w-[78vw]">
                  <ProductCard p={p} />
                </div>
              ))}
            </div>
            {/* Tablet / Desktop: grid */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {products.map((p) => (
                <ProductCard key={p.node.id} p={p} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}


const LIFESTYLE_PHOTOS = [
  "/Outfit_reveal_vertical_box_202606092123.jpeg",
  "/Unboxing_POV_shot_dark_table_202606092122.jpeg",
  "/Outfit_reveal_oversized_hoodie_box_202606092122.jpeg",
  "/Unboxing_cardboard_box_with_graphic_202606092122.jpeg",
  "/Hands_holding_cardboard_box_202606092122.jpeg",
  "/Hands_holding_AZKOMOLY_box_202606092122.jpeg",
];

function LifestyleStrip() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const pausedRef = useRef(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const all = [...LIFESTYLE_PHOTOS, ...LIFESTYLE_PHOTOS];

  // Auto-scroll that yields to user interaction.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let raf = 0;
    let last = performance.now();
    const SPEED = 40; // px/sec

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!pausedRef.current && el.scrollWidth > el.clientWidth) {
        const half = el.scrollWidth / 2;
        let next = el.scrollLeft + SPEED * dt;
        if (next >= half) next -= half;
        el.scrollLeft = next;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const pause = () => { pausedRef.current = true; };
    const resumeSoon = () => {
      window.clearTimeout((el as any).__resumeT);
      (el as any).__resumeT = window.setTimeout(() => { pausedRef.current = false; }, 1800);
    };

    el.addEventListener("pointerdown", pause);
    el.addEventListener("pointerup", resumeSoon);
    el.addEventListener("pointercancel", resumeSoon);
    el.addEventListener("pointerleave", resumeSoon);
    el.addEventListener("wheel", () => { pause(); resumeSoon(); }, { passive: true });
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", resumeSoon);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerdown", pause);
      el.removeEventListener("pointerup", resumeSoon);
      el.removeEventListener("pointercancel", resumeSoon);
      el.removeEventListener("pointerleave", resumeSoon);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", resumeSoon);
    };
  }, []);

  // Drag-to-scroll for mouse users.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let down = false;
    let startX = 0;
    let startLeft = 0;
    let moved = 0;

    const onDown = (e: PointerEvent) => {
      down = true;
      moved = 0;
      startX = e.clientX;
      startLeft = el.scrollLeft;
      el.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      el.scrollLeft = startLeft - dx;
    };
    const onUp = (e: PointerEvent) => {
      down = false;
      el.releasePointerCapture?.(e.pointerId);
      (el as any).__lastDragDist = moved;
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, []);

  const handleClick = (i: number) => {
    const dragged = (scrollerRef.current as any)?.__lastDragDist ?? 0;
    if (dragged > 6) return; // suppress click after drag
    setOpenIndex(i % LIFESTYLE_PHOTOS.length);
  };

  return (
    <>
      <section className="py-6 overflow-hidden border-y border-cardboard/20 bg-dark-bg/60">
        <div
          ref={scrollerRef}
          className="flex gap-3 overflow-x-auto scrollbar-none cursor-grab active:cursor-grabbing select-none"
          style={{ scrollbarWidth: "none", touchAction: "pan-x" }}
        >
          {all.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleClick(i)}
              className="shrink-0 h-64 w-48 overflow-hidden border border-cardboard/25 hover:border-fire/60 transition-colors duration-300 p-0 bg-transparent"
              style={{ aspectRatio: "3/4" }}
              aria-label="Nyisd meg a galériát"
            >
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 pointer-events-none"
                draggable={false}
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>
      </section>
      <InstagramFeedModal
        open={openIndex !== null}
        startIndex={openIndex ?? 0}
        onClose={() => setOpenIndex(null)}
      />
    </>
  );
}

function InstagramFeedModal({
  open,
  startIndex,
  onClose,
}: {
  open: boolean;
  startIndex: number;
  onClose: () => void;
}) {
  const feedRef = useRef<HTMLDivElement | null>(null);
  const IG_URL = "https://www.instagram.com/azkomoly.hu/";

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    // Scroll to start index once mounted
    requestAnimationFrame(() => {
      const el = feedRef.current;
      if (!el) return;
      const target = el.querySelector<HTMLElement>(`[data-idx="${startIndex}"]`);
      target?.scrollIntoView({ block: "start" });
    });
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, startIndex, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/70">
          <a
            href={IG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 group"
          >
            <span className="grid place-items-center h-9 w-9 rounded-full bg-gradient-to-tr from-fire via-pink-500 to-purple-600">
              <Instagram className="h-5 w-5 text-white" />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="font-sans text-sm text-white font-semibold group-hover:text-fire transition-colors">
                azkomoly.hu
              </span>
              <span className="font-sans text-[11px] text-white/60">Kövess minket Instagramon</span>
            </div>
          </a>
          <button
            type="button"
            onClick={onClose}
            aria-label="Bezárás"
            className="h-9 w-9 grid place-items-center text-white/80 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Feed */}
        <div
          ref={feedRef}
          className="flex-1 overflow-y-auto overscroll-contain snap-y snap-mandatory"
        >
          <div className="mx-auto max-w-md w-full">
            {LIFESTYLE_PHOTOS.map((src, i) => (
              <article
                key={i}
                data-idx={i}
                className="snap-start border-b border-white/10 py-4"
              >
                <div className="flex items-center gap-2 px-3 pb-2">
                  <span className="grid place-items-center h-8 w-8 rounded-full bg-gradient-to-tr from-fire via-pink-500 to-purple-600">
                    <Instagram className="h-4 w-4 text-white" />
                  </span>
                  <a
                    href={IG_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-sm text-white font-semibold hover:text-fire"
                  >
                    azkomoly.hu
                  </a>
                </div>
                <div className="bg-dark-bg">
                  <img
                    src={src}
                    alt=""
                    className="w-full h-auto object-contain max-h-[75vh] mx-auto"
                    draggable={false}
                  />
                </div>
                <div className="flex items-center justify-between px-3 pt-3">
                  <div className="flex items-center gap-4 text-white/90">
                    <span aria-hidden>♥</span>
                    <span aria-hidden>💬</span>
                    <span aria-hidden>↗</span>
                  </div>
                  <a
                    href={IG_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-xs uppercase tracking-widest text-fire hover:underline"
                  >
                    Megnyitás Instagramon
                  </a>
                </div>
              </article>
            ))}
            <div className="p-6 text-center">
              <a
                href={IG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-fire text-black font-display tracking-widest text-sm hover:bg-fire/90 transition-colors"
              >
                <Instagram className="h-4 w-4" /> @azkomoly.hu
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ValueProps() {
  const t = useT();
  const icons = [ShieldCheck, Sparkles, Truck];
  return (
    <section className="bg-dark-bg border-y border-cardboard/20 py-16">
      <div className="mx-auto max-w-4xl px-6 grid sm:grid-cols-3 gap-px bg-cardboard/20">
        {t.values.items.map((item, i) => {
          const Icon = icons[i];
          return (
            <div
              key={item.title}
              data-reveal
              data-delay={String(i + 1)}
              className="flex flex-col items-center text-center p-8 bg-dark-bg group hover:bg-fire/5 transition-colors duration-300"
            >
              <span className="grid place-items-center h-14 w-14 border-2 border-fire/50 text-fire mb-5 group-hover:border-fire group-hover:bg-fire/10 transition-all duration-300">
                <Icon className="h-7 w-7" />
              </span>
              <h3 className="font-display text-xl text-foreground tracking-wider mb-2">{item.title}</h3>
              <p className="font-sans text-sm text-foreground/60 leading-relaxed">{item.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function HowItWorks() {
  const t = useT();
  return (
    <section id="hogyan" className="bg-background">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div data-reveal className="text-center mb-14">
          <p className="font-sans text-xs tracking-[0.4em] text-fire mb-3">
            {t.how.kicker}
          </p>
          <h2 className="font-display text-4xl sm:text-6xl text-foreground">
            {t.how.heading}
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {t.how.steps.map((s, i) => (
            <div
              key={s.n}
              data-reveal
              data-delay={String(i + 1)}
              className="relative bg-dark-bg border border-cardboard/30 p-7 overflow-hidden group hover:border-fire/70 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Watermark number */}
              <span className="absolute -bottom-3 -right-1 font-display leading-none text-fire/6 select-none pointer-events-none"
                style={{ fontSize: "7rem" }}>
                {s.n}
              </span>
              <span className="font-sans text-[10px] tracking-[0.4em] text-fire block mb-4">
                {s.n}
              </span>
              <h3 className="font-display text-2xl text-foreground mb-2">{s.title}</h3>
              <p className="font-sans text-sm text-foreground/60 leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BigCTA({ onCta }: { onCta: () => void }) {
  const t = useT();
  const lines = t.bigCta.heading.split("\n");
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-fire" />
      <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(-45deg,transparent_0_24px,oklch(0.14_0_0/0.4)_24px_26px)]" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 text-center">
        <p className="font-display text-primary-foreground text-base sm:text-lg tracking-[0.4em] mb-4">
          {t.bigCta.kicker}
        </p>
        <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl text-primary-foreground text-stroke-black leading-[0.9]">
          {lines.map((line, i) => (
            <span key={i}>
              {line}
              {i < lines.length - 1 && <br />}
            </span>
          ))}
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="#termekek"
            className="inline-block bg-dark-bg text-fire font-display text-xl sm:text-2xl px-10 py-5 border-4 border-dark-bg hover:bg-foreground hover:text-dark-bg transition-colors"
          >
            {t.bigCta.showBoxes}
          </a>
          <button
            onClick={onCta}
            className="inline-block bg-transparent text-primary-foreground font-display text-xl sm:text-2xl px-10 py-5 border-4 border-dark-bg hover:bg-dark-bg hover:text-fire transition-colors"
          >
            {t.bigCta.notify}
          </button>
        </div>
      </div>
    </section>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border ${open ? "border-fire/60 bg-fire/5" : "border-cardboard/30 bg-dark-bg"} transition-all duration-300`}>
      <button
        className="w-full flex items-center justify-between p-5 text-left gap-4"
        onClick={() => setOpen(!open)}
      >
        <span className="font-display text-lg text-foreground">{q}</span>
        <span
          className="shrink-0 font-display text-2xl text-fire transition-transform duration-300"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
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

function FAQSection() {
  const t = useT();
  return (
    <section id="gyik" className="bg-background">
      <div className="mx-auto max-w-3xl px-6 py-24">
        <div data-reveal className="text-center mb-12">
          <p className="font-sans text-xs tracking-[0.4em] text-fire mb-3">
            {t.faq.kicker}
          </p>
          <h2 className="font-display text-4xl sm:text-5xl text-foreground">
            {t.faq.heading}
          </h2>
        </div>
        <div className="space-y-2" data-reveal data-delay="1">
          {t.faq.items.map((f) => (
            <FAQItem key={f.q} q={f.q} a={f.a} />
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
  const t = useT();
  return (
    <footer className="mt-16 pt-8 border-t border-cardboard/30 flex flex-col items-center gap-4">
      <p className="font-display text-fire text-lg tracking-wider">{t.footer.follow}</p>
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
        <Link to="/privacy" className="hover:text-fire">{t.footer.privacy}</Link>
        <span>·</span>
        <Link to="/terms" className="hover:text-fire">{t.footer.terms}</Link>
        <span>·</span>
        <Link to="/cookies" className="hover:text-fire">{t.footer.cookies}</Link>
      </nav>
      <p className="font-sans text-xs text-muted-foreground">
        © 2026 <span className="font-display text-fire">AZKOMOLY</span> · {t.footer.rights}
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
  const t = useT();
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
      setMessage(t.signup.errorConsent);
      return;
    }
    const parsed = signupSchema.safeParse({ name, email, phone });
    if (!parsed.success) {
      setStatus("error");
      setMessage(t.signup.errorGeneric);
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
      setMessage(t.signup.errorGeneric);
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
      setMessage(t.signup.successExisting);
      return;
    }
    setStatus("success");
    setMessage(t.signup.successNew);
    setName("");
    setEmail("");
    setPhone("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-dark-bg border-fire/60 graffiti-border w-[94vw] max-w-md p-5 sm:p-6">
        <DialogHeader className="pb-1">
          <DialogTitle className="font-display text-2xl sm:text-3xl text-fire text-fire-glow text-center">
            {t.signup.title}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:gap-4 mt-1">
          <div>
            <label htmlFor="name" className="block font-sans text-sm text-white mb-1">{t.signup.name}</label>
            <input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={120}
              placeholder={t.signup.namePlaceholder}
              className="w-full bg-background border-2 border-cardboard/60 focus:border-fire text-white px-4 py-3 text-base font-sans focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-sans text-sm text-white mb-1">{t.signup.email}</label>
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
              {t.signup.phone} <span className="text-muted-foreground">{t.signup.optional}</span>
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
                placeholder={t.signup.phonePlaceholder}
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
              {t.signup.consentPre}
              <Link to="/terms" className="text-fire underline" target="_blank">{t.signup.consentTerms}</Link>
              {t.signup.consentMid}
              <Link to="/privacy" className="text-fire underline" target="_blank">{t.signup.consentPrivacy}</Link>
              {t.signup.consentPost}
            </span>
          </label>

          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-1 sm:mt-2 bg-fire text-primary-foreground font-display text-lg sm:text-xl px-6 py-4 graffiti-border hover:translate-y-[-2px] transition-transform disabled:opacity-60"
          >
            {status === "loading" ? t.signup.sending : t.signup.submit}
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
