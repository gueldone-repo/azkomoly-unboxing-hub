import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type RotatingTextProps = {
  phrases: string[];
  interval?: number;
  className?: string;
};

/** Cycles through phrases with a soft fade/slide. */
export function RotatingText({ phrases, interval = 2600, className }: RotatingTextProps) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const list = phrases?.length ? phrases : [""];

  useEffect(() => {
    if (list.length < 2) return undefined;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % list.length);
    }, interval);
    return () => window.clearInterval(id);
  }, [list.length, interval]);

  const current = list[index % list.length];

  return (
    <span className={`block overflow-hidden ${className ?? ""}`.trim()}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={current}
          className="block"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          {current}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default RotatingText;
