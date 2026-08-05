import { useEffect, useRef, useState } from "react";
import { X, Volume2, VolumeX } from "lucide-react";
import videoAsset from "@/assets/azk-intro.mp4.asset.json";
import posterAsset from "@/assets/azk-intro-poster.jpg.asset.json";

export function IntroVideoModal() {
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Solo una vez por sesión de navegación: si el usuario ya lo vio (aunque
    // navegue a /shop/$slug y vuelva a "/"), no debe volver a aparecer hasta
    // que cierre la pestaña/navegador.
    if (sessionStorage.getItem("azkomoly-intro-seen")) return;
    const start = () =>
      window.setTimeout(() => {
        setOpen(true);
        sessionStorage.setItem("azkomoly-intro-seen", "1");
      }, 400);
    if (document.readyState === "complete") {
      start();
      return;
    }
    window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    // Intentamos reproducir con sonido; si el navegador bloquea el autoplay,
    // volvemos a silenciar y reproducimos.
    const v = videoRef.current;
    if (v) {
      v.muted = false;
      v.play().catch(() => {
        setMuted(true);
        if (v) {
          v.muted = true;
          void v.play().catch(() => {});
        }
      });
    }

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
          className="absolute bottom-4 right-4 grid place-items-center h-16 w-16 rounded-full bg-fire text-primary-foreground shadow-[0_0_20px_rgba(201,174,235,0.6)] animate-pulse-glow hover:scale-105 active:scale-95 transition-transform"
        >
          {muted ? <VolumeX className="h-7 w-7" /> : <Volume2 className="h-7 w-7" />}
        </button>

        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Bezárás"
          className="absolute -top-3 -right-3 grid place-items-center h-11 w-11 rounded-full bg-fire text-primary-foreground hover:scale-105 transition-transform shadow-lg"
        >
          <X className="h-6 w-6" />
        </button>

        <button
          type="button"
          onClick={() => setOpen(false)}
          className="mt-4 w-full rounded-md bg-fire py-4 font-display text-lg text-primary-foreground shadow-[0_0_25px_rgba(201,174,235,0.5)] transition-transform hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(201,174,235,0.7)] active:scale-[0.98]"
        >
          Tovább a weboldalra!
        </button>
      </div>
    </div>
  );
}
