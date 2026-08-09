import { useEffect, useId, useRef, useState } from "react";

type CurvedLoopProps = {
  text: string;
  /** px per second; 0 disables the animation */
  speed?: number;
  reverse?: boolean;
  className?: string;
};

const VIEW_W = 1200;
const VIEW_H = 200;

/** Marquee text following a gentle curved SVG path. */
export function CurvedLoop({ text, speed = 50, reverse = false, className }: CurvedLoopProps) {
  const rawId = useId();
  const pathId = `curved-loop-${rawId.replace(/:/g, "")}`;
  const [offset, setOffset] = useState(0);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (!speed) return undefined;
    let last = performance.now();
    const step = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setOffset((prev) => {
        const next = prev + dt * speed * (reverse ? -1 : 1);
        return ((next % VIEW_W) + VIEW_W) % VIEW_W;
      });
      frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [speed, reverse]);

  const unit = `${text}   ·   `;
  const loopText = unit.repeat(12);

  return (
    <div className={`pointer-events-none w-full select-none ${className ?? ""}`.trim()}>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid meet"
        className="h-auto w-full overflow-visible"
        role="img"
        aria-label={text}
      >
        <defs>
          <path
            id={pathId}
            d={`M -200 140 Q ${VIEW_W * 0.25} 40 ${VIEW_W * 0.5} 110 T ${VIEW_W + 200} 60`}
            fill="none"
          />
        </defs>
        <text
          fill="currentColor"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 86,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          <textPath href={`#${pathId}`} startOffset={-offset}>
            {loopText}
          </textPath>
        </text>
      </svg>
    </div>
  );
}

export default CurvedLoop;
