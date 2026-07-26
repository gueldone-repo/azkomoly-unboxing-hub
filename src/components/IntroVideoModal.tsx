import { useEffect, useRef, useState } from "react";
import { X, Volume2, VolumeX } from "lucide-react";
import videoAsset from "@/assets/azk-intro.mp4.asset.json";
import posterAsset from "@/assets/azk-intro-poster.jpg.asset.json";

const SEEN_KEY = "azkomoly_intro_video_v1";
// Se muestra una vez cada 24h por visitante.
const TTL_MS = 24 * 60 * 60 * 1000;

export function IntroVideoModal() {
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let seen = 0;
    try {
      seen = Number(window.localStorage.getItem(SEEN_KEY) ?? 0);
    } catch {
      /* storage bloqueado */
    }
    if (Date.now() - seen < TTL_MS) return;

    // Esperamos a que la página termine de cargar para no competir por ancho de banda.
    const start = () => window.setTimeout(() => setOpen(true), 400);
    if (document.readyState === "complete") {
      start();
      return;
    }
    window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, []);

  useEffect(() => {
    if (!open) return;
    try {
      window.localStorage.setItem(SEEN_KEY, String(Date.now()));
    } catch {
      /* noop */
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-3 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Bemutató videó"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative w-full max-w-[min(420px,calc((100dvh-6rem)*0.5625))]"
        onClick={(e) => e.stopPropagation()}
      >
        <video
          ref={videoRef}
          src={videoAsset.url}
          poster={posterAsset.url}
          autoPlay
          muted={muted}
          playsInline
          preload="auto"
          onEnded={() => setOpen(false)}
          className="w-full h-auto max-h-[calc(100dvh-6rem)] object-contain bg-black border border-cardboard/30"
        />

        <button
          type="button"
          onClick={() => {
            const v = videoRef.current;
            const next = !muted;
            setMuted(next);
            if (v) {
              v.muted = next;
              void v.play().catch(() => {});
            }
          }}
          aria-label={muted ? "Hang bekapcsolása" : "Némítás"}
          className="absolute bottom-3 left-3 grid place-items-center h-10 w-10 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
        >
          {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>

        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Bezárás"
          className="absolute -top-3 -right-3 grid place-items-center h-11 w-11 rounded-full bg-fire text-black hover:scale-105 transition-transform shadow-lg"
        >
          <X className="h-6 w-6" />
        </button>

        <button
          type="button"
          onClick={() => setOpen(false)}
          className="mt-3 w-full font-sans text-xs uppercase tracking-[0.3em] text-white/70 hover:text-fire transition-colors"
        >
          Kihagyás
        </button>
      </div>
    </div>
  );
}
