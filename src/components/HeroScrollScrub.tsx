import { useEffect, useRef } from "react";

const FRAME_COUNT = 101;
const FRAME_URL = (i: number) =>
  `/hero-frames/f_${String(i + 1).padStart(3, "0")}.jpg`;

const clamp = (min: number, max: number, v: number) =>
  Math.min(max, Math.max(min, v));

export function HeroScrollScrub({ onCta }: { onCta: () => void }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const rafRef = useRef<number | null>(null);
  const currentFrameRef = useRef(-1);
  const progressRef = useRef(0);

  // Preload all frames
  useEffect(() => {
    const imgs: HTMLImageElement[] = [];
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = FRAME_URL(i);
      if (i === 0) img.onload = () => draw(0);
      imgs.push(img);
    }
    framesRef.current = imgs;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Size canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      currentFrameRef.current = -1;
      draw(progressRef.current);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const draw = (p: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const idx = clamp(0, FRAME_COUNT - 1, Math.round(p * (FRAME_COUNT - 1)));
    if (idx === currentFrameRef.current) return;
    const img = framesRef.current[idx];
    if (!img || !img.complete || !img.naturalWidth) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cw = canvas.width;
    const ch = canvas.height;
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    currentFrameRef.current = idx;
  };

  useEffect(() => {
    const tick = () => {
      rafRef.current = null;
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = el.offsetHeight - window.innerHeight;
      const scrolled = clamp(0, scrollable, -rect.top);
      const p = scrollable > 0 ? scrolled / scrollable : 0;
      progressRef.current = p;
      draw(p);
    };
    const onScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(tick);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const py = (mult: number) =>
    `translate3d(0, ${progressRef.current * mult}px, 0)`;

  return (
    <section
      ref={sectionRef}
      style={{ height: "320vh" }}
      className="relative w-full"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-dark-bg">
        {/* Scroll-scrubbed video canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {/* Dark vignette for typography contrast */}
        <div className="absolute inset-0 bg-background/40" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-dark-bg/80 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-dark-bg/95 via-dark-bg/50 to-transparent" />

        {/* Giant brand word — mix-blend-difference */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-2">
          <h1
            className="font-display leading-none text-foreground"
            style={{
              mixBlendMode: "difference",
              transform: py(-60),
              fontSize: "clamp(2.8rem, 15vw, 17rem)",
              whiteSpace: "nowrap",
            }}
          >
            AZKOMOLY
          </h1>
        </div>

        {/* Top-left meta */}
        <div
          className="absolute left-6 top-24 font-sans text-xs tracking-[0.3em] text-foreground/90"
          style={{ transform: py(-30) }}
        >
          EST · MMXXVI
        </div>

        {/* Top-right index */}
        <div
          className="absolute right-6 top-24 flex items-center gap-3 font-sans text-xs tracking-[0.3em] text-foreground/90"
          style={{ transform: py(-45) }}
        >
          <span className="text-fire">/01</span>
          <span>MYSTERY · BOX</span>
        </div>

        {/* Tagline bottom-left */}
        <p
          className="absolute bottom-32 left-6 max-w-xs font-sans text-sm leading-snug text-foreground/90"
          style={{ transform: py(20) }}
        >
          Márkás ruhák. Véletlenszerű tartalom. Nevetséges áron.
        </p>

        {/* Scroll cue bottom-right */}
        <div
          className="absolute bottom-32 right-6 flex items-center gap-2 font-sans text-xs tracking-[0.3em] text-foreground/90"
          style={{ transform: py(30) }}
        >
          <span className="h-px w-8 bg-foreground" />
          GÖRGESS
        </div>

        {/* CTA */}
        <div className="absolute inset-x-0 bottom-10 z-10 flex justify-center px-6">
          <button
            onClick={onCta}
            className="bg-fire text-primary-foreground font-display text-lg sm:text-2xl px-8 py-4 graffiti-border hover:translate-y-[-2px] transition-transform"
          >
            Légy az első, aki felfedi a titkot
          </button>
        </div>

        {/* Corner brackets — viewfinder framing */}
        <span className="pointer-events-none absolute left-4 top-4 h-8 w-8 border-l-2 border-t-2 border-fire" />
        <span className="pointer-events-none absolute right-4 top-4 h-8 w-8 border-r-2 border-t-2 border-fire" />
        <span className="pointer-events-none absolute bottom-4 left-4 h-8 w-8 border-b-2 border-l-2 border-fire" />
        <span className="pointer-events-none absolute bottom-4 right-4 h-8 w-8 border-b-2 border-r-2 border-fire" />
      </div>
    </section>
  );
}
