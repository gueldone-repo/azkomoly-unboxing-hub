import { ShoppingBag, X, Minus, Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { useCart, type CartLine } from "@/lib/cart";
import { useT } from "@/lib/i18n";
import { MOCK_PRODUCTS, formatHUF } from "@/lib/mock-products";

/** Cart icon + item-count badge. Place in any header. */
export function CartButton({ className = "" }: { className?: string }) {
  const { count, setOpen } = useCart();
  const t = useT();
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={t.cart.title}
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

function LineItem({ line }: { line: CartLine }) {
  const { setQty, remove } = useCart();
  const t = useT();
  const product = MOCK_PRODUCTS.find((p) => p.id === line.productId);
  const copy = t.products.items[line.productId];
  if (!product || !copy) return null;

  return (
    <li className="flex gap-3 border-2 border-cardboard/30 bg-dark-bg p-3">
      {/* Mini box thumb */}
      <div className="relative h-16 w-16 shrink-0 bg-gradient-to-br from-cardboard/30 to-dark-bg grid place-items-center border border-cardboard/40">
        <span className="font-display text-fire text-2xl text-fire-glow text-stroke-black select-none">
          ?
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-display text-base text-foreground leading-tight truncate">
              {copy.name}
            </p>
            <p className="font-sans text-xs text-foreground/55">
              {t.cart.size}: <span className="text-fire">{line.size}</span>
            </p>
          </div>
          <button
            onClick={() => remove(line.key)}
            aria-label={t.cart.remove}
            className="shrink-0 text-foreground/40 hover:text-destructive transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex items-center border-2 border-cardboard/50">
            <button
              onClick={() => setQty(line.key, line.qty - 1)}
              className="h-7 w-7 grid place-items-center text-fire hover:bg-cardboard/10"
              aria-label="−"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="h-7 w-8 grid place-items-center font-display text-sm">
              {line.qty}
            </span>
            <button
              onClick={() => setQty(line.key, line.qty + 1)}
              className="h-7 w-7 grid place-items-center text-fire hover:bg-cardboard/10"
              aria-label="+"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <span className="font-display text-lg text-fire leading-none">
            {formatHUF(product.price * line.qty)}
          </span>
        </div>
      </div>
    </li>
  );
}

/** Controlled cart drawer. Mount once at the app root. */
export function CartSheet() {
  const { items, open, setOpen, total, count, clear } = useCart();
  const t = useT();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
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
                className="mt-4 inline-block bg-fire text-primary-foreground font-display px-5 py-2.5 graffiti-border hover:translate-y-[-2px] transition-transform"
              >
                {t.cart.emptyCta}
              </button>
            </div>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {items.map((line) => (
                <LineItem key={line.key} line={line} />
              ))}
              <button
                onClick={clear}
                className="font-sans text-xs text-foreground/40 hover:text-destructive transition-colors underline"
              >
                {t.cart.clear}
              </button>
            </ul>

            <SheetFooter className="px-5 py-4 border-t-2 border-cardboard/30 flex-col gap-3 sm:flex-col sm:space-x-0">
              <div className="flex items-baseline justify-between w-full">
                <span className="font-sans text-sm text-foreground/70">
                  {t.cart.subtotal}
                </span>
                <span className="font-display text-2xl text-fire">
                  {formatHUF(total)}
                </span>
              </div>
              <p className="font-sans text-xs text-foreground/45 w-full">
                {t.cart.shippingNote}
              </p>
              <button className="w-full bg-fire text-primary-foreground font-display text-xl py-4 graffiti-border hover:translate-y-[-2px] transition-transform">
                {t.cart.checkout} →
              </button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
