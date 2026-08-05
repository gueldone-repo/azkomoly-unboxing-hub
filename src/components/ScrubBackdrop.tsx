import { createContext, useContext, type ReactNode } from "react";

const ScrubCtx = createContext<number>(0);
export const useScrubProgress = () => useContext(ScrubCtx);

/**
 * Wrapper de fondo liso para el hero + sección de productos. La imagen de
 * fondo del hero vive dentro de HeroOverlay (sin sticky, scrollea normal).
 */
export function ScrubBackdrop({ children }: { children: ReactNode }) {
  return (
    <ScrubCtx.Provider value={0}>
      <div className="relative bg-background">
        <div className="relative">{children}</div>
      </div>
    </ScrubCtx.Provider>
  );
}
