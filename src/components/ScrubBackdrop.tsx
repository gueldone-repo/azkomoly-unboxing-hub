import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const FRAME_COUNT = 101;
const FRAME_URL = (i: number) =>
  `/hero-frames/f_${String(i + 1).padStart(3, "0")}.jpg`;

const clamp = (min: number, max: number, v: number) =>
  Math.min(max, Math.max(min, v));

const ScrubCtx = createContext<number>(0);
export const useScrubProgress = () => useContext(ScrubCtx);

/**
 * Wraps a stack of sections. Renders a sticky <canvas> background that
 * scrubs through extracted video frames as the user scrolls through the
 * whole wrapper. Children render on top — give them transparent or
 * semi-transparent backgrounds for the video to bleed through.
 */
export function ScrubBackdrop({ children }: { children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const rafRef = useRef<number | null>(null);
  const currentFrameRef = useRef(-1);
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);

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

  // Size canvas to its container
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
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = el.offsetHeight - window.innerHeight;
      const scrolled = clamp(0, scrollable, -rect.top);
      const p = scrollable > 0 ? scrolled / scrollable : 0;
      progressRef.current = p;
      draw(p);
      // Update React state at most ~30fps for parallax-driven children
      setProgress((prev) => (Math.abs(prev - p) > 0.002 ? p : prev));
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

  return (
    <ScrubCtx.Provider value={progress}>
      <div ref={wrapperRef} className="relative bg-dark-bg">
        {/* Sticky scrubbed canvas — covers the whole wrapper height */}
        <div className="pointer-events-none absolute inset-0">
          <div className="sticky top-0 h-screen w-full overflow-hidden">
            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
            {/* Dimmer + edge gradients so typography stays readable */}
            <div className="absolute inset-0 bg-background/40" />
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-dark-bg/80 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-dark-bg via-dark-bg/70 to-transparent" />
          </div>
        </div>
        {/* Children scroll on top of the sticky canvas */}
        <div className="relative">{children}</div>
      </div>
    </ScrubCtx.Provider>
  );
}
