import { motion, useReducedMotion } from "motion/react";

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
        <span key={`${index}-${digit}`} className="relative inline-block h-[1em] w-[0.64em] overflow-hidden">
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
        </span>
      ))}
    </span>
  );
}
