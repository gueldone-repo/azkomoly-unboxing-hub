import type { CSSProperties, ElementType, ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

type SplitTextProps = {
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/** Simple entrance animation wrapper for headline blocks. */
export function SplitText({ as = "h2", className, style, children }: SplitTextProps) {
  const reduceMotion = useReducedMotion();
  const Comp = motion(as as ElementType);

  return (
    <Comp
      className={className}
      style={style}
      initial={reduceMotion ? false : { opacity: 0, y: 26 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  );
}

export default SplitText;
