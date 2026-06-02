import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Instagram, Facebook, Youtube } from "lucide-react";
import logoAsset from "@/assets/azkomoly-logo.png.asset.json";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground flex flex-col px-6 py-12">
      <section className="flex-1 flex flex-col items-center justify-center">
        <div className="animate-pulse-glow mb-10">
          <img
            src={logoAsset.url}
            alt="AZKOMOLY mystery box logo"
            className="mx-auto h-64 w-64 sm:h-80 sm:w-80 md:h-[28rem] md:w-[28rem] object-contain drop-shadow-2xl"
          />
        </div>

        <button
          onClick={() => setOpen(true)}
          className="bg-fire text-primary-foreground font-display text-2xl md:text-3xl px-10 py-5 graffiti-border hover:translate-y-[-2px] transition-transform animate-fade-up"
        >
          FELIRATKOZOM
        </button>
      </section>

      <Footer />

      <SignupDialog open={open} onOpenChange={setOpen} />
    </main>
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
      <p className="font-sans text-xs text-muted-foreground mt-2">
        © 2025 <span className="font-display text-fire">AZKOMOLY</span>
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
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = signupSchema.safeParse({ name, email, phone });
    if (!parsed.success) {
      setStatus("error");
      setMessage(parsed.error.issues[0]?.message ?? "Érvénytelen adat.");
      return;
    }
    setStatus("loading");
    setMessage("");

    const phoneTrim = parsed.data.phone?.trim();
    const { error } = await supabase.from("azkomoly_leads").insert({
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      phone: phoneTrim ? phoneTrim : null,
      phone_country_code: phoneTrim ? countryCode : null,
      source: "landing",
    });

    if (error) {
      if (error.code === "23505") {
        setStatus("success");
        setMessage("✅ Már fent vagy a listán!");
      } else {
        setStatus("error");
        setMessage("Hiba történt. Próbáld újra.");
      }
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
      <DialogContent className="bg-dark-bg border-fire/60 graffiti-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl text-fire text-fire-glow">
            FELIRATKOZÁS
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-4 mt-2">
          <div>
            <label htmlFor="name" className="block font-sans text-sm text-white mb-1">
              Név
            </label>
            <input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={120}
              placeholder="Teljes név"
              className="w-full bg-background border-2 border-cardboard/60 focus:border-fire text-white px-4 py-3 font-sans focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-sans text-sm text-white mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={255}
              placeholder="te@email.hu"
              className="w-full bg-background border-2 border-cardboard/60 focus:border-fire text-white px-4 py-3 font-sans focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block font-sans text-sm text-white mb-1">
              Telefon <span className="text-muted-foreground">(opcionális)</span>
            </label>
            <div className="flex gap-2">
              <Select value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger className="w-[120px] bg-background border-2 border-cardboard/60 text-white font-sans h-auto py-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-dark-bg border-cardboard/60 text-white max-h-72">
                  {COUNTRY_CODES.map((c) => (
                    <SelectItem key={c.code} value={c.code} className="font-sans">
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
                className="flex-1 min-w-0 bg-background border-2 border-cardboard/60 focus:border-fire text-white px-4 py-3 font-sans focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-2 bg-fire text-primary-foreground font-display text-xl px-6 py-4 graffiti-border hover:translate-y-[-2px] transition-transform disabled:opacity-60"
          >
            {status === "loading" ? "..." : "KÜLDÉS"}
          </button>

          {message && (
            <p
              role="status"
              className={`font-sans text-sm text-center ${
                status === "success" ? "text-fire" : "text-destructive"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
