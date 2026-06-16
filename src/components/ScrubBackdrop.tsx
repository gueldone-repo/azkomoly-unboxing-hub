import { createContext, useContext, type ReactNode } from "react";

const ScrubCtx = createContext<number>(0);
export const useScrubProgress = () => useContext(ScrubCtx);

/**
 * Sticky image backdrop — HERO_1_FRAME.jpeg se queda fija detrás mientras
 * el usuario scrollea por el hero y la sección de productos.
 */
export function ScrubBackdrop({ children }: { children: ReactNode }) {
  return (
    <ScrubCtx.Provider value={0}>
      <div className="relative bg-dark-bg">
        {/* Sticky background image */}
        <div className="pointer-events-none absolute inset-0">
          <div className="sticky top-0 h-screen w-full overflow-hidden">
            <img
              src="/HERO_1_FRAME.jpeg"
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/40 via-dark-bg/20 to-dark-bg/70" />
          </div>
        </div>
        {/* Children scroll on top of the sticky image */}
        <div className="relative">{children}</div>
      </div>
    </ScrubCtx.Provider>
  );
}
