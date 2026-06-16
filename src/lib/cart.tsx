import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MOCK_PRODUCTS, type MockProduct } from "./mock-products";

export type CartLine = {
  key: string;
  productId: string;
  slug: string;
  size: string;
  qty: number;
};

const STORAGE_KEY = "azkomoly_cart_v1";

function load(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartLine[]) : [];
  } catch {
    return [];
  }
}

function priceOf(productId: string): number {
  return MOCK_PRODUCTS.find((p) => p.id === productId)?.price ?? 0;
}

type CartValue = {
  items: CartLine[];
  count: number;
  total: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (product: MockProduct, size: string, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const CartCtx = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  // Start empty so SSR and first client render match; hydrate from storage
  // after mount.
  const [items, setItems] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setItems(load());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore quota / private mode */
    }
  }, [items]);

  const add = useCallback((product: MockProduct, size: string, qty = 1) => {
    setItems((prev) => {
      const key = `${product.id}-${size}`;
      const existing = prev.find((l) => l.key === key);
      if (existing) {
        return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l));
      }
      return [...prev, { key, productId: product.id, slug: product.slug, size, qty }];
    });
    setOpen(true);
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((l) => l.key !== key)
        : prev.map((l) => (l.key === key ? { ...l, qty } : l)),
    );
  }, []);

  const remove = useCallback((key: string) => {
    setItems((prev) => prev.filter((l) => l.key !== key));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const { count, total } = useMemo(() => {
    let count = 0;
    let total = 0;
    for (const l of items) {
      count += l.qty;
      total += priceOf(l.productId) * l.qty;
    }
    return { count, total };
  }, [items]);

  const value: CartValue = {
    items,
    count,
    total,
    open,
    setOpen,
    add,
    setQty,
    remove,
    clear,
  };

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart(): CartValue {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
