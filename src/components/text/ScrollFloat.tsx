import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ScrollFloat({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const rootRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const chars = Array.from(root.querySelectorAll<HTMLSpanElement>("[data-char]"));

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Antes iba con `scrub: true`, o sea atada al scroll: si no recorrías
      // justo ese tramo (o recargabas con la sección ya en pantalla), el texto
      // se quedaba a medias o invisible, que es el fallo que se veía. Ahora se
      // dispara una vez al entrar en pantalla y se reproduce entera, con su
      // propia duración, así siempre acaba visible.
      gsap.fromTo(
        chars,
        { yPercent: 120, rotateX: -46, opacity: 0 },
        {
          yPercent: 0,
          rotateX: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.02,
          scrollTrigger: {
            trigger: root,
            // 92% = arranca en cuanto asoma por abajo, sin esperar.
            start: "top 92%",
            once: true,
          },
        }
      );
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(chars, { yPercent: 0, rotateX: 0, opacity: 1 });
    });

    return () => mm.revert();
  }, []);

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
