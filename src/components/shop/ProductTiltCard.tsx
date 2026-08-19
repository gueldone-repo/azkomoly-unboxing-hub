import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import TiltedCard from "./TiltedCard";
import { useShopifyCart } from "@/lib/shopify/cart-store";
import { formatShopifyPrice, type ShopifyProduct } from "@/lib/shopify/client";
import { useT, useI18n } from "@/lib/i18n";

/**
 * Producto presentado con TiltedCard.
 *
 * TiltedCard por sí solo es una imagen que se inclina: no sabe de precios, ni
 * de stock, ni de carrito. Acá se le monta encima lo que una tienda necesita:
 * el precio flotando sobre la imagen (en la capa que sobresale en 3D, así
 * acompaña la inclinación) y, debajo, el nombre y el botón de compra.
 *
 * El botón de compra queda FUERA del enlace al producto: son dos acciones
 * distintas (añadir al carrito sin salir de la página, o abrir la ficha), y
 * anidarlas haría que una se comiera a la otra.
 */
export function ProductTiltCard({ p }: { p: ShopifyProduct }) {
  const t = useT();
  const { lang } = useI18n();
  // Antes siempre enlazaba a "/shop/$slug" (húngaro) sin importar el idioma
  // activo. En inglés sin cookie de idioma persistida (sólo forceLang de la
  // ruta /en) esto hacía que la ficha de producto "perdiera" el inglés al
  // entrar, porque /shop/$slug no está bajo el layout que fuerza inglés.
  const productRoute = lang === "hu" ? "/shop/$slug" : "/en/shop/$slug";
  const addItem = useShopifyCart((s) => s.addItem);
  const isLoading = useShopifyCart((s) => s.isLoading);

  const product = p.node;
  const image = product.images.edges[0]?.node;
  const firstVariant = product.variants.edges[0]?.node;
  const available = firstVariant?.availableForSale ?? false;
  const price = formatShopifyPrice(product.priceRange.minVariantPrice);

  function handleQuickAdd() {
    if (!firstVariant) return;
    addItem({
      product: p,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions,
    });
  }

  return (
    <article className="flex flex-col items-center gap-4">
      <Link
        to={productRoute}
        params={{ slug: product.handle }}
        aria-label={product.title}
        className="block w-full"
      >
        {image ? (
          <TiltedCard
            imageSrc={image.url}
            altText={image.altText ?? product.title}
            captionText={`${product.title} · ${price}`}
            containerHeight="330px"
            containerWidth="100%"
            imageHeight="330px"
            imageWidth="100%"
            rotateAmplitude={11}
            scaleOnHover={1.06}
            showTooltip
            displayOverlayContent
            overlayContent={
              <span className="ml-4 mt-4 inline-block rounded-full bg-white/95 px-4 py-1.5 font-sans text-sm font-bold text-fire shadow-[0_4px_14px_rgba(13,13,13,0.18)]">
                {price}
              </span>
            }
          />
        ) : (
          // Sin foto en Shopify: en vez de un hueco vacío, la marca.
          <div className="grid h-[330px] w-full place-items-center rounded-[18px] bg-white/10">
            <span
              className="select-none text-8xl text-white/70"
              style={{ fontFamily: "'Anton', var(--font-display)" }}
            >
              ?
            </span>
          </div>
        )}
      </Link>

      <div className="flex w-full flex-col items-center gap-3 text-center">
        <h3
          className="text-white leading-tight text-[clamp(1.1rem,2.2vw,1.5rem)]"
          style={{ fontFamily: "'Anton', var(--font-display)" }}
        >
          {product.title}
        </h3>

        <div className="flex w-full items-center justify-center gap-2">
          <Link
            to={productRoute}
            params={{ slug: product.handle }}
            className="btn-3d flex-1 bg-white px-5 py-3 text-center font-sans text-sm font-bold uppercase tracking-wide text-fire"
          >
            {t.products.open}
          </Link>
          <button
            onClick={handleQuickAdd}
            disabled={!available || isLoading}
            aria-label={product.title}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-white/50 text-white transition-all hover:border-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ShoppingBag className="h-5 w-5" />
          </button>
        </div>
      </div>
    </article>
  );
}
