import { ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { useT } from "@/lib/i18n";
import { CurvedLoop } from "@/components/text/CurvedLoop";
import { RotatingText } from "@/components/text/RotatingText";
import { SplitText } from "@/components/text/SplitText";

function scrollToProducts() {
  document.getElementById("termekek")?.scrollIntoView({ behavior: "smooth" });
}

export function HeroV2() {
  const t = useT();
  const reduceMotion = useReducedMotion();
  const lines = t.hero.heading.split("\n");

  const title = (
    <SplitText
      as="h1"
      className="text-fire hero-title relative z-10 leading-[0.82] tracking-normal select-none"
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(2.75rem, 8.15vw, 7.15rem)",
      }}
    >
      {lines.map((line, i) => (
        <span key={line} className="block">
          {line}
          {i < lines.length - 1 ? "\n" : null}
        </span>
      ))}
    </SplitText>
  );

  const box = (
    // Sin sombra: ni el drop-shadow del <img> ni la elipse difusa del
    // contenedor. La foto ya trae su propia luz y el halo morado del estallido;
    // añadirle sombra la despegaba del fondo como una calcomanía.
    <motion.div
      className="relative"
      initial={reduceMotion ? false : { opacity: 0, scale: 0.86, rotate: -8, y: 46 }}
      animate={reduceMotion ? undefined : { opacity: 1, scale: 1, rotate: -1.5, y: 0 }}
      whileHover={reduceMotion ? undefined : { scale: 1.035, rotate: 1.25, y: -8 }}
      transition={{ type: "spring", stiffness: 120, damping: 13, mass: 0.9, delay: 0.18 }}
    >
      <img
        src="/azkomoly_new_HERO_2.webp"
        alt={t.hero.imageAlt}
        className="relative z-10 h-auto w-full"
        width={1200}
        height={670}
        draggable={false}
        fetchPriority="high"
        decoding="sync"
      />
    </motion.div>
  );

  // Sin panel difuminado detrás del título: ese rectángulo `bg-white/40 blur-2xl`
  // se veía como una caja gris con bordes que encasillaba el H1 y no encajaba
  // con nada. El título se sostiene solo por su propio relieve.
  const titleBlock = (
    <div className="relative z-20 px-6 pt-24 text-center lg:pointer-events-none lg:absolute lg:right-[3vw] lg:top-[13%] lg:z-30 lg:px-0 lg:pt-0 lg:text-right">
      <div className="relative [&_h1]:text-center lg:[&_h1]:text-right">{title}</div>
    </div>
  );

  const cta = (
    <motion.div
      className="flex flex-col items-center gap-5 text-center lg:items-start lg:text-left"
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1], delay: 0.46 }}
    >
      <div className="max-w-[30ch] font-sans text-base leading-relaxed text-foreground/76 sm:text-lg">
        <span className="block">{t.hero.tagline}</span>
        <RotatingText
          phrases={t.hero.rotatingTaglines}
          className="mt-2 font-semibold text-foreground"
        />
      </div>
      <button
        type="button"
        onClick={scrollToProducts}
        className="rounded-full bg-fire px-8 py-4 font-sans text-base font-semibold tracking-wide text-white shadow-[0_16px_32px_rgba(13,13,13,0.18),0_8px_22px_rgba(91,46,168,0.30)] transition-all duration-200 hover:-translate-y-1 hover:bg-[#4c238f] active:translate-y-0 active:scale-[0.98] sm:text-lg"
      >
        {t.hero.cta}
      </button>
    </motion.div>
  );

  const scrollCue = (
    <button
      type="button"
      onClick={scrollToProducts}
      aria-label={t.hero.scrollAria}
      className="group mx-auto mt-2 grid h-12 w-12 place-items-center rounded-full border border-black/10 bg-white/88 text-fire shadow-[0_12px_24px_rgba(13,13,13,0.12)] backdrop-blur transition-all hover:-translate-y-0.5 hover:border-fire/35 hover:bg-white lg:absolute lg:bottom-6 lg:left-1/2 lg:z-40 lg:-translate-x-1/2"
    >
      <ChevronDown
        aria-hidden="true"
        className="h-6 w-6 animate-bounce-down transition-transform group-hover:translate-y-0.5 motion-reduce:animate-none"
        strokeWidth={2.4}
      />
    </button>
  );

  return (
    <section
      id="top"
      className="relative z-10 w-full overflow-x-clip bg-background"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(13,13,13,0.04)_0%,rgba(13,13,13,0)_38%,rgba(143,120,181,0.14)_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-20 h-px bg-gradient-to-r from-transparent via-black/12 to-transparent"
      />

      {titleBlock}

      <div className="relative flex flex-col items-center gap-5 px-6 pb-8 pt-5 lg:hidden">
        <div className="relative z-20 w-full max-w-[560px]">{box}</div>
        <div className="relative z-30 w-full pb-4">{cta}</div>
        <CurvedLoop
          text={t.hero.marquee}
          speed={reduceMotion ? 0 : 46}
          reverse
          className="z-0 -mt-4 text-fire/16"
        />
        {scrollCue}
      </div>

      <div className="hidden lg:block relative min-h-[100dvh]">
        <div className="absolute bottom-[-7vw] left-[-1vw] z-20 w-[74vw] max-w-[1220px]">
          {box}
        </div>

        <div className="absolute right-[4vw] top-[58%] z-30 w-[32vw] max-w-[430px]">
          <div className="border-l-2 border-black/10 pl-7">{cta}</div>
        </div>

        {scrollCue}
      </div>
    </section>
  );
}
