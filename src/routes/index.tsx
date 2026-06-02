import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/azkomoly-logo.png";
import { Instagram } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AZKOMOLY — Mi van a dobozban?" },
      {
        name: "description",
        content:
          "AZKOMOLY mystery box: márkás ruhák, véletlenszerű tartalom, nevetséges áron. Iratkozz fel és legyél az első, aki megnyitja a dobozt.",
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

const emailSchema = z
  .string()
  .trim()
  .min(3, { message: "Adj meg egy érvényes email címet." })
  .max(255)
  .email({ message: "Adj meg egy érvényes email címet." });

function Landing() {
  return (
    <main className="relative overflow-hidden bg-background text-foreground">
      <FloatingPieces />
      <Hero />
      <HowItWorks />
      <EmailCapture />
      <MysteryTeaser />
      <Footer />
    </main>
  );
}

function FloatingPieces() {
  const pieces = [
    { top: "8%", left: "6%", size: 32, rot: -15, delay: "0s" },
    { top: "20%", right: "8%", size: 22, rot: 24, delay: "1.2s" },
    { top: "55%", left: "4%", size: 28, rot: 12, delay: "0.6s" },
    { top: "72%", right: "10%", size: 36, rot: -22, delay: "2.1s" },
    { top: "40%", left: "48%", size: 18, rot: 8, delay: "1.8s" },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {pieces.map((p, i) => (
        <div
          key={i}
          className="animate-float-piece absolute"
          style={{
            top: p.top,
            left: p.left as string | undefined,
            right: p.right as string | undefined,
            width: p.size,
            height: p.size * 0.75,
            background: "var(--cardboard)",
            opacity: 0.35,
            ["--rot" as never]: `${p.rot}deg`,
            animationDelay: p.delay,
            clipPath:
              "polygon(8% 0, 100% 12%, 92% 100%, 0 88%)",
          }}
        />
      ))}
    </div>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center">
      <div className="animate-pulse-glow mb-8">
        <img
          src={logo}
          alt="AZKOMOLY exploding mystery box logo"
          width={1024}
          height={1024}
          className="mx-auto h-44 w-44 sm:h-56 sm:w-56 md:h-72 md:w-72 object-contain"
        />
      </div>
      <h1 className="font-display text-fire-glow text-5xl sm:text-6xl md:text-8xl text-fire animate-fade-up">
        MI VAN A DOBOZBAN?
      </h1>
      <p className="mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground animate-fade-up" style={{ animationDelay: "0.15s" }}>
        Márkás ruhák. Véletlenszerű tartalom.{" "}
        <span className="text-white font-bold">Nevetséges áron.</span>
      </p>
      <a
        href="#feliratkozas"
        className="mt-10 inline-block bg-fire text-primary-foreground font-display text-xl px-8 py-4 graffiti-border hover:translate-y-[-2px] transition-transform animate-fade-up"
        style={{ animationDelay: "0.3s" }}
      >
        FELIRATKOZOM
      </a>
    </section>
  );
}

function HowItWorks() {
  const items = [
    { icon: "🎲", title: "Véletlenszerű termékek", desc: "Sosem tudod, mi lapul a dobozban. Ez a játék lényege." },
    { icon: "👕", title: "Márkás ruhák", desc: "Streetwear darabok a kínai konténer overstockból." },
    { icon: "💰", title: "Olcsó árak", desc: "Hype árcédula nélkül. Komolyan." },
  ];
  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-4xl md:text-6xl text-center text-white mb-16">
          HOGYAN <span className="text-fire text-fire-glow">MŰKÖDIK?</span>
        </h2>
        <div className="grid gap-10 md:grid-cols-3">
          {items.map((it) => (
            <div
              key={it.title}
              className="torn-card p-8 text-center transition-transform hover:scale-[1.03] hover:rotate-[-1deg]"
            >
              <div className="text-6xl mb-4" aria-hidden>{it.icon}</div>
              <h3 className="font-display text-2xl mb-3">{it.title}</h3>
              <p className="font-sans text-sm leading-relaxed text-[#1a1a1a]">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setStatus("error");
      setMessage(parsed.error.issues[0]?.message ?? "Érvénytelen email.");
      return;
    }
    setStatus("loading");
    setMessage("");
    const { error } = await supabase
      .from("azkomoly_leads")
      .insert({ email: parsed.data.toLowerCase(), source: "landing" });

    if (error) {
      if (error.code === "23505") {
        setStatus("success");
        setMessage("✅ Már fent vagy a listán! Hamarosan nyílik a doboz.");
      } else {
        setStatus("error");
        setMessage("Hiba történt. Próbáld újra.");
      }
      return;
    }
    setStatus("success");
    setMessage("✅ Bent vagy! Hamarosan nyílik a doboz.");
    setEmail("");
  }

  return (
    <section id="feliratkozas" className="relative px-6 py-28">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-5xl md:text-7xl text-fire text-fire-glow">
          ÉRTESÜLJ ELSŐNEK!
        </h2>
        <p className="mt-5 text-lg text-muted-foreground">
          Legyél az első, aki megnyitja a dobozt.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-10 flex flex-col sm:flex-row gap-4 items-stretch justify-center"
        >
          <label htmlFor="email" className="sr-only">Email cím</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="te@email.hu"
            maxLength={255}
            className="graffiti-border bg-dark-bg text-white font-sans text-lg px-5 py-4 flex-1 min-w-0 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-fire"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-fire text-primary-foreground font-display text-xl px-8 py-4 graffiti-border hover:translate-y-[-2px] transition-transform disabled:opacity-60"
          >
            {status === "loading" ? "..." : "FELIRATKOZOM"}
          </button>
        </form>

        {message && (
          <p
            role="status"
            className={`mt-6 font-sans text-base ${
              status === "success" ? "text-fire" : "text-destructive"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </section>
  );
}

function MysteryTeaser() {
  return (
    <section className="relative px-6 py-24">
      <div className="torn-divider mb-16" aria-hidden />
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="font-display text-3xl md:text-5xl text-white mb-12">
          Ezek lehetnek a következő <span className="text-fire">dobozban...</span>
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="relative aspect-square overflow-hidden border-2 border-cardboard/60 bg-dark-bg group"
            >
              <div
                className="absolute inset-0 blur-xl opacity-60 group-hover:opacity-80 transition-opacity"
                style={{
                  background: `radial-gradient(circle at ${30 + i * 20}% ${40 + i * 10}%, var(--cardboard), transparent 65%), linear-gradient(135deg, #2a1a08, #0d0d0d)`,
                }}
                aria-hidden
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-9xl text-fire text-fire-glow select-none">?</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="torn-divider mt-16 rotate-180" aria-hidden />
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative px-6 py-12 border-t border-border bg-dark-bg">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <p className="font-sans text-sm text-muted-foreground text-center sm:text-left">
          © 2025 <span className="font-display text-fire">AZKOMOLY</span> — piensa diferente y punto
        </p>
        <div className="flex gap-4">
          <a
            href="#"
            aria-label="Instagram"
            className="h-10 w-10 grid place-items-center border border-cardboard/50 text-cardboard hover:text-fire hover:border-fire transition-colors"
          >
            <Instagram className="h-5 w-5" />
          </a>
          <a
            href="#"
            aria-label="TikTok"
            className="h-10 w-10 grid place-items-center border border-cardboard/50 text-cardboard hover:text-fire hover:border-fire transition-colors font-display text-sm"
          >
            TT
          </a>
        </div>
      </div>
    </footer>
  );
}
