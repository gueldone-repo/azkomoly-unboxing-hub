import { create } from "zustand";

/**
 * Estado global del formulario de suscripción ("Subscribe"). Antes vivía como
 * `useState` local de `Landing()` (`index.tsx`) y tres disparadores distintos
 * (navbar, BigCTA, DiscountWidget) recibían `onCta` por props — funcionaba
 * porque los tres estaban dentro del mismo árbol. Al mover la navbar a un
 * componente compartido (`SiteNav`) que se usa en TODAS las páginas, ya no
 * hay un único árbol común desde donde pasar props, así que el diálogo pasa
 * a estado global — mismo patrón que ya usa el carrito (`cart-store.ts`).
 */
type SignupDialogState = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
};

export const useSignupDialogStore = create<SignupDialogState>((set) => ({
  isOpen: false,
  setOpen: (open) => set({ isOpen: open }),
}));
