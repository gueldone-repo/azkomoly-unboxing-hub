import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
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
import { supabase } from "@/integrations/supabase/client";
import { appendLeadToSheet } from "@/lib/leads.functions";
import { useT } from "@/lib/i18n";
import { useSignupDialogStore } from "@/lib/state/signup-dialog-store";

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

/**
 * Único diálogo de "Subscribe" del sitio — se renderiza una sola vez en
 * `__root.tsx` (mismo patrón que `CartSheet`) y cualquier botón de cualquier
 * página lo abre vía `useSignupDialogStore().setOpen(true)`.
 */
export function SignupDialog() {
  const isOpen = useSignupDialogStore((s) => s.isOpen);
  const setOpen = useSignupDialogStore((s) => s.setOpen);
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
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="bg-dark-bg border-fire/60 graffiti-border w-[94vw] max-w-md p-5 sm:p-6">
        <DialogHeader className="pb-1">
          <DialogTitle className="font-display text-2xl sm:text-3xl text-fire text-fire-glow text-center">
            {t.signup.title}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:gap-4 mt-1">
          <div>
            <label htmlFor="name" className="block font-sans text-sm text-foreground mb-1">{t.signup.name}</label>
            <input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={120}
              placeholder={t.signup.namePlaceholder}
              className="w-full rounded-2xl bg-background border-2 border-cardboard/40 focus:border-fire text-foreground px-4 py-3 text-base font-sans focus:outline-none focus:ring-2 focus:ring-fire/25 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-sans text-sm text-foreground mb-1">{t.signup.email}</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={255}
              placeholder={t.signup.emailPlaceholder}
              className="w-full rounded-2xl bg-background border-2 border-cardboard/40 focus:border-fire text-foreground px-4 py-3 text-base font-sans focus:outline-none focus:ring-2 focus:ring-fire/25 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block font-sans text-sm text-foreground mb-1">
              {t.signup.phone} <span className="text-muted-foreground">{t.signup.optional}</span>
            </label>
            {/* Antes era una fila apretada de dos cajas rectas pegadas — ahora
                separadas (`gap-2.5`) y redondeadas como el resto del form. */}
            <div className="flex gap-2.5">
              <Select value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger className="w-[110px] sm:w-[130px] shrink-0 rounded-2xl bg-background border-2 border-cardboard/40 text-foreground font-sans py-3 px-3 text-base min-h-[52px] focus:ring-2 focus:ring-fire/25">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-dark-bg border-cardboard/60 text-foreground max-h-72 min-w-[180px] rounded-2xl">
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
                className="flex-1 min-w-0 rounded-2xl bg-background border-2 border-cardboard/40 focus:border-fire text-foreground px-4 py-3 text-base font-sans focus:outline-none focus:ring-2 focus:ring-fire/25 transition-colors min-h-[52px]"
              />
            </div>
          </div>

          <label className="flex items-start gap-2 text-xs sm:text-sm text-foreground/80 font-sans">
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
            className="btn-3d mt-1 bg-fire px-6 py-4 font-display text-lg text-primary-foreground sm:mt-2 sm:text-xl"
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
