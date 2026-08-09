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
    moveBy += directionRef.current * moveBy * Math.abs(factor);
    baseX.set(baseX.get() + moveBy);
  });

  useEffect(() => {
    if (reduceMotion) baseX.set(0);
  }, [baseX, reduceMotion]);

  const x = useTransform(baseX, (v) => `${v % 50 - 50}%`);

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
