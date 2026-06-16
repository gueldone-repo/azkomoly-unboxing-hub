import { useEffect } from "react";
import { useShopifyCart } from "@/lib/shopify/cart-store";

/** Mount once at the app root. Clears the local cart when Shopify reports it
 *  is empty (e.g. after the user completed checkout in another tab). */
export function useCartSync() {
  const syncCart = useShopifyCart((s) => s.syncCart);
  useEffect(() => {
    syncCart();
    const onVis = () => {
      if (document.visibilityState === "visible") syncCart();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [syncCart]);
}
