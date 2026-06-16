import { useState, useEffect } from "react";
import { useT } from "@/lib/i18n";

type Phase = "idle" | "chosen" | "open";

export function BoxSpinner({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [chosen, setChosen] = useState<number | null>(null);
  const t = useT();

  function pick(i: number) {
    if (phase !== "idle") return;
    setChosen(i);
    setPhase("chosen");
    setTimeout(() => setPhase("open"), 680);
  }

  return (
    <>
      <style>{`
        @keyframes bx0{0%,100%{transform:translateY(0)rotate(-3deg)}50%{transform:translateY(-13px)rotate(2deg)}}
        @keyframes bx1{0%,100%{transform:translateY(-6px)rotate(2deg)}50%{transform:translateY(8px)rotate(-2deg)}}
        @keyframes bx2{0%,100%{transform:translateY(5px)rotate(-1deg)}50%{transform:translateY(-10px)rotate(3deg)}}
        @keyframes bxReveal{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.90)" }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="relative w-full max-w-sm bg-dark-bg border-2 border-fire/60 p-6 sm:p-8 text-center overflow-hidden">
          {/* ambient glow */}
          <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-52 rounded-full bg-fire/15 blur-3xl" />

          <button
            onClick={onClose}
            aria-label="Bezárás"
            className="absolute top-3 right-4 text-white/40 hover:text-fire font-display text-xl leading-none transition-colors z-10"
          >
            ✕
          </button>

          {phase !== "open" ? (
            <>
              <p
                className="relative font-display text-xl sm:text-2xl text-fire mb-1"
                style={{ textShadow: "0 0 20px oklch(0.78 0.17 70 / 0.6)" }}
              >
                {t.boxSpinner.pick}
              </p>
              <p className="relative font-sans text-xs text-white/55 tracking-widest mb-8">
                {t.boxSpinner.sub}
              </p>

              {/* 3 boxes */}
              <div
                className="relative flex justify-center items-center gap-5 sm:gap-8 mb-8"
                style={{ height: "10rem" }}
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
                        width: isChosen ? "9rem" : "7rem",
                        height: isChosen ? "9rem" : "7rem",
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
              <p className="relative font-sans text-[10px] tracking-[0.45em] text-white/30">
                {t.boxSpinner.tap}
              </p>
            </>
          ) : (
            <div style={{ animation: "bxReveal 0.45s ease-out both" }}>
              <p
                className="font-display text-2xl sm:text-3xl text-fire mb-5"
                style={{ textShadow: "0 0 30px oklch(0.78 0.17 70 / 0.8)" }}
              >
                {t.boxSpinner.congrats}
              </p>
              <div className="mx-auto mb-5" style={{ width: "10rem" }}>
                <img
                  src="/2_box_abierta.png"
                  alt="Nyitott doboz"
                  className="w-full object-contain"
                  style={{ filter: "drop-shadow(0 0 22px oklch(0.78 0.17 70 / 0.7))" }}
                />
              </div>
              <div className="relative border-2 border-fire bg-fire/10 py-4 px-5 mb-4 overflow-hidden">
                <div className="pointer-events-none absolute inset-0 opacity-10 bg-[repeating-linear-gradient(-45deg,transparent_0_10px,oklch(0.14_0_0/0.5)_10px_11px)]" />
                <p className="relative font-sans text-[10px] tracking-[0.45em] text-fire mb-2">
                  {t.boxSpinner.couponLabel}
                </p>
                <p className="relative font-display text-4xl sm:text-5xl text-white tracking-widest">
                  AZKOMOLY10
                </p>
                <p className="relative font-sans text-sm text-fire/80 mt-1">
                  {t.boxSpinner.discount}
                </p>
              </div>
              <p className="font-sans text-xs text-white/40 mb-6">{t.boxSpinner.copyHint}</p>
              <button
                onClick={onClose}
                className="w-full bg-fire text-primary-foreground font-display text-xl py-3 graffiti-border hover:translate-y-[-2px] transition-transform"
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
