import { useEffect, useRef } from "react";
import gsap from "gsap";

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
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      gsap.set(chars, { yPercent: 0, rotateX: 0, opacity: 1 });
      return;
    }

    gsap.set(chars, { yPercent: 120, rotateX: -46, opacity: 0 });

    // Antes iba con GSAP ScrollTrigger (`scrub` primero, luego `toggleActions`
    // con `start: "top 92%"`). Ambos dependen de posiciones en píxeles que
    // ScrollTrigger cachea al montar; si el layout se movía después (imágenes
    // cargando, u otra sección cambiando de alto), la segunda vez que
    // entrabas a la sección el texto quedaba invisible — el mismo tipo de
    // fallo que ya habíamos visto una vez con `scrub`. Un IntersectionObserver
    // no cachea nada: recalcula en tiempo real, así que es inmune a ese
    // desfase. `boundingClientRect` distingue por qué lado salió de pantalla:
    // si salió por arriba (se siguió bajando) se queda visible; si salió por
    // abajo (se volvió a subir) se retrae — como pidió Diego.
    const play = () =>
      gsap.to(chars, {
        yPercent: 0,
        rotateX: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.02,
        overwrite: true,
      });
    const reverse = () =>
      gsap.to(chars, {
        yPercent: 120,
        rotateX: -46,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
        stagger: 0.015,
        overwrite: true,
      });

    // Cada callback recalcula el estado correcto en vez de asumir "si no
    // dice nada, dejalo como está": un salto de scroll grande (un ancla, un
    // "ir al final", un flick rápido) puede aterrizar ya pasado el trigger
    // sin que el observer nunca haya reportado `isIntersecting: true`, y
    // "no hacer nada" lo dejaba invisible para siempre. Derivar el estado de
    // `boundingClientRect.top` en cada llamada es idempotente y se autocorrige
    // sin importar qué tan brusco fue el salto.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
          // Visible en pantalla, o ya pasado por arriba (se siguió bajando).
          play();
        } else {
          // Todavía no llega, o se volvió a subir por encima del trigger.
          reverse();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(root);

    return () => io.disconnect();
  }, []);

  return (
    <h2 ref={rootRef} className={className} aria-label={text}>
      {text.split("").map((char, index) => (
        <span key={`${char}-${index}`} className="inline-block overflow-hidden align-bottom">
          <span data-char className="inline-block">
            {char === " " ? " " : char}
          </span>
        </span>
      ))}
    </h2>
  );
}
