import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function ScrollFloat({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const rootRef = useRef<HTMLHeadingElement | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const chars = Array.from(root.querySelectorAll<HTMLSpanElement>("[data-char]"));

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          chars,
          { yPercent: 120, rotateX: -46, opacity: 0 },
          {
            yPercent: 0,
            rotateX: 0,
            opacity: 1,
            ease: "none",
            stagger: 0.018,
            scrollTrigger: {
              trigger: root,
              start: "top 88%",
              end: "bottom 48%",
              scrub: true,
            },
          }
        );
      });
      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <h2 ref={rootRef} className={className} aria-label={text}>
      {text.split("").map((char, index) => (
        <span key={`${char}-${index}`} className="inline-block overflow-hidden align-bottom">
          <span data-char className="inline-block">
            {char === " " ? "\u00A0" : char}
          </span>
        </span>
      ))}
    </h2>
  );
}
