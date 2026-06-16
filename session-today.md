# Session Log — AZKOMOLY

Usa este archivo para anotar qué se hizo en cada sesión.
Claude lo lee al inicio de cada conversación para tener contexto inmediato.

---

## 2026-06-16 (Sesión 1)

### Lo que se hizo
- **Shopify conectado:** Lovable conectó la tienda `ipqptg-19.myshopify.com` via Storefront API. Infraestructura lista: `client.ts`, `cart-store.ts` (Zustand), `useCartSync.ts`.
- **Productos reales:** `ProductCard` y `ProductsSection` ahora leen de Shopify con `fetchProducts()`. El carrito mock fue reemplazado por `useShopifyCart`.
- **Checkout real:** El botón de checkout redirige al checkout URL de Shopify. El código de descuento revelado en el BoxSpinner se adjunta automáticamente (`?discount=CODE`).
- **Hero simplificado:** Se eliminaron los 101 frames de scroll-scrub. Ahora `ScrubBackdrop` muestra `HERO_1_FRAME.jpeg` sticky con parallax entre hero y productos.
- **Mobile carousel:** Los productos en mobile son un carrusel horizontal snap (78vw por card). Desktop/tablet mantiene el grid.
- **BoxSpinner dinámico:** Carga códigos de descuento desde Shopify Admin API (`discounts.functions.ts`). Cada caja recibe un código distinto. Falta el `SHOPIFY_ADMIN_TOKEN` para activarlo — por ahora usa `FREE-SHIP` como fallback.
- **Páginas legales:** Actualizadas con datos reales de Oscar Investments Kft., Debrecen. Email: azkomoly.hu@gmail.com.
- **CLAUDE.md:** Actualizado con toda la info de Shopify, empresa, arquitectura actual.

### Pendiente (para próximas sesiones)
- [ ] Obtener `SHOPIFY_ADMIN_TOKEN` con scope `read_price_rules` → agregar a `.env` y a Lovable
- [ ] Instalar PeakShip / Kvikk en Shopify para envíos
- [ ] Configurar método de pago en Shopify (Stripe, SimplePay, o Barion)
- [ ] Configurar ÁFA 27% en Shopify Settings → Taxes
- [ ] Crear los 4 productos reales en Shopify (MINI / KLASSZIKUS / PRÉMIUM / LEGENDÁS) con variantes de talla S/M/L/XL
- [ ] Mejorar el diseño del hero y experiencia general (próxima sesión de diseño)
- [ ] Conectar dominio `azkomoly.hu` cuando esté listo para lanzar

### Prompt para Lovable (descuentos dinámicos)
Ver sección al final de este archivo.

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
