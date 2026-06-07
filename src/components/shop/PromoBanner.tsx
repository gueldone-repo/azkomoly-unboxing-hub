import { useEffect, useState } from "react";

// Counts down to next Sunday 20:00 local
function nextDropDate() {
  const d = new Date();
  const day = d.getDay();
  const daysUntilSun = (7 - day) % 7 || 7;
  d.setDate(d.getDate() + daysUntilSun);
  d.setHours(20, 0, 0, 0);
  return d;
}

export function PromoBanner() {
  const [target] = useState(() => nextDropDate());
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, target.getTime() - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24);
  const m = Math.floor((diff / 60000) % 60);
  const s = Math.floor((diff / 1000) % 60);

  const Cell = ({ v, l }: { v: number; l: string }) => (
    <div className="flex flex-col items-center">
      <span className="font-display text-4xl sm:text-5xl text-fire text-fire-glow tabular-nums leading-none">
        {String(v).padStart(2, "0")}
      </span>
      <span className="mt-1 font-sans text-[10px] sm:text-xs tracking-[0.3em] text-foreground/70">
        {l}
      </span>
    </div>
  );

  return (
    <section className="relative overflow-hidden bg-dark-bg border-y-2 border-fire/60">
      <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent_0_18px,oklch(0.78_0.17_70/0.4)_18px_19px)]" />
      <div className="relative mx-auto max-w-7xl px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-center sm:text-left">
          <p className="font-sans text-xs tracking-[0.35em] text-fire">
            DROP #002 · ÉLŐBEN
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-foreground">
            Új doboz · vasárnap 20:00
          </h2>
          <p className="font-sans text-sm text-foreground/70 mt-1">
            Amíg el nem fogy. Limitált darabszám, nincs utánrendelés.
          </p>
        </div>
        <div className="flex items-center gap-5 sm:gap-7">
          <Cell v={d} l="NAP" />
          <span className="font-display text-3xl text-fire/40">:</span>
          <Cell v={h} l="ÓRA" />
          <span className="font-display text-3xl text-fire/40">:</span>
          <Cell v={m} l="PERC" />
          <span className="font-display text-3xl text-fire/40">:</span>
          <Cell v={s} l="MP" />
        </div>
      </div>
    </section>
  );
}
