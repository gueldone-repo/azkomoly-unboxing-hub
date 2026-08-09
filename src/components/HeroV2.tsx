import { ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { useT } from "@/lib/i18n";
import { WaveBackdrop } from "@/components/WaveBackdrop";
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
        // Bungee en vez de Anton. Anton es condensada y de trazo uniforme: a
        // este tamaño se aplana y pierde fuerza. Bungee está hecha para rótulos
        // urbanos, tiene el trazo mucho más grueso y pega con el logo de
        // graffiti, así que el peso lo da la propia letra y no hace falta
        // sombra. Un punto más pequeña porque Bungee ocupa bastante más.
        fontFamily: "'Bungee', var(--font-display)",
        fontSize: "clamp(2.4rem, 6.8vw, 6rem)",
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

  /**
   * `onWave` = el bloque se apoya sobre la onda morada.
   *
   * En escritorio el texto caía justo encima de la onda: gris oscuro sobre
   * morado y, peor, el botón morado sobre morado — se perdía entero. Sobre la
   * onda el orden de capas es: SVG al fondo, letras encima y en blanco, y el
   * botón invertido (blanco con texto morado) para que sea lo que más resalta.
   */
  const renderCta = (onWave: boolean) => (
    <motion.div
      className="flex flex-col items-center gap-5 text-center lg:items-start lg:text-left"
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1], delay: 0.46 }}
    >
      {/* Sigue siendo un <h2> real: es el subtítulo del hero, no un adorno.
          La frase que rota va SIEMPRE en morado de marca, que es lo que le da
          presencia; sobre la onda cambia a blanco sólo porque en morado sobre
          morado desaparecería. */}
      <h2
        className={`max-w-[30ch] font-sans text-base font-normal leading-relaxed sm:text-lg ${
          onWave ? "text-white/90" : "text-foreground/76"
        }`}
      >
        <span className="block">{t.hero.tagline}</span>
        <RotatingText
          phrases={t.hero.rotatingTaglines}
          className={`mt-2 text-lg font-bold sm:text-xl ${onWave ? "text-white" : "text-fire"}`}
        />
      </h2>
      <button
        type="button"
        onClick={scrollToProducts}
        className={`rounded-full px-8 py-4 font-sans text-base font-semibold tracking-wide transition-all duration-200 hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] sm:text-lg ${
          onWave
            ? "bg-white text-fire shadow-[0_16px_32px_rgba(13,13,13,0.22)] hover:bg-white/92"
            : "bg-fire text-white shadow-[0_16px_32px_rgba(13,13,13,0.18),0_8px_22px_rgba(91,46,168,0.30)] hover:bg-[#4c238f]"
        }`}
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
      {/* Fondo del hero: SOLO la onda. Antes había encima un degradado gris en
          diagonal a pantalla completa y una línea difuminada bajo el navbar;
          juntos se leían como un rectángulo sucio flotando sobre el hero. La
          onda es lo único que hace de fondo y, además, es lo que conecta el
          hero con la sección morada de productos. */}
      <WaveBackdrop />

      {titleBlock}

      <div className="relative flex flex-col items-center gap-5 px-6 pb-8 pt-5 lg:hidden">
        <div className="relative z-20 w-full max-w-[560px]">{box}</div>
        <div className="relative z-30 w-full pb-4">{renderCta(false)}</div>
        <CurvedLoop
          text={t.hero.marquee}
          speed={reduceMotion ? 0 : 46}
          reverse
          className="z-0 -mt-4 text-fire/16"
        />
        {scrollCue}
      </div>

      <div className="hidden lg:block relative min-h-[100dvh]">
        {/* Texto de marca curvo, en morado, como capa de fondo. Va en z-[1]:
            por encima de la onda (z-0) pero por debajo de la caja (z-20) y del
            texto (z-30), así decora sin competir con nada legible. */}
        <div className="pointer-events-none absolute inset-x-0 top-[30%] z-[1] opacity-70">
          <CurvedLoop
            text={t.hero.marquee}
            speed={reduceMotion ? 0 : 42}
            reverse
            className="text-fire/25"
          />
        </div>

        <div className="absolute bottom-[-3.5vw] left-[-1vw] z-20 w-[74vw] max-w-[1220px]">
          {box}
        </div>

        {/* El bloque se queda SOBRE el blanco, por encima de donde arranca la
            onda. Ponerlo encima del morado obligaba a pintarlo en blanco, y
            bastaba que la onda subiera o bajara un poco para que quedara blanco
            sobre blanco, invisible. Sobre blanco el texto va en su color de
            marca y no depende de dónde caiga la curva. */}
        {/* Caja 3D translúcida (prueba): cristal esmerilado con un borde claro
            arriba y sombra proyectada abajo, que es lo que da la sensación de
            volumen. Sustituye al filete lateral. */}
        <div className="absolute right-[4vw] top-[54%] z-30 w-[34vw] max-w-[460px]">
          <div className="rounded-3xl border border-white/60 bg-white/45 p-7 shadow-[0_20px_50px_rgba(13,13,13,0.13),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl">
            {renderCta(false)}
          </div>
        </div>

        {scrollCue}
      </div>
    </section>
  );
}
