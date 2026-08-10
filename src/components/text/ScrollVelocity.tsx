import { useEffect, useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";

export function ScrollVelocity({
  text,
  baseVelocity = 42,
  className = "",
}: {
  text: string;
  baseVelocity?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [-1000, 0, 1000], [-2, 0, 2], { clamp: false });
  const directionRef = useRef(1);

  useAnimationFrame((_time, delta) => {
    if (reduceMotion) return;
    let moveBy = directionRef.current * baseVelocity * (delta / 1000);
    const factor = velocityFactor.get();
    if (factor < 0) directionRef.current = -1;
    else if (factor > 0) directionRef.current = 1;
    // El empujón del scroll se limita: sin tope, un scroll rápido multiplicaba
    // la velocidad varias veces y el texto salía disparado.
    moveBy += directionRef.current * moveBy * Math.min(Math.abs(factor), 1.2);
    baseX.set(baseX.get() + moveBy);
  });

  useEffect(() => {
    if (reduceMotion) baseX.set(0);
  }, [baseX, reduceMotion]);

  // El salto venía de aquí: `v % 50 - 50` no casa con las 4 copias del texto.
  // Con 4 copias iguales, una copia entera son 25% del ancho, así que el bucle
  // tiene que envolver cada 25% para que el corte sea invisible. Además el
  // módulo de JS devuelve negativo con entradas negativas, lo que provocaba el
  // tirón al cambiar de signo; por eso se normaliza a un rango positivo.
  const x = useTransform(baseX, (v) => {
    const span = 25;
    const wrapped = (((v % span) + span) % span) - span;
    return `${wrapped}%`;
  });

  return (
    <div className={`relative flex overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div className="flex min-w-max" style={{ x }}>
        {Array.from({ length: 4 }, (_, i) => (
          <span key={i} className="px-5">
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
