import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export function SlidingNumber({
  value,
  pad = 2,
  className = "",
}: {
  value: number;
  pad?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const text = Math.max(0, value).toString().padStart(pad, "0");

  return (
    <span className={`inline-flex tabular-nums ${className}`} aria-label={text}>
      {text.split("").map((digit, index) => (
        // `w-[0.64em]` recortaba el dígito en fuentes/pesos donde el número
        // renderiza más ancho que eso (ej. `font-semibold`, tamaños chicos en
        // mobile) — "no se ve el número completo". Con más ancho y overflow
        // visible en el eje X (sólo se recorta el slide vertical) no se corta
        // ningún dígito en ningún tamaño.
        <span key={index} className="relative inline-block h-[1.15em] w-[0.75em] overflow-x-visible overflow-y-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={digit}
              initial={reduceMotion ? false : { y: "100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={reduceMotion ? undefined : { y: "-100%", opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 grid place-items-center"
            >
              {digit}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  );
}
