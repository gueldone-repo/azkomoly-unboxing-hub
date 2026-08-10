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

  // El titular pasa a ser el texto curvo en movimiento. Pero ese texto vive
  // dentro de un <textPath> de SVG y encima con opacidad baja: Google lo indexa
  // mucho peor que un encabezado normal, y perder el H1 es perder la señal más
  // fuerte de la página.
  //
  // Por eso el <h1> SIGUE EXISTIENDO, con el mismo texto, sólo que oculto a la
  // vista (no con `display:none`, que lo borraría también para los buscadores,
  // sino recortado a 1px: la técnica estándar que Google y los lectores de
  // pantalla sí leen). Diseño intacto, SEO intacto.
  const seoTitle = (
    <h1 className="absolute h-px w-px overflow-hidden [clip:rect(0,0,0,0)] whitespace-nowrap border-0 p-0 [clip-path:inset(50%)]">
      {t.hero.heading.replace("\n", " ")}
    </h1>
  );

  // El titular visible: el mismo texto, curvo, en morado translúcido.
  const curvedTitle = (
    <CurvedLoop
      text={`${t.hero.heading.replace("\n", " ")} ✦ `}
      speed={reduceMotion ? 0 : 38}
      reverse
      // Morado a plena fuerza: al 35% se leía apagado y el titular perdía peso.
      // El texto sale de `t.hero.heading`, así que sigue traducido (hu/en).
      className="font-display text-fire [&_text]:![font-family:'Bungee',var(--font-display)]"
    />
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
        className={`btn-3d px-8 py-4 font-sans text-base font-semibold tracking-wide sm:text-lg ${
          onWave
            ? "bg-white text-fire hover:bg-white/92"
            : "bg-fire text-white hover:bg-[#4c238f]"
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

      {seoTitle}

      <div className="relative flex flex-col items-center gap-5 px-6 pb-8 pt-20 lg:hidden">
        <div className="relative z-10 w-full">{curvedTitle}</div>
        <div className="relative z-20 -mt-2 w-full max-w-[560px]">{box}</div>
        <div className="relative z-30 w-full pb-4">{renderCta(false)}</div>
        {scrollCue}
      </div>

      <div className="hidden lg:block relative min-h-[100dvh]">
        {/* El titular, ahora en movimiento: mismo texto que el <h1> oculto,
            curvo y translúcido. Arriba del todo, por encima de la caja. */}
        <div className="pointer-events-none absolute inset-x-0 top-[9%] z-[1]">{curvedTitle}</div>

        {/* Sticker de marca en el hueco vacío de la izquierda. z-[2]: sobre la
            onda y el titular curvo, pero por debajo de la caja (z-20), así
            acompaña sin robarle protagonismo al producto. Entra ladeado, como
            una pegatina puesta a mano. */}
        <motion.img
          src="/sticker-azk.webp"
          alt=""
          aria-hidden="true"
          width={721}
          height={580}
          loading="lazy"
          draggable={false}
          className="pointer-events-none absolute left-[3vw] top-[15%] z-[2] w-[17vw] max-w-[240px]"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.7, rotate: -18 }}
          animate={reduceMotion ? undefined : { opacity: 1, scale: 1, rotate: -7 }}
          transition={{ type: "spring", stiffness: 140, damping: 12, delay: 0.55 }}
        />

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
        <div className="absolute right-[4vw] top-[40%] z-30 w-[34vw] max-w-[460px]">
          <div className="rounded-3xl border border-white/60 bg-white/45 p-7 shadow-[0_20px_50px_rgba(13,13,13,0.13),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl">
            {renderCta(false)}
          </div>
        </div>

        {scrollCue}
      </div>
    </section>
  );
}
