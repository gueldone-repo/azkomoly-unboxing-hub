# AZKOMOLY — Claude context

Mystery-box streetwear webshop. Live storefront connected to Shopify.
Built for Diego (GUELDONE Agency). Path: `C:\Users\Mariana\Desktop\GUELDOEN\AZKOMOLY`.

---

## Stack

- **Framework:** TanStack Start + React 19 + Vite 7
- **CSS:** Tailwind v4 — CSS-first (`@theme inline` in `src/styles.css`). NO `tailwind.config`. Use CSS variables directly.
- **Components:** shadcn/ui (full set in `src/components/ui/`)
- **Package manager:** `npm` (bun not installed on this Windows machine). Always use `npm install --legacy-peer-deps --no-package-lock` to avoid a nitro/lovable peer-dep conflict.
- **Dev server:** `npm run dev` → localhost:8080

---

## Design system

> **Actualizado en sesión de rediseño visual (2026-08-05).** Paleta y tipografía cambiaron por
> completo respecto a la versión original (naranja/graffiti oscuro) — ahora es morado oscuro
> sobre blanco, con acentos negros tipo "3D/derretido". Si ves referencias a naranja/negro en
> comentarios viejos del código, están desactualizadas.

| Token | Value | Usage |
|---|---|---|
| `--fire` | `#5B2EA8` (morado oscuro) | Primary accent, CTAs, navbar, secciones destacadas |
| `--cardboard` | `#8F78B5` (lavanda secundario) | Borders, secondary |
| `--dark-bg` | near-white | Card backgrounds |
| `--background` | white | Page background |
| Negro `#0D0D0D` | — | Relieve 3D (texto, botones, dividers), nunca como color de fondo de sección |

> **Actualizado 2026-08-10 (rediseño v2, ya en `main`).** El navbar es BLANCO (era una
> franja morada maciza), el titular del hero es un texto curvo en movimiento, y la onda
> `WaveBackdrop` es la única pieza de fondo del hero y la conexión con la sección morada.
> Respaldo de la versión anterior en la rama `produccion-anterior`.

**Fonts:**
- **Bungee** — H1 del hero. Anton se veía plana a tamaño grande; Bungee es de rótulo urbano,
  tiene el trazo grueso y pega con el logo de graffiti, así que el peso lo da la letra y NO
  se le añade sombra (Diego la rechazó explícitamente varias veces).
- `font-display` = **Anton** (títulos de sección, "Our boxes", items del menú)
- `font-sans` = Poppins (nav, cuerpo, botones)
- Fallback con métricas ajustadas: `@font-face "AZK Anton Fallback"` con `size-adjust: 63%`
  en `styles.css`. NO borrarlo: sin él, el fallback mide 62% más ancho y el H1 aparece
  gigante hasta que carga la fuente (bug real que se veía en `/en`).

**Reglas de marca que Diego ha rechazado más de una vez (no reintroducir):**
- Sombra en la imagen del hero (ni `drop-shadow` ni elipse difusa detrás).
- Paneles difuminados o degradados de fondo en el hero: se leen como un rectángulo sucio.
  El único fondo es la onda.
- Numeración en los items del menú hamburguesa.

**H1 oculto (NO BORRAR):** el titular visible es un `<textPath>` de SVG, que Google indexa
mal. Por eso `HeroV2.tsx` mantiene un `<h1>` con el mismo texto recortado a 1px (no
`display:none`, que lo borraría también para los buscadores). Si se "limpia" por parecer
código muerto, se pierde la señal SEO más fuerte de la home.
- **H1 del Hero específicamente**: Danfo (vía `style={{ fontFamily: "'Danfo', var(--font-display)" }}`, no es la variable global) — usar esta misma fuente para títulos de páginas nuevas (About/FAQ) que quieran igualar el estilo del Hero
- Subtítulos/CTA del Hero y de "Don't read · open": ADLaM Display (mismo patrón inline, no es variable global)
- Ambas cargadas vía Google Fonts `<link>` en `head()` de cada ruta (ver `src/routes/index.tsx` y `en.index.tsx`)

**Efecto "derretido" (marca registrada de este rediseño):**
- Componente `src/components/DripDivider.tsx` — capas SVG (sombra negra offset + color principal) simulando un borde orgánico/goteando. Variantes: `drip` (gotas pesadas), `wave` (ondas parejas), `organic` (silueta irregular, la más usada).
- Regla de color: `mainColor` = color de la sección que "gotea" (arriba en `flip=false`, abajo en `flip=true`); dejar `bgColor` sin pasar para que los valles muestren de verdad lo que hay detrás (nunca forzar un color ahí o se pierde el efecto de recorte real).
- **Pendiente conocido**: en algunas de estas secciones wavy queda una línea recta visible (remanente de un fondo lineal viejo) — hay que revisarla y sacarla, se ve mal. Ver sección Pendiente más abajo.
- `.text-3d-fire` (en `styles.css`) — mismo relieve pero para texto (títulos). Usado en H1 del Hero y en "Our boxes"; se sacó deliberadamente de "How does it work" y "FAQ" (el cliente no lo quiso ahí).
- `.btn-drip` (en `styles.css`) — relieve 3D discreto + hover a texto negro, para botones morados (`bg-fire`).

**Signature utilities** (defined in `src/styles.css`):
- `.graffiti-border` — fire-colored offset box-shadow (utilidad vieja, en desuso en las secciones rediseñadas, pero sigue existiendo para lo que no se tocó)
- `.text-fire-glow` — fire text-shadow glow
- `.text-stroke-black` — black text stroke
- `.torn-card` / `.torn-divider` — clip-path torn paper edges
- `.scrollbar-none` — hides scrollbar (used in mobile carousel)
- Animations: `pulse-glow`, `float-piece`, `fade-up`, `marquee`

---

## Architecture

### Routes
- `/` → `src/routes/index.tsx` — Full landing page
- `/shop/$slug` → `src/routes/shop.$slug.tsx` — Product detail (loads from Shopify by handle)
- `/privacy`, `/terms`, `/cookies` — Legal pages (company: Oscar Investments Kft.)

### Key components
| File | What it does |
|---|---|
| `src/components/ScrubBackdrop.tsx` | Sticky image backdrop — `HERO_1_FRAME.jpeg` se queda fija (sticky) mientras el usuario scrollea por hero + productos. Ya NO usa 101 frames ni canvas. |
| `src/components/HeroOverlay.tsx` | Texto + CTA encima del ScrubBackdrop. Parallax suave con `scrollY / innerHeight`. |
| `src/components/BoxSpinner.tsx` | Popup con 3 cajas flotantes. Carga códigos de descuento dinámicos desde Shopify Admin API (`fetchShopifyDiscountCodes`). Cada caja recibe un código distinto. Al revelar, aplica el código al checkout URL automáticamente. |
| `src/components/cart/CartSheet.tsx` | `CartButton` (badge) + drawer lateral. Usa `useShopifyCart` (Zustand). Checkout real de Shopify con descuento incluido en URL. |
| `src/components/LanguageToggle.tsx` | HU/EN segmented button. |
| `src/components/shop/ProductCard.tsx` | Tarjeta de producto con datos reales de Shopify (`ShopifyProduct`). Quick-add al carrito de Shopify. Mobile: carrusel snap. |

### Data / State
- **Productos:** `src/lib/shopify/client.ts` — Storefront API. `fetchProducts()` y `fetchProductByHandle()`. NO hay mock-products activos.
- **Carrito:** `src/lib/shopify/cart-store.ts` — Zustand + localStorage `azkomoly-shopify-cart-v1`. Incluye `discountCode` que se adjunta al `checkoutUrl`. NO usar el viejo `src/lib/cart.tsx`.
- **Descuentos:** `src/lib/shopify/discounts.functions.ts` — Server fn que lee `price_rules` del Admin API. Requiere `SHOPIFY_ADMIN_TOKEN` en `.env`.
- **i18n:** `src/lib/i18n/dictionary.ts` — Full typed `Dict` con `hu` y `en`. Siempre agregar keys a **ambos** idiomas. Hook `useT()`. Cookie `azkomoly_lang`, default `hu`.
- **Leads:** Supabase `azkomoly_leads` + Google Sheet mirror via `appendLeadToSheet` server fn.

---

## Skills

15 official Shopify skills installed in `.claude/skills/` (gitignored, not real store access — just verified GraphQL/docs knowledge). Use:
- `shopify-storefront-graphql` — any Storefront API query/mutation work (products, cart, checkout).
- `shopify-admin` — any Admin API work (price_rules/discounts, future admin features).
- Others (`shopify-liquid`, `shopify-hydrogen`, `shopify-pos-ui`, Polaris extensions, etc.) — not applicable to this headless project, ignore unless scope changes.

---

## Shopify

| Dato | Valor |
|---|---|
| Store domain | `ipqptg-19.myshopify.com` |
| Storefront token | `88a7bc92a4e3b38691a12713f4a7ac34` (público, read-only) |
| API version | `2025-07` |
| Admin token | `SHOPIFY_ADMIN_TOKEN` en `.env` — **pendiente** (necesita `read_price_rules` scope) |
| Envíos | PeakShip / Kvikk — pendiente de instalar |
| Impuestos | ÁFA 27% — pendiente de configurar en Shopify Settings |

### Empresa (datos legales en /privacy, /terms, /cookies)
- **Oscar Investments Kft.**
- Székhely: 4029 Debrecen, Csapó utca 26. Fsz. 1. ajtó
- Adószám: 32331486-2-09 · Cégjegyzékszám: 09 09 036321
- Email: azkomoly.hu@gmail.com

### Arquitectura de dominios (IMPORTANTE — dos sitios distintos)
El front (este repo, hecho con Lovable + Storefront API) y el checkout de Shopify **viven en dos dominios separados** porque no se pudieron conectar ambos al mismo dominio raíz sin romper el DNS:
- **`azkomoly.hu`** → este repo (TanStack Start). Landing, catálogo, carrito custom.
- **`checkout.azkomoly.hu`** → checkout nativo de Shopify (dominio propio apuntado por CNAME al checkout de Shopify, no a este código). El botón de checkout de `CartSheet.tsx` redirige ahí con el `checkoutUrl` de Shopify + `discountCode`.
- Este repo **no controla ni puede inyectar código** en `checkout.azkomoly.hu` — es una página servida por Shopify. Cualquier tracking/analytics ahí (Clarity, GA, Meta Pixel, etc.) se configura desde **Shopify Admin**, no desde este código.
- Shopify bloquea scripts custom inyectados en checkout salvo plan Plus. La única vía soportada en cualquier plan es instalar la **app oficial del proveedor** desde el Shopify App Store (usa el Web Pixel nativo de Shopify, que sí tiene permiso de correr en checkout + thank-you page).

---

## Hero

- `ScrubBackdrop` envuelve hero + PromoBanner + ProductsSection en `index.tsx`
- La imagen `public/HERO_1_FRAME.jpeg` se mantiene sticky mientras scrolleas
- Los 101 frames de `public/hero-frames/` ya NO se usan — no borrar pero no cargar
- `HeroOverlay` solo tiene texto/CTA, el fondo lo provee `ScrubBackdrop`

## Products (mobile)

- Mobile (`< sm`): carrusel horizontal snap, cards de `78vw`
- Tablet/Desktop: grid `sm:grid-cols-2 lg:grid-cols-4`

---

## Images en `public/`
| File | Usado donde |
|---|---|
| `HERO_1_FRAME.jpeg` | ScrubBackdrop — hero sticky background |
| `1_box_cerrada.png` | BoxSpinner cajas cerradas |
| `2_box_abierta.png` | BoxSpinner caja abierta (reveal) |
| `azkomoly (1).png` | Navbar logo (`filter: brightness(0) invert(1)`) |
| `Outfit_reveal_vertical_box_…`, `Unboxing_…`, `Hands_…` | LifestyleStrip marquee |

> Filenames con `…` (U+2026) son literales.

### Favicon
Set completo generado desde el arte de marca (caja + `?`), declarado en el array
`links` de `head()` en `__root.tsx` + `theme-color` en `meta`:
`favicon.ico` (multi-size 16/32/48), `favicon.png`, `favicon-{16,32,48,96,192,512}x…png`,
`apple-touch-icon.png` (180×180, fondo opaco `#111`), `site.webmanifest`.

- La fuente del arte es el **propio `favicon.ico` viejo a 256×256** — no existe
  en más resolución, así que el 512 es un upscale 2x (queda algo blando). Si
  aparece el arte original en alta, regenerar.
- Decisión de Diego: **arte completo en todos los tamaños**, aunque a 16px se lea
  borroso. No recortar al `?` sin pedírselo.
- Reglas globales + script de generación: skill `favicon-check`.

---

## SEO / GEO

- **Módulo central:** `src/lib/seo.ts` — `SITE_URL`, `canonicalUrl()`, `seoLinks()` (canonical +
  hreflang hu/en/x-default), `seoLinksHuOnly()`, y builders JSON-LD (`organizationSchema`,
  `faqSchema`, `productSchema`, `breadcrumbSchema`) + helper `jsonLd()` para el array `scripts` de head().
- **i18n por URL para crawlers:** el idioma de usuario sigue viviendo en la cookie `azkomoly_lang`, PERO
  el inglés ahora tiene URLs propias indexables: `/en` y `/en/shop/$slug`. El layout `src/routes/en.tsx`
  usa `<I18nProvider forceLang="en">`. `/` = húngaro = x-default. **Al agregar una ruta nueva que deba
  indexarse en ambos idiomas, crear también su gemela `/en/...` y darle `seoLinks(path, lang)`.**
- **Legales solo en húngaro:** `/privacy /terms /cookies` tienen el texto hardcodeado en hu (no sale del
  diccionario) → usan `seoLinksHuOnly()` (canonical sin hreflang). NO crear `/en/privacy` sin traducir
  primero el contenido — un hreflang=en hacia texto hu es señal falsa que Google penaliza.
- **Metadata:** el head del root y cada ruta usan `DICTIONARIES[lang].meta`. NO volver a meter
  `author: Lovable`, `twitter:site: @Lovable` ni og:image de `storage.googleapis.com/gpt-engineer-*`.
  El og:image propio es `/og-image.jpg` (1200×630).
- **robots.txt / sitemap.xml:** archivos estáticos en `public/`. Esta versión de TanStack Start NO expone
  server routes, por eso el sitemap es estático. Regenerarlo con `node scripts/generate-sitemap.mjs`
  (lee productos reales de Shopify) cada vez que se agregue/quite/renombre un producto.
- **routeTree gotcha al buildear:** `npm run build` regenera `routeTree.gen.ts` y REINYECTA el bloque
  `declare module '@tanstack/react-start' { interface Register … }` que rompe `tsc` (además del bloque
  `Register` de react-router ya documentado abajo). Antes de commitear/publicar: quitar ese bloque pero
  **conservar** las rutas `/en` que el build sí agrega correctamente. `tsc --noEmit` debe salir 0.
- **Pendiente Shopify (no es código):** 3 de 4 handles de producto son de prueba (`not-real-box…`,
  `try`) → renombrar en Shopify Admin antes de que Google los fije.

---

## Analytics

- **Microsoft Clarity** (storefront, `azkomoly.hu`): Project ID `xkb7njvdoh`. Carga vía `src/lib/analytics/clarity.ts` → `initClarity()`. **Gateado por consentimiento** — solo se dispara si `CookieBanner` tiene `analytics: true` guardado (`localStorage` key `azkomoly_cookie_consent_v1`, ver `getStoredConsent()` en `src/components/CookieBanner.tsx`). Se llama en dos lugares: `RootComponent` en `__root.tsx` (mount, si ya había consentimiento previo) y dentro de `CookieBanner.save()` (al aceptar en el momento). **NO** volver a poner el snippet de Clarity directo en `head()`/`scripts` de la ruta raíz — eso lo cargaría sin importar el consentimiento (rompe GDPR).
- **Checkout de Shopify** (`checkout.azkomoly.hu`): NO se puede trackear desde este repo (ver arquitectura de dominios arriba). Para trackear ahí, instalar la app oficial **"Microsoft Clarity: AI Insights"** desde el Shopify App Store y conectarla al mismo proyecto de Clarity — usa el Web Pixel nativo de Shopify, funciona en cualquier plan.
- `CookieBanner` (`src/components/CookieBanner.tsx`) solo se renderiza en `/` (`index.tsx`) hoy, no en `/shop/$slug` ni en las páginas legales — pendiente de decisión si debe ir global.

---

## Backend

- **Supabase:** Solo tabla `azkomoly_leads`. Schema congelado salvo pedido explícito.
- **Shopify:** Storefront API activo. Admin API pendiente de token.
- **No Stripe** — checkout será Shopify nativo.

---

## Known gotchas

### TS false positive en `shop.$slug.tsx`
El dev server regenera `routeTree.gen.ts` con un bloque `Register` que causa error cíclico. Es un artefacto del dev server, no real. Fix:
```
git checkout -- src/routeTree.gen.ts
```
`tsc --noEmit` sale 0 con el archivo commiteado.

### npm install
Siempre usar:
```
npm install --legacy-peer-deps --no-package-lock
```

### BoxSpinner
Muestra en cada page load (sin gate de sessionStorage — intencional para demo). En producción, agregar check de `localStorage` con timestamp para mostrar una vez al día.

### Carrito viejo
`src/lib/cart.tsx` y `src/lib/cart.ts` son el carrito mock original. Ya no se usan. NO importar en componentes nuevos — usar `useShopifyCart` de `src/lib/shopify/cart-store.ts`.

---

## Rules

1. **Visual/design only** — Diego guía todo el trabajo. No adelantarse ni construir features sin pedirlo.
2. **No backend changes** — Supabase schema y server functions congelados salvo pedido explícito.
3. **No Stripe** — checkout es Shopify únicamente.
4. **No commitear `routeTree.gen.ts`** si tiene bloque `Register` del dev server.
5. Al agregar copy, siempre agregar a **ambos** `hu` y `en` en `dictionary.ts` y el tipo `Dict`.
6. El carrito usa Shopify Storefront API + Zustand — nunca el mock de `src/lib/cart.tsx`.
