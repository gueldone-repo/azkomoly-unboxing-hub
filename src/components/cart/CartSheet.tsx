import { ShoppingBag, X, Minus, Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { useShopifyCart, type CartItem } from "@/lib/shopify/cart-store";
import { formatShopifyPrice } from "@/lib/shopify/client";
import { useT } from "@/lib/i18n";

export function CartButton({ className = "" }: { className?: string }) {
  const count = useShopifyCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const setOpen = useShopifyCart((s) => s.setOpen);
  const t = useT();
  const cartLabel = count > 0 ? `${t.cart.title}, ${t.cart.count(count)}` : t.cart.title;
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={cartLabel}
      className={`relative grid h-9 w-9 place-items-center border-2 border-cardboard/50 text-foreground hover:text-fire hover:border-fire transition-colors ${className}`}
    >
      <ShoppingBag className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 grid place-items-center bg-fire text-primary-foreground font-display text-xs leading-none rounded-full">
          {count}
        </span>
      )}
    </button>
  );
}

function LineItem({ item }: { item: CartItem }) {
  const updateQuantity = useShopifyCart((s) => s.updateQuantity);
  const removeItem = useShopifyCart((s) => s.removeItem);
  const t = useT();
  const image = item.product.node.images.edges[0]?.node.url;
  const variantLabel = item.variantTitle !== "Default Title" ? item.variantTitle : null;

  return (
    <li className="flex gap-3 border-2 border-cardboard/30 bg-dark-bg p-3">
      <div className="relative h-16 w-16 shrink-0 bg-gradient-to-br from-cardboard/30 to-dark-bg grid place-items-center border border-cardboard/40 overflow-hidden">
        {image ? (
          <img src={image} alt={item.product.node.title} className="w-full h-full object-cover" />
        ) : (
          <span className="font-display text-fire text-2xl text-fire-glow text-stroke-black select-none">?</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-display text-base text-foreground leading-tight truncate">
              {item.product.node.title}
            </p>
            {variantLabel && (
              <p className="font-sans text-xs text-foreground/55">
                {variantLabel}
              </p>
            )}
          </div>
          {/* h-9 w-9 (36px) + el padding del botón acercan el target táctil a
              las 44px recomendadas — antes era un ícono de 16px sin padding. */}
          <button
            onClick={() => removeItem(item.variantId)}
            aria-label={t.cart.remove}
            className="shrink-0 grid place-items-center h-9 w-9 -m-1.5 text-foreground/40 hover:text-destructive transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex items-center border-2 border-cardboard/50">
            <button
              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
              className="h-9 w-9 grid place-items-center text-fire hover:bg-cardboard/10"
              aria-label="−"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="h-9 w-8 grid place-items-center font-display text-sm">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
              className="h-9 w-9 grid place-items-center text-fire hover:bg-cardboard/10"
              aria-label="+"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <span className="font-display text-lg text-fire leading-none">
            {formatShopifyPrice({
              amount: String(parseFloat(item.price.amount) * item.quantity),
              currencyCode: item.price.currencyCode,
            })}
          </span>
        </div>
      </div>
    </li>
  );
}

export function CartSheet() {
  const items = useShopifyCart((s) => s.items);
  const isOpen = useShopifyCart((s) => s.isOpen);
  const setOpen = useShopifyCart((s) => s.setOpen);
  const clearCart = useShopifyCart((s) => s.clearCart);
  const getCheckoutUrl = useShopifyCart((s) => s.getCheckoutUrl);
  const t = useT();

  const count = items.reduce((n, i) => n + i.quantity, 0);
  const total = items.reduce((n, i) => n + parseFloat(i.price.amount) * i.quantity, 0);

  function goToCheckout() {
    const url = getCheckoutUrl();
    if (url) window.location.href = url;
  }

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="bg-background border-l-2 border-fire/50 w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="px-5 py-4 border-b-2 border-cardboard/30">
          <SheetTitle className="font-display text-2xl text-fire text-fire-glow flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            {t.cart.title}
            {count > 0 && (
              <span className="font-sans text-sm text-foreground/50">
                · {t.cart.count(count)}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 grid place-items-center px-6 text-center">
            <div>
              <p className="font-sans text-foreground/60">{t.cart.empty}</p>
              <button
                onClick={() => setOpen(false)}
                className="mt-4 inline-block bg-fire text-primary-foreground font-display px-5 py-2.5 btn-drip hover:translate-y-[-2px] transition-transform"
              >
                {t.cart.emptyCta}
              </button>
            </div>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {items.map((item) => (
                <LineItem key={item.variantId} item={item} />
              ))}
              <button
                onClick={clearCart}
                className="font-sans text-xs text-foreground/40 hover:text-destructive transition-colors underline"
              >
                {t.cart.clear}
              </button>
            </ul>

            <SheetFooter className="px-5 py-4 border-t-2 border-cardboard/30 flex-col gap-3">
              <div className="flex items-baseline justify-between w-full">
                <span className="font-sans text-sm text-foreground/70">
                  {t.cart.subtotal}
                </span>
                <span className="font-display text-2xl text-fire">
                  {formatShopifyPrice({ amount: String(total), currencyCode: "HUF" })}
                </span>
              </div>
              <p className="font-sans text-xs text-foreground/45 w-full">
                {t.cart.shippingNote}
              </p>
              <button
                onClick={goToCheckout}
                disabled={!getCheckoutUrl()}
                className="w-full bg-fire text-primary-foreground font-display text-xl py-4 btn-drip hover:translate-y-[-2px] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t.cart.checkout} →
              </button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
