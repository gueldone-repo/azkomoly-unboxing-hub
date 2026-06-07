const REVIEWS = [
  { name: "Bence · Budapest", text: "Klasszikus dobozban benne volt egy 25e Ft-os hoodie. Komoly." },
  { name: "Réka · Debrecen", text: "Prémium = 3 darabból kettő rögtön mehetett Instára." },
  { name: "Dani · Szeged", text: "Mini doboz tesztnek tökéletes, már a harmadiknál tartok." },
  { name: "Anna · Pécs", text: "Legendás dobozban sneakert húztam. Még mindig nem hiszem el." },
  { name: "Márk · Győr", text: "Gyors szállítás, brutál csomagolás. Visszatérek." },
];

export function SocialProof() {
  return (
    <section className="relative overflow-hidden border-y border-cardboard/30 bg-dark-bg py-6">
      <div className="flex gap-8 animate-[marquee_40s_linear_infinite] whitespace-nowrap">
        {[...REVIEWS, ...REVIEWS].map((r, i) => (
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
