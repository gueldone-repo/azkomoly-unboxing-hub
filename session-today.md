# Session Log — AZKOMOLY

Usa este archivo para anotar qué se hizo en cada sesión.
Claude lo lee al inicio de cada conversación para tener contexto inmediato.

---

## 2026-06-16 (Sesión 1) ✅ CERRADA

### Lo que se hizo
- **Shopify conectado:** Lovable conectó la tienda `ipqptg-19.myshopify.com` via Storefront API. Infraestructura lista: `client.ts`, `cart-store.ts` (Zustand), `useCartSync.ts`.
- **Productos reales:** `ProductCard` y `ProductsSection` ahora leen de Shopify con `fetchProducts()`. El carrito mock fue reemplazado por `useShopifyCart`.
- **Checkout real:** El botón de checkout redirige al checkout URL de Shopify. El código de descuento revelado en el BoxSpinner se adjunta automáticamente (`?discount=CODE`).
- **Hero simplificado:** Se eliminaron los 101 frames de scroll-scrub. Ahora `ScrubBackdrop` muestra `HERO_1_FRAME.jpeg` sticky con parallax entre hero y productos.
- **Mobile carousel:** Los productos en mobile son un carrusel horizontal snap (78vw por card). Desktop/tablet mantiene el grid.
- **BoxSpinner dinámico:** Carga códigos de descuento desde Shopify Admin API (`discounts.functions.ts`). Cada caja recibe un código distinto. Falta el `SHOPIFY_ADMIN_TOKEN` para activarlo — por ahora usa `FREE-SHIP` como fallback.
- **Páginas legales:** Actualizadas con datos reales de Oscar Investments Kft., Debrecen. Email: azkomoly.hu@gmail.com.
- **CLAUDE.md:** Actualizado con toda la info de Shopify, empresa, arquitectura actual.

---

## 2026-06-23 (Sesión 2) ✅ CERRADA

### Lo que se hizo

**BoxSpinner:**
- Ahora aparece **solo una vez por sesión** (`sessionStorage` key `azkomoly-box-seen`).
- El código de descuento solo se revela si el usuario ingresa su **nombre y email** (nuevo paso `gate`). El lead se guarda en Supabase `azkomoly_leads` con `source: "box_spinner"` y también se envía al Google Sheet via `appendLeadToSheet` (Lovable lo conectó).

**Hero CTA:**
- Botón ya no abre el SignupDialog — ahora hace scroll suave a `#termekek` (sección de productos).
- Texto HU: `KINYITOM A DOBOZOM →` / EN: `I WANT TO OPEN MY BOX →`
- El `?` gigante está como watermark decorativo de fondo (outline sutil, lado derecho), no como elemento principal.

**Performance:**
- Carpeta `public/hero-frames/` eliminada (101 imágenes que no se usaban, ~3MB).
- Hero image con `fetchPriority="high"` + `decoding="sync"` para LCP.
- Lifestyle strip con `loading="lazy"` en imágenes.

**Copy / contenido:**
- Texto "The bigger the box..." eliminado de ProductsSection.
- ValueProps: sección de 3 fichas eliminada del render (código sigue existiendo pero no se muestra).
- Countdown (PromoBanner) eliminado.
- HowItWorks: paso 03 simplificado a "VÁRJ / WAIT — Sit back. Your box is on its way." (sin mencionar empaque). 4 pasos se mantienen.
- FastShipping text: sin fechas ni empresas de mensajería.
- FAQ: reescrito completamente — talla (reventa en Vinted), daños (contactar soporte), tiempo de envío (2-3 días, max 1 semana), origen productos (texto completo de liquidación), no me gusta (soporte), empresa de delivery. Eliminada pregunta de drops dominicales.

**Animaciones y diseño:**
- Scroll reveal system: CSS `[data-reveal]` + `[data-reveal].in-view` con IntersectionObserver en `Landing`. Delays escalonados por sección.
- HowItWorks cards: número watermark de fondo (`7rem`, opacity 6%), hover eleva la card.
- FAQ: acordeón con `maxHeight` animado (suave), se tiñe de fire cuando está abierto.

**Páginas legales:**
- Fecha actualizada 2025 → 2026 en las 3 páginas.
- `terms.tsx`: reescrito completamente para webshop real — compra, envío, mystery box + elállási jog (EU directive 2011/83/EU art. 16c), garantía, reclamaciones (Debreceni Békéltető Testület + ODR platform EU).
- `privacy.tsx`: agregado Shopify como procesador, datos de compra/envío, mención PCI-DSS.

**Programador:**
- Se le dio acceso al repo. Instaló en servidor remoto en `azkomoly.borat.hu`.
- Agregó `allowedHosts: ["azkomoly.borat.hu"]` en `vite.config.ts` para tunnel dev.
- Usa npm (no pnpm) con `--legacy-peer-deps --no-package-lock`.
- **SHOPIFY_ADMIN_TOKEN no existe todavía** — no es necesario para desarrollo, BoxSpinner usa `FREE-SHIP` como fallback.

### Pendiente (para próximas sesiones)
- [ ] Obtener `SHOPIFY_ADMIN_TOKEN` con scope `read_price_rules` → agregar a `.env` y a Lovable
- [ ] Instalar PeakShip / Kvikk en Shopify para envíos
- [ ] Configurar método de pago en Shopify (SimplePay o Barion — Shopify Payments no disponible en HU)
- [ ] Configurar ÁFA 27% en Shopify Settings → Taxes
- [ ] Crear los 4 productos reales en Shopify (MINI / KLASSZIKUS / PRÉMIUM / LEGENDÁS) con variantes de talla S/M/L/XL
- [ ] Dominio `azkomoly.hu`: checkout.azkomoly.hu ya apunta a Shopify (CNAME). Cuando se lance, configurar "Return to store URL" en Shopify → `https://azkomoly.hu` para que el logo del checkout lleve al sitio real.
- [ ] Revisar términos legales con abogado húngaro antes del lanzamiento (especialmente elállási jog para mystery boxes)
- [ ] Antes del lanzamiento: agregar `.env` al `.gitignore` y mover variables a env vars del hosting

---

<!-- PLANTILLA PARA NUEVAS SESIONES:

## YYYY-MM-DD (Sesión N)

### Lo que se hizo
-

### Pendiente
- [ ]

-->

---

## Prompt para Lovable — Shopify Admin API (descuentos dinámicos)

Copia y pega esto en Lovable:

---

Necesito que configures el Shopify Admin API token para que los códigos de descuento sean dinámicos en el BoxSpinner.

Ya existe el código en `src/lib/shopify/discounts.functions.ts` — un server function de TanStack Start que lee `price_rules` del Admin API. Solo falta el token.

**Lo que necesitas hacer:**

1. En Shopify Admin → Settings → Apps → Develop apps → [la app existente "AZKOMOLY Web"]
2. Ir a "Configuration" → "Admin API integration"
3. Activar el scope: `read_price_rules`
4. Instalar / reinstalar la app
5. Copiar el Admin API access token (`shpat_...`)
6. Agregarlo como variable de entorno: `SHOPIFY_ADMIN_TOKEN=shpat_...`

El archivo `src/lib/shopify/discounts.functions.ts` ya está listo y usa `process.env.SHOPIFY_ADMIN_TOKEN`. Si el token no está, el BoxSpinner usa `FREE-SHIP` como fallback automáticamente.

No hay que cambiar ningún código — solo agregar la env var.
