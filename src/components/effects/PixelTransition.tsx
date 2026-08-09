import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import "./PixelTransition.css";

export function PixelTransition({
  active,
  onComplete,
  rows = 11,
  columns = 9,
}: {
  active: boolean;
  onComplete?: () => void;
  rows?: number;
  columns?: number;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const cells = useMemo(() => Array.from({ length: rows * columns }, (_, i) => i), [rows, columns]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const pixels = Array.from(root.querySelectorAll<HTMLSpanElement>("[data-pixel]"));

    if (!active) {
      gsap.set(pixels, { scale: 0, opacity: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(pixels, { scale: 0, opacity: 1 });
      gsap.to(pixels, {
        scale: 1,
        duration: 0.18,
        ease: "power2.out",
        stagger: {
          each: 0.012,
          from: "start",
          grid: [rows, columns],
          axis: "x",
        },
        onComplete,
      });
    }, root);

    return () => ctx.revert();
  }, [active, columns, onComplete, rows]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pixel-transition pointer-events-none absolute inset-0 z-30 grid"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
      }}
    >
      {cells.map((cell) => (
        <span key={cell} data-pixel className="block bg-fire opacity-0" />
      ))}
    </div>
  );
}
