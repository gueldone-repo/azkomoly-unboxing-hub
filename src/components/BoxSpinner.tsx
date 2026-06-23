import { useState, useEffect, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useT } from "@/lib/i18n";
import { useShopifyCart } from "@/lib/shopify/cart-store";
import { fetchShopifyDiscountCodes, type DiscountCode } from "@/lib/shopify/discounts.functions";
import { appendLeadToSheet } from "@/lib/leads.functions";
import { supabase } from "@/integrations/supabase/client";

const FALLBACK_CODES: DiscountCode[] = [
  { code: "FREE-SHIP", title: "Ingyenes szállítás" },
  { code: "FREE-SHIP", title: "Ingyenes szállítás" },
  { code: "FREE-SHIP", title: "Ingyenes szállítás" },
];

type Phase = "idle" | "chosen" | "gate" | "revealed";

function shuffled<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function BoxSpinner({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [chosen, setChosen] = useState<number | null>(null);
  const [boxCodes, setBoxCodes] = useState<DiscountCode[]>(FALLBACK_CODES);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const t = useT();
  const setDiscountCode = useShopifyCart((s) => s.setDiscountCode);
  const appendToSheet = useServerFn(appendLeadToSheet);

  useEffect(() => {
    fetchShopifyDiscountCodes().then((codes) => {
      if (!codes.length) return;
      const pool = shuffled(codes);
      setBoxCodes([pool[0], pool[1 % pool.length], pool[2 % pool.length]]);
    });
  }, []);

  function pick(i: number) {
    if (phase !== "idle") return;
    setChosen(i);
    setPhase("chosen");
    setTimeout(() => setPhase("gate"), 680);
  }

  async function submitGate(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || submitting) return;
    setSubmitting(true);
    const trimmedName = name.trim();
    const loweredEmail = email.trim().toLowerCase();
    try {
      await supabase.from("azkomoly_leads").insert({
        name: trimmedName,
        email: loweredEmail,
        source: "box_spinner",
      });
    } catch {
      // non-blocking — reveal code even if save fails
    }
    appendToSheet({
      data: {
        name: trimmedName,
        email: loweredEmail,
        countryCode: null,
        phone: null,
      },
    }).catch((err) => console.error("Sheet append error", err));
    if (chosen !== null) setDiscountCode(boxCodes[chosen].code);
    setPhase("revealed");
    setSubmitting(false);
  }

  const revealedCode = chosen !== null ? boxCodes[chosen] : null;

  return (
    <>
      <style>{`
        @keyframes bx0{0%,100%{transform:translateY(0)rotate(-3deg)}50%{transform:translateY(-13px)rotate(2deg)}}
        @keyframes bx1{0%,100%{transform:translateY(-6px)rotate(2deg)}50%{transform:translateY(8px)rotate(-2deg)}}
        @keyframes bx2{0%,100%{transform:translateY(5px)rotate(-1deg)}50%{transform:translateY(-10px)rotate(3deg)}}
        @keyframes bxReveal{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.90)" }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="relative w-full max-w-sm bg-dark-bg border-2 border-fire/60 p-5 sm:p-7 text-center overflow-hidden">
          <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-52 rounded-full bg-fire/15 blur-3xl" />

          <button
            onClick={onClose}
            aria-label="Bezárás"
            className="absolute top-3 right-4 text-white/40 hover:text-fire font-display text-lg leading-none transition-colors z-10"
          >
            ✕
          </button>

          {phase === "idle" || phase === "chosen" ? (
            <>
              <p
                className="relative font-display text-base sm:text-lg text-fire mb-0.5"
                style={{ textShadow: "0 0 20px oklch(0.78 0.17 70 / 0.6)" }}
              >
                {t.boxSpinner.pick}
              </p>
              <p className="relative font-sans text-[10px] text-white/55 tracking-widest mb-6">
                {t.boxSpinner.sub}
              </p>

              <div
                className="relative flex justify-center items-center gap-5 sm:gap-8 mb-6"
                style={{ height: "9rem" }}
              >
                {([0, 1, 2] as const).map((i) => {
                  const NAMES = ["bx0", "bx1", "bx2"];
                  const DURS = [2.5, 3.1, 2.8];
                  const DELAYS = [0, 0.5, 0.9];
                  const isChosen = phase === "chosen" && chosen === i;
                  const isFaded = phase === "chosen" && chosen !== i;
                  return (
                    <button
                      key={i}
                      onClick={() => pick(i)}
                      disabled={phase !== "idle"}
                      className="relative cursor-pointer disabled:cursor-default transition-all duration-500 ease-in-out"
                      style={{
                        width: isChosen ? "8rem" : "6rem",
                        height: isChosen ? "8rem" : "6rem",
                        flexShrink: 0,
                        opacity: isFaded ? 0.1 : 1,
                        transform: isChosen ? "scale(1.15) translateY(-8px)" : undefined,
                        filter:
                          phase === "idle"
                            ? "drop-shadow(0 4px 12px oklch(0.78 0.17 70 / 0.3))"
                            : isChosen
                            ? "drop-shadow(0 0 28px oklch(0.78 0.17 70 / 1))"
                            : "none",
                        animation:
                          phase === "idle"
                            ? `${NAMES[i]} ${DURS[i]}s ease-in-out ${DELAYS[i]}s infinite`
                            : "none",
                      }}
                    >
                      <img
                        src="/1_box_cerrada.png"
                        alt="Titkos doboz"
                        className="w-full h-full object-contain select-none"
                        draggable={false}
                      />
                    </button>
                  );
                })}
              </div>
              <p className="relative font-sans text-[9px] tracking-[0.45em] text-white/30">
                {t.boxSpinner.tap}
              </p>
            </>
          ) : phase === "gate" ? (
            <div style={{ animation: "bxReveal 0.45s ease-out both" }}>
              <p
                className="font-display text-lg sm:text-xl text-fire mb-3"
                style={{ textShadow: "0 0 30px oklch(0.78 0.17 70 / 0.8)" }}
              >
                {t.boxSpinner.congrats}
              </p>
              <div className="mx-auto mb-4" style={{ width: "6rem" }}>
                <img
                  src="/2_box_abierta.png"
                  alt="Nyitott doboz"
                  className="w-full object-contain"
                  style={{ filter: "drop-shadow(0 0 22px oklch(0.78 0.17 70 / 0.7))" }}
                />
              </div>
              <p className="font-sans text-xs text-white/60 mb-4 leading-relaxed">
                {t.boxSpinner.gateHint}
              </p>
              <form onSubmit={submitGate} className="flex flex-col gap-2.5">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.boxSpinner.gateName}
                  className="w-full bg-white/5 border border-fire/30 focus:border-fire/70 text-white font-sans text-sm px-3 py-2 outline-none placeholder:text-white/30 transition-colors"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.boxSpinner.gateEmail}
                  className="w-full bg-white/5 border border-fire/30 focus:border-fire/70 text-white font-sans text-sm px-3 py-2 outline-none placeholder:text-white/30 transition-colors"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-fire text-primary-foreground font-display text-base py-2.5 graffiti-border hover:translate-y-[-2px] transition-transform disabled:opacity-60 mt-1"
                >
                  {submitting ? "..." : t.boxSpinner.gateSubmit}
                </button>
              </form>
            </div>
          ) : (
            <div style={{ animation: "bxReveal 0.45s ease-out both" }}>
              <p
                className="font-display text-lg sm:text-xl text-fire mb-4"
                style={{ textShadow: "0 0 30px oklch(0.78 0.17 70 / 0.8)" }}
              >
                {t.boxSpinner.congrats}
              </p>
              <div className="mx-auto mb-4" style={{ width: "8rem" }}>
                <img
                  src="/2_box_abierta.png"
                  alt="Nyitott doboz"
                  className="w-full object-contain"
                  style={{ filter: "drop-shadow(0 0 22px oklch(0.78 0.17 70 / 0.7))" }}
                />
              </div>
              <div className="relative border-2 border-fire bg-fire/10 py-3 px-4 mb-3 overflow-hidden">
                <div className="pointer-events-none absolute inset-0 opacity-10 bg-[repeating-linear-gradient(-45deg,transparent_0_10px,oklch(0.14_0_0/0.5)_10px_11px)]" />
                {revealedCode?.title && (
                  <p className="relative font-sans text-[9px] tracking-[0.4em] text-fire/70 mb-1 uppercase">
                    {revealedCode.title}
                  </p>
                )}
                <p className="relative font-sans text-[9px] tracking-[0.4em] text-fire mb-1">
                  {t.boxSpinner.couponLabel}
                </p>
                <p className="relative font-display text-3xl sm:text-4xl text-white tracking-widest">
                  {revealedCode?.code}
                </p>
                <p className="relative font-sans text-xs text-fire/80 mt-0.5">
                  {t.boxSpinner.discount}
                </p>
              </div>
              <p className="font-sans text-[10px] text-white/40 mb-5">{t.boxSpinner.copyHint}</p>
              <button
                onClick={onClose}
                className="w-full bg-fire text-primary-foreground font-display text-lg py-3 graffiti-border hover:translate-y-[-2px] transition-transform"
              >
                {t.boxSpinner.cta}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
