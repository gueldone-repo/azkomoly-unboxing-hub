import { useT } from "@/lib/i18n";

export function SocialProof() {
  const t = useT();
  const reviews = t.reviews;
  return (
    <section className="relative overflow-hidden border-y border-cardboard/30 bg-dark-bg py-6">
      <div className="flex gap-8 animate-[marquee_40s_linear_infinite] whitespace-nowrap">
        {[...reviews, ...reviews].map((r, i) => (
          <div key={i} className="flex items-center gap-3 shrink-0">
            <span className="text-fire font-display text-xl">★★★★★</span>
            <span className="font-sans text-sm text-foreground/90">
              "{r.text}"
            </span>
            <span className="font-sans text-xs text-foreground/50 tracking-widest">
              — {r.name.toUpperCase()}
            </span>
            <span className="text-cardboard/40">·</span>
          </div>
        ))}
      </div>
    </section>
  );
}
