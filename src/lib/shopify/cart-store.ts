import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  addLineToShopifyCart,
  createShopifyCart,
  getShopifyCart,
  removeLineFromShopifyCart,
  updateShopifyCartLine,
  type Money,
  type ShopifyProduct,
} from "./client";

export interface CartItem {
  lineId: string | null;
  product: ShopifyProduct;
  variantId: string;
  variantTitle: string;
  price: Money;
  quantity: number;
  selectedOptions: Array<{ name: string; value: string }>;
}

interface CartStore {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  discountCode: string | null;
  isLoading: boolean;
  isSyncing: boolean;
  isOpen: boolean;
  setOpen: (v: boolean) => void;
  setDiscountCode: (code: string) => void;
  addItem: (item: Omit<CartItem, "lineId">) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  clearCart: () => void;
  syncCart: () => Promise<void>;
  getCheckoutUrl: () => string | null;
}

export const useShopifyCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      checkoutUrl: null,
      discountCode: null,
      isLoading: false,
      isSyncing: false,
      isOpen: false,
      setOpen: (v) => set({ isOpen: v }),
      setDiscountCode: (code) => set({ discountCode: code }),

      addItem: async (item) => {
        const { items, cartId, clearCart } = get();
        const existing = items.find((i) => i.variantId === item.variantId);
        set({ isLoading: true });
        try {
          if (!cartId) {
            const res = await createShopifyCart(item.variantId, item.quantity);
            if (res) {
              set({
                cartId: res.cartId,
                checkoutUrl: res.checkoutUrl,
                items: [{ ...item, lineId: res.lineId }],
                isOpen: true,
              });
            }
          } else if (existing) {
            if (!existing.lineId) return;
            const newQty = existing.quantity + item.quantity;
            const res = await updateShopifyCartLine(cartId, existing.lineId, newQty);
            if (res.success) {
              set({
                items: get().items.map((i) =>
                  i.variantId === item.variantId ? { ...i, quantity: newQty } : i,
                ),
                isOpen: true,
              });
            } else if (res.cartNotFound) clearCart();
          } else {
            const res = await addLineToShopifyCart(cartId, item.variantId, item.quantity);
            if (res.success) {
              set({
                items: [...get().items, { ...item, lineId: res.lineId ?? null }],
                isOpen: true,
              });
            } else if (res.cartNotFound) clearCart();
          }
        } catch (e) {
          console.error("[Cart] add failed", e);
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (variantId, quantity) => {
        if (quantity <= 0) return get().removeItem(variantId);
        const { items, cartId, clearCart } = get();
        const item = items.find((i) => i.variantId === variantId);
        if (!item?.lineId || !cartId) return;
        set({ isLoading: true });
        try {
          const res = await updateShopifyCartLine(cartId, item.lineId, quantity);
          if (res.success) {
            set({
              items: get().items.map((i) =>
                i.variantId === variantId ? { ...i, quantity } : i,
              ),
            });
          } else if (res.cartNotFound) clearCart();
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (variantId) => {
        const { items, cartId, clearCart } = get();
        const item = items.find((i) => i.variantId === variantId);
        if (!item?.lineId || !cartId) return;
        set({ isLoading: true });
        try {
          const res = await removeLineFromShopifyCart(cartId, item.lineId);
          if (res.success) {
            const next = get().items.filter((i) => i.variantId !== variantId);
            if (next.length === 0) clearCart();
            else set({ items: next });
          } else if (res.cartNotFound) clearCart();
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: () =>
        set({ items: [], cartId: null, checkoutUrl: null }),

      getCheckoutUrl: () => {
        const { checkoutUrl, discountCode } = get();
        if (!checkoutUrl) return null;
        if (!discountCode) return checkoutUrl;
        try {
          const u = new URL(checkoutUrl);
          u.searchParams.set("discount", discountCode);
          return u.toString();
        } catch {
          return checkoutUrl;
        }
      },

      syncCart: async () => {
        const { cartId, isSyncing, clearCart } = get();
        if (!cartId || isSyncing) return;
        set({ isSyncing: true });
        try {
          const data = await getShopifyCart(cartId);
          if (!data) return;
          const cart = (data as any)?.data?.cart;
          if (!cart || cart.totalQuantity === 0) clearCart();
        } catch (e) {
          console.error("[Cart] sync failed", e);
        } finally {
          set({ isSyncing: false });
        }
      },
    }),
    {
      name: "azkomoly-shopify-cart-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        items: s.items,
        cartId: s.cartId,
        checkoutUrl: s.checkoutUrl,
        discountCode: s.discountCode,
      }),
    },
  ),
);
