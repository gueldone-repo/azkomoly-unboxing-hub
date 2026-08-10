import { useEffect, useRef, useState } from "react";
import { X, Volume2, VolumeX } from "lucide-react";
import videoAsset from "@/assets/azk-intro.mp4.asset.json";
import posterAsset from "@/assets/azk-intro-poster.jpg.asset.json";
import { PixelTransition } from "@/components/effects/PixelTransition";
import { useT } from "@/lib/i18n";

export function IntroVideoModal() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [muted, setMuted] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const skipRef = useRef<HTMLButtonElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const closeWithPixels = () => {
    if (closing) return;
    videoRef.current?.pause();
    setClosing(true);
  };

  useEffect(() => {
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
      if (e.key === "Escape") closeWithPixels();
      if (e.key !== "Tab") return;

      const focusables = Array.from(
        modalRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], video, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) ?? []
      ).filter((el) => !el.hasAttribute("disabled"));

      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    window.setTimeout(() => skipRef.current?.focus(), 0);

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
  }, [open, closing]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex animate-fade-in items-center justify-center bg-black/90 p-3 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-video-title"
      onClick={closeWithPixels}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-[min(430px,calc((100dvh-5rem)*0.5625))] overflow-hidden rounded-md border-2 border-white bg-black shadow-[0_22px_60px_rgba(0,0,0,0.55)]"
        onClick={(e) => e.stopPropagation()}
      >
        <PixelTransition
          active={closing}
          rows={12}
          columns={8}
          onComplete={() => {
            setOpen(false);
            setClosing(false);
          }}
        />

        <div className="absolute left-3 top-3 z-40 max-w-[72%] rounded-sm bg-black/70 px-3 py-2 text-white backdrop-blur">
          <h2 id="intro-video-title" className="font-display text-base leading-none">
            {t.introVideo.title}
          </h2>
          <p className="mt-1 font-sans text-xs leading-snug text-white/78">
            {t.introVideo.copy}
          </p>
        </div>

        <video
          ref={videoRef}
          src={videoAsset.url}
          poster={posterAsset.url}
          autoPlay
          muted={muted}
          playsInline
          preload="auto"
          onEnded={closeWithPixels}
          className="h-auto max-h-[calc(100dvh-5rem)] w-full bg-black object-contain"
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
          aria-label={muted ? t.introVideo.unmute : t.introVideo.mute}
          className="absolute bottom-24 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-fire text-primary-foreground shadow-[0_0_20px_rgba(201,174,235,0.6)] transition-transform hover:scale-105 active:scale-95"
        >
          {muted ? <VolumeX className="h-7 w-7" /> : <Volume2 className="h-7 w-7" />}
        </button>

        <button
          ref={skipRef}
          type="button"
          onClick={closeWithPixels}
          aria-label={t.introVideo.skip}
          className="absolute right-3 top-3 z-50 grid h-11 w-11 place-items-center rounded-full border-2 border-white bg-fire text-primary-foreground shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/45"
        >
          <X className="h-6 w-6" />
        </button>

        <button
          type="button"
          onClick={closeWithPixels}
          className="btn-3d m-4 w-[calc(100%-2rem)] bg-white py-4 font-display text-lg text-fire"
        >
          {t.introVideo.enter}
        </button>
      </div>
    </div>
  );
}
