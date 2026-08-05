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

## 2026-07-10 (Sesión 3) ✅ CERRADA

### Lo que se hizo

**Microsoft Clarity conectado (customer experience tracking):**
- Instalado el snippet de Clarity (Project ID `xkb7njvdoh`) en el storefront (`azkomoly.hu`), vía `src/lib/analytics/clarity.ts` → `initClarity()`.
- **Gateado por consentimiento GDPR:** ya existía un `CookieBanner.tsx` con toggle de analíticas que no estaba conectado a nada. Ahora Clarity solo carga si el usuario aceptó cookies de analítica (`localStorage` key `azkomoly_cookie_consent_v1`). Se dispara en `RootComponent` (`__root.tsx`, si ya había consentimiento previo) y en `CookieBanner.save()` (al aceptar en el momento).
- **IMPORTANTE — arquitectura de dos dominios documentada en CLAUDE.md:** el front (`azkomoly.hu`, este repo) y el checkout (`checkout.azkomoly.hu`, hosteado por Shopify) son dominios separados — no se pudieron conectar bajo el mismo dominio raíz por un tema de DNS (pendiente de revisar si se puede arreglar). Este repo NO puede inyectar scripts en `checkout.azkomoly.hu`.
- Para trackear el checkout: se instaló la app oficial **"Microsoft Clarity: AI Insights"** desde el Shopify App Store (usa el Web Pixel nativo de Shopify, funciona en cualquier plan, no requiere Plus).
  - Pendiente de confirmar: aprobar el project link request en clarity.microsoft.com (proyecto `xkb7njvdoh`), activar toggle **"Clarity JS"** en la config de la app, y activar el app embed **"Clarity Agents JS"** en Theme Customizer → App embeds → Save.
- Commits: `a8fdff2` (snippet inicial) y `34792d3` (gate por consentimiento + doc de arquitectura). Ambos pusheados a `main`.

### Pendiente (para próximas sesiones)
- [ ] Confirmar que el project link de Clarity quedó aprobado y que "Clarity JS" + "Clarity Agents JS" están activos en Shopify → validar que las sesiones de checkout empiecen a aparecer en el dashboard de Clarity.
- [ ] Decidir si `CookieBanner` debe renderizarse en todas las rutas (hoy solo está en `/`, no en `/shop/$slug` ni en las páginas legales).
- [ ] Revisar si el problema de DNS que impidió conectar `azkomoly.hu` y `checkout.azkomoly.hu` bajo un solo dominio se puede resolver (Diego mencionó que lo evitó a propósito para no romper nada).
- [ ] Próxima sesión: mejoras al tracking (eventos custom, funnel de compra) y mejor experiencia de compra en general.
- (siguen pendientes de sesión 2, ver arriba: `SHOPIFY_ADMIN_TOKEN`, envíos, pagos, ÁFA, productos reales, revisión legal)

---

## 2026-07-17 (Sesión 4 — parte B: SEO / GEO + /en + diagnóstico .com)

### Diagnóstico azkomoly.com — NO es conflicto de dominios
- DNS OK: `azkomoly.hu` y `azkomoly.com` resuelven a la misma IP de Lovable (`185.158.133.1`).
- El problema real: **falta el certificado TLS del apex `azkomoly.com`**. En Lovable se dio de alta
  `www.azkomoly.com` (funciona, 302 → azkomoly.hu) pero NO el apex sin www. Sin cert, el navegador
  corta en el handshake → "no abre". `http://azkomoly.com` (sin TLS) sí responde.
- **Acción de Diego (fuera de código):** agregar `azkomoly.com` (apex) como dominio en el dashboard de
  Lovable para que emita el cert. Decisión tomada: el `.com` es redirect defensivo → `.hu` (toda la
  autoridad SEO se concentra en `.hu`; el inglés vive en `azkomoly.hu/en`, no en el `.com`).

### Corrección a mi propio diagnóstico anterior
- **La home NUNCA dijo "coming soon".** El title real siempre fue `AZKOMOLY — Mi van a dobozban?` con
  buena description húngara. Lo que leí como "coming soon" era el HTML de `/robots.txt` (un 404, que
  hereda el head del root). Todas las rutas (`index`, `privacy`, `terms`, `cookies`, `shop`) ya tenían
  `head()` propio con buen copy hu. La base era mucho mejor de lo que reporté.

### Lo que se hizo (todo invisible — solo <head>, archivos nuevos y rutas nuevas)
**Metadata / limpieza Lovable:**
- `src/routes/__root.tsx`: el head del root ahora usa `DICTIONARIES[lang].meta` (antes: fallback
  "coming soon" + `author: Lovable` + `twitter:site: @Lovable` + og:image colgando de un dominio de
  Lovable). Sacada toda referencia a Lovable. OG completo + `og:image` propio (`/og-image.jpg`,
  1200×630 generado desde `HERO_1_FRAME.jpeg`). `twitter:card` = summary_large_image.

**Módulo SEO central — `src/lib/seo.ts` (nuevo):**
- `SITE_URL`, `canonicalUrl()`, `seoLinks()` (canonical + hreflang hu/en/x-default),
  `seoLinksHuOnly()` (legales), y builders JSON-LD: `organizationSchema` (OnlineStore + WebSite con
  datos de Oscar Investments Kft.), `faqSchema` (FAQPage), `productSchema` (Product+Offer),
  `breadcrumbSchema`. Helper `jsonLd()` para el array `scripts` de head().

**Schema aplicado:**
- Root: `OnlineStore` + `WebSite` (entidad de marca, en todas las páginas).
- Home + `/en`: `FAQPage` con los 7 Q/A que YA existían en el diccionario (pieza clave para que la IA cite).
- `/shop/$slug` + `/en/shop/$slug`: `Product` + `Offer` + `BreadcrumbList`.

**Bug real arreglado:** todas las páginas de producto compartían el `<title>` "AZKOMOLY" (para Google
eran indistinguibles). Ahora cada una lleva `"<nombre del producto> — AZKOMOLY"` + description propia
+ og:image del producto.

**Rutas /en (aditivo, cookie intacta):**
- Hasta ahora el idioma vivía SOLO en la cookie `azkomoly_lang` → para Google el inglés no existía (una
  sola URL). Ahora `/en`, `/en/shop/$slug` son URLs indexables.
- `I18nProvider` acepta `forceLang` (ignora la cookie). Layout `src/routes/en.tsx` envuelve con
  `forceLang="en"`. `/` sigue funcionando por cookie exactamente igual — ningún usuario actual nota nada.
- `ProductPage` refactorizado a recibir datos por props (antes usaba `Route.useLoaderData()` acoplado a
  la ruta hu) para poder reutilizarlo en `/en/shop/$slug`.
- Componentes de página exportados (`Landing`, `ProductPage`, etc.) para reuso.
- Legales (`/privacy /terms /cookies`): **solo húngaro** (su texto está hardcodeado en hu, no sale del
  diccionario) → canonical sin alternate en (declarar hreflang=en apuntaría a contenido hu = señal falsa).

**robots.txt (nuevo):** antes 404. Allow a Googlebot/Bingbot + bots de IA (GPTBot, PerplexityBot,
ClaudeBot, OAI-SearchBot, Google-Extended, Applebot, CCBot, meta-externalagent…). Línea `Sitemap:`.

**sitemap.xml (nuevo):** antes 404. Generado por `scripts/generate-sitemap.mjs` leyendo los productos
reales de Shopify (Storefront API). Cada URL con hreflang; legales hu-only sin alternate. 8 URLs.
Regenerar el script cuando se agregue/renombre un producto.

**Verificación (server real + build):** `tsc` exit 0; `npm run build` ✓ 16.52s; SSR servido probado en
`/`, `/en`, `/privacy`, `/shop/…`, `/en/shop/…` → titles hu/en correctos, canonical + 3 hreflang,
JSON-LD (FAQPage 7 Q/A + OnlineStore + Product + Breadcrumb), 0 refs a Lovable; robots/sitemap/og-image
sirven 200; dist/client tiene todos los assets. **Nota crítica:** el build regenera `routeTree.gen.ts`
y REINYECTA el bloque `declare module '@tanstack/react-start'` que rompe tsc (gotcha de CLAUDE.md) —
hay que quitarlo antes de commitear, pero conservando las rutas /en. Estado actual: limpio + con /en.

### Hallazgos NO arreglados (necesitan a Diego / Shopify Admin)
- ⚠️ **Handles de producto rotos para SEO:** 3 de 4 productos tienen URLs de prueba en Shopify —
  `/shop/azkomoly-not-real-box-2-copy`, `/shop/azkomoly-not-real-box-2-copy-copy`, `/shop/try`. Google
  las indexará así. Cambiar el handle en Shopify Admin (cambia la URL = cambio visible, no lo toqué).
- ⚠️ **Cert apex `azkomoly.com`** — pendiente en Lovable (ver arriba).
- ⚠️ El **og-image 512** del favicon sigue siendo upscale 2x (de sesión 4A).
- ⚠️ `shopify-theme/` + `azkomoly-shopify-theme.zip` sin trackear — sin explicación aún.

### Pendiente
- [ ] Diego: agregar apex `azkomoly.com` en Lovable (cert TLS) → luego confirmar redirect 301 a `.hu`.
- [ ] Diego: renombrar handles de producto en Shopify (sacar `not-real-box`, `try`).
- [ ] Tras deploy: subir `sitemap.xml` a Google Search Console (ambos dominios) + validar rich results.
- [ ] Blogs con enlazado interno (pediste crear blog para posicionar) — no empezado, es la próxima pieza.
- [ ] Publicar: recordar quitar el bloque `react-start` del `routeTree.gen.ts` que reinyecta el build.

---

## 2026-07-17 (Sesión 4)

### Lo que se hizo

**Contexto:** Diego indexó `azkomoly.hu` y `azkomoly.com` en Google Search Console
y pidió auditar el favicon + convertir sus reglas de favicon en una skill.

**Auditoría del favicon — qué estaba mal:**
- ✅ NO era el default de Lovable — era arte de marca real (caja + `?`). Esa regla se cumplía.
- ❌ `favicon.ico` pesaba **104 KB** (límite: 100 KB) y era un único 256×256.
- ❌ **Cero** `<link rel="icon">` en el `<head>` — no había ninguno. Google caía al
  `/favicon.ico` de la raíz por default.
- ❌ No existía ningún PNG (16/32/48/96/192/512), ni `apple-touch-icon.png`,
  ni `site.webmanifest`, ni `theme-color`.

**Qué se arregló:**
- Set completo generado con Pillow desde el arte de 256×256: PNGs en los 6 tamaños,
  `favicon.png` (298 KB < 500), `apple-touch-icon.png` 180×180 sobre `#111` opaco,
  y `favicon.ico` regenerado **multi-size (16/32/48) → 10.1 KB** (era 104 KB).
- `site.webmanifest` nuevo (192+512, theme/bg `#111111`, standalone).
- `__root.tsx`: agregados los 7 `<link rel="icon">` + `apple-touch-icon` + `manifest`
  en el array `links`, y `theme-color` en `meta`.
- Verificado de verdad: `tsc --noEmit` = 0, todos los assets sirven con content-type
  correcto, y los tags salen en el HTML renderizado.

**Decisión de Diego:** arte completo en todos los tamaños. A 16px (el que usa Google en
resultados) se lee borroso; se le mostró la alternativa de recortar al `?` y prefirió
consistencia de marca. No cambiarlo sin pedírselo.

**Skill creada:** `~/.claude/skills/favicon-check/` (global, aplica a todo proyecto)
con el checklist completo + `scripts/generate.py` (probado con fuente cuadrada y no
cuadrada). Se guardó también como memoria.

### Hallazgos NO arreglados (fuera de scope — decidir con Diego)

- ⚠️ **Metadata de Lovable filtrada en `__root.tsx`** — relevante ahora que está en GSC:
  - `<meta name="author" content="Lovable">`
  - `<meta name="twitter:site" content="@Lovable">`
  - `og:image` y `twitter:image` apuntan a `storage.googleapis.com/gpt-engineer-file-uploads/…`
    (un dominio de Lovable, no de AZKOMOLY — si lo borran, se rompe el preview social)
  - El `<title>` es `"Azkomoly"` y la description `"Hamarosan itt van. Készülj fel."`
    (copy de "coming soon", ya no aplica — la tienda está viva)
- ⚠️ El **512×512 es un upscale 2x** desde 256. Si aparece el arte original en alta, regenerar.
- ⚠️ `shopify-theme/` + `azkomoly-shopify-theme.zip` sin trackear en el repo — sin explicación
  todavía, pendiente de saber qué son y si van al repo o al `.gitignore`.

### Pendiente
- [ ] Decidir qué hacer con la metadata de Lovable + title/description de "coming soon" (SEO)
- [ ] Aclarar qué es `shopify-theme/` y si se commitea o se ignora
- [ ] (siguen todos los pendientes de sesión 3 y 2, ver arriba)

---

**Gotcha nuevo (documentado en la skill):** Vite cachea el listado de `public/` al arrancar.
Si generás archivos nuevos con el dev server corriendo, devuelven `200` pero con
`content_type: text/html` (fallback SPA) y los `<link>` no aparecen. **Reiniciar el dev
server** antes de dar por bueno cualquier resultado — un `200` no prueba que el archivo exista.

---

## 2026-07-22 (Sesión 5) ✅ CERRADA

### Lo que se hizo

**Pull de Lovable (`594ceb1..df804c0`):**
- Botón de producto HU: `MEGNYITOM` → `MEGVESZEM` ("Lo abro" → "Lo compro"). Coherente: es webshop real.
- `routeTree.gen.ts`: quedó limpio — solo el bloque `Register` de **react-router** (el normal), SIN el de `react-start` que rompe `tsc`. Rutas `/en` intactas. Repo publicable.

**Cambio de código — tarjeta de producto 100% clickeable (commit `15d0b82`, pusheado):**
- Pedido del cliente: "clicking anywhere on the product, not just the button, opens it."
- `src/components/shop/ProductCard.tsx`: agregado **stretched link** (`<Link absolute inset-0 z-10>` con `aria-label={product.title}`) que cubre toda la card. Fila de botones subida a `z-20` para que quick-add (bolsita) y CTA `MEGVESZEM` sigan funcionando por separado. `tsc --noEmit` = 0.
- Pendiente menor: el botón `MEGVESZEM` quedó redundante (toda la card abre el producto). Diego no decidió aún si quitarlo — DEJAR hasta que lo pida.

**Decisión SEO — Shopify NO debe rankear (solo `azkomoly.hu` rankea):**
- Confirmado por Diego: el sitio oficial/navegable/que rankea es `azkomoly.hu` (este repo, Lovable). La tienda Shopify (`checkout.azkomoly.hu`) es **solo checkout + backup**, no tienda navegable. Se creó ese subdominio aparte para que en el checkout salga el dominio propio (no `…myshopify.com`) sin romper el DNS.
- **Solución elegida: Opción A — password-protejer la Online Store de Shopify** (`Online Store → Preferences → Password protection: ON`). Saca todo el storefront del índice de Google, pero el checkout sigue funcionando porque va por el permalink/`checkoutUrl` (no está detrás de la password). La tienda queda como backup funcional.
- **Rechazado de la receta de Lovable:** el `<link rel="canonical" href="azkomoly.hu{{request.path}}">` (paths de Shopify NO coinciden con `/shop/$slug` → señal falsa) y bloquear `robots.txt` (impediría que Google lea el `noindex`). Con la password alcanza.
- Pasos para Diego (Shopify Admin, no código): 1) activar password, 2) primary domain = `checkout.azkomoly.hu`, 3) "Return to store URL" = `https://azkomoly.hu`, 4) GSC: agregar propiedad `checkout.azkomoly.hu` + Removals/Temporary hide. Luego: compra de prueba para confirmar que el checkout abre con la password puesta (si no, ir a Opción B = noindex en `theme.liquid`).

**Apex `azkomoly.com`:** confirmado el diagnóstico de sesión 4B (falta cert TLS del apex en Lovable). Acción de Diego: dar de alta apex en Lovable, `.hu` Primary, `.com`/`www` → 301 a `.hu`.

### Pendiente (para próximas sesiones)
- [ ] Diego: activar password protection en Shopify + los 4 pasos de arriba → confirmar compra de prueba.
- [ ] Diego: decidir si se quita el botón `MEGVESZEM` de la card (ahora redundante).
- [ ] **Diego hará cambios en Lovable antes de la próxima sesión → HACER PULL al abrir.**
- [ ] Blogs con enlazado interno (pieza SEO pendiente, no empezada).
- [ ] `shopify-theme/` + `.zip` sin trackear — sin resolver aún.
- (siguen pendientes de sesiones previas: apex `.com`, handles de producto, `SHOPIFY_ADMIN_TOKEN`, envíos, pagos, ÁFA, sitemap a GSC)

---

## 2026-08-05 (Sesión 6) ✅ CERRADA — Rediseño visual completo

### Lo que se hizo

**Pivote de marca — de naranja/graffiti oscuro a morado/blanco/negro:**
- Paleta nueva: `--fire` pasó de naranja (#F5A623) a morado oscuro `#5B2EA8`; `--cardboard` a lavanda `#8F78B5`. Fondo del sitio pasó de oscuro a blanco. Ver tabla actualizada en CLAUDE.md.
- Tipografía nueva: Archivo Black (`font-display`) + Poppins (`font-sans`) reemplazan Permanent Marker + Space Grotesk. El H1 del Hero usa **Danfo** (fuente aparte, no es la variable global) y los subtítulos/CTA del Hero y de "Don't read · open" usan **ADLaM Display** — probamos Nosifer también pero el cliente no lo quiso (efecto "goteo sangre" muy literal), quedó cargada la fuente por si se reusa en otra sección más adelante.

**Componente nuevo — `DripDivider` (`src/components/DripDivider.tsx`):**
- El efecto "derretido" que ahora es parte de la identidad visual: bordes orgánicos entre secciones (navbar, footer, transición hero→productos) con relieve 3D (capas SVG offset en negro). Variantes `drip`/`wave`/`organic`.
- Bug importante resuelto: si la sección padre tiene su propio `bg-fire` de fondo, tapa el recorte y se ve una línea recta en vez del efecto orgánico — la solución fue sacar el `bg-fire` del contenedor padre y dejarlo solo en la franja de contenido, para que los "valles" de la onda muestren de verdad lo que hay detrás.
- **Pendiente**: en alguna(s) de las secciones wavy todavía se ve una línea recta remanente (parece un fondo lineal viejo que quedó por debajo del SVG) — hay que ubicarla bien y sacarla, se ve mal. Revisar navbar, footer, y transición hero→productos con zoom para encontrar exactamente dónde.

**Hero rediseñado en capas:** logo → H1 (2 líneas, corta arriba/larga abajo, morado con relieve 3D negro) → imagen (`azkomoly-caja-hero.png`, caja+"?" de cartón) superpuesta al H1 → tagline → CTA redondeado con `.btn-drip` → scroll-down animado (chevron morado con rebote).

**Navbar:** siempre morado sólido (ya no transparente/oculto — se probaron varias versiones), texto blanco, borde inferior con el efecto derretido orgánico + relieve 3D negro más profundo. Menú hamburguesa (`md:hidden`) con overlay a pantalla completa que también cierra con el efecto derretido abajo. Toggle de idioma HU/EN con banderas SVG propias (los emoji de bandera no se renderizan en Windows) y ahora **navega de verdad** entre `/` y `/en` en vez de solo cambiar cookie — de paso se arregló un bug de sincronización: el `I18nProvider` de la raíz no releía la cookie al volver de `/en`.

**Secciones:**
- "Our boxes" (productos): fondo morado con transición derretida; luego a pedido del cliente pasó de grid a **stack vertical** (una card ancha por producto, imagen grande + descripción completa sin recortar) con sombreado morado oscuro en cada card. Nuevo componente `ProductCardWide` en `ProductCard.tsx` (el `ProductCard` chico original queda para otros usos).
- "How does it work": números 01-04 mucho más grandes y morados (antes casi invisibles al 6% opacidad).
- "Don't read · open" (BigCTA): fondo con dos fotos (`boxes.jpeg` / `boxes inside.jpeg`) y **efecto de linterna** — un círculo que sigue al cursor revela la segunda foto solo ahí adentro (mask-image radial-gradient siguiendo mouse position), sin ningún velo de color encima (se probó con velo morado primero, no gustó). Hint animado "Move your cursor" con ícono de puntero.
- Carrusel "reviews" (donde antes iban las fotos lifestyle viejas — esas 6 imágenes **se borraron del disco intencionalmente**, el cliente ya no las necesita): ahora son 6 imágenes (`review1.png`...`review6.png`) que linkean a reels de Instagram/TikTok reales, con flechas de navegación y loop infinito verdadero (funciona igual con auto-scroll, arrastre o flechas — antes el loop infinito solo aplicaba al auto-scroll). Debajo, fila "Follow us" con los íconos a los canales reales.
- 3D en títulos (`.text-3d-fire`, texto morado + relieve negro): se probó en "How does it work" y "FAQ" pero el cliente no lo quiso ahí ("no se ven chidos") — se sacó de esas dos, se mantiene en "Our boxes".
- Footer: morado con texto blanco, borde superior con el efecto derretido (mismo componente, `flip` para que el borde plano quede pegado al footer y las crestas apunten hacia arriba).

**Assets nuevos en `public/`:** `azkomoly_new_logo.png` (negro, para hero/footer) y `azkomoly_new_logo_negativo.png` (blanco, para navbar) reemplazan el logo viejo `azkomoly (1).png`. `hero_new.webp` y `azkomoly-caja-hero.png` para el hero. `boxes.jpeg` / `boxes inside.jpeg` para el efecto linterna. `review1-6.png` para el carrusel social.

**Borrado intencional (confirmado con Diego):** logo viejo, `HERO_1_FRAME.jpeg`, y las 6 fotos del carrusel lifestyle viejo — ya no se usan, el carrusel de reviews las reemplazó.

**Git:** 2 commits pusheados a `main` (`c5f4482`, `6e35eca`), ambos sin publicar (Diego dijo explícitamente "aún no publicaré"). En los dos casos se revirtió `src/routeTree.gen.ts` antes de commitear (gotcha de siempre — el dev server reinyecta el bloque `@tanstack/react-start` que rompe `tsc`).

### Pendiente (para próximas sesiones)

- [ ] **Sacar la línea recta remanente en las secciones wavy** (ver arriba, sección DripDivider) — es lo primero a resolver la próxima sesión.
- [ ] **Revisar `public/refrencia hero limpia.png`** — Diego dejó esta imagen de referencia al cerrar la sesión, pidió explícitamente revisarla la próxima sesión (no procesarla ahora). Sin contexto adicional todavía sobre qué cambio implica.
- [ ] **Nuevas páginas — flujo definido por Diego, pendiente de generar vía Lovable:**
  - **About Us** (página independiente): manifiesto de marca ("Our goal"), historia/equipo ("Who we are"), y una sección "Follow us" con TODOS los logos de redes sociales. Mensaje clave: empresa 100% húngara, solo vende productos **originales** (no de marca/branded — aclarar esta distinción, es intencional y repetida por Diego) y de misterio.
  - **FAQ / Q&A** (página independiente): acordeón de preguntas frecuentes completo (envíos, cómo funcionan las sorpresas, políticas), bloque "Still need help? / Email us!" con contacto directo, footer con redes.
  - **Landing actual**: se mantiene como está (Hero, Products, Videos/reviews, Reviews con estrellas, How it works, FAQ recortado a ~3 preguntas principales + botón "Ver más" que lleva a la página FAQ completa, Footer/Follow us).
  - **HECHO 2026-08-05 (mismo día, cierre de sesión):** Lovable ya generó ambas páginas (`src/routes/about.tsx` y `src/routes/faq.tsx`), pusheadas a Lovable's remote y traídas con `git pull` + push a `main` (merge sin conflictos, commit `d5fec54`). De paso subió `@lovable.dev/vite-tanstack-config` a 2.8.5 — se corrió `npm install --legacy-peer-deps --no-package-lock` para sincronizar.
  - **Primera impresión (sin revisar en detalle todavía):** ambas páginas ya usan bastante bien el sistema de diseño — importan `DripDivider`, cargan Archivo Black + Poppins, tienen un `TITLE_STYLE` con el mismo tracking/leading que documentamos, usan `seoLinksHuOnly` (mismo patrón que las legales), y el FAQ trae categorías + el email real de contacto (`azkomoly.hu@gmail.com`). **Falta verificar a fondo la próxima sesión**: que el H1 use Danfo igual que el Hero (por ahora parece usar Archivo Black nomás, no confirmado), que los colores del `DripDivider` respeten la regla de `mainColor` = color de la sección adyacente, y que no haya quedado la línea recta remanente (ver pendiente de arriba) en estas páginas nuevas también.
  - **Pendiente real para la próxima sesión**: actualizar la navegación del navbar (agregar "About"/"FAQ" con sus links reales a `/about` y `/faq`) — **sin tocar el diseño del navbar**, solo el array `navLinks` en `TopNav` (`src/routes/index.tsx`). También revisar si hace falta agregarlas al footer o a algún otro lado de la navegación.
- [ ] `shopify-theme/` + `.zip` sin trackear — sin resolver aún (mismo pendiente de sesiones anteriores).
- (siguen pendientes de sesiones previas: apex `.com`, handles de producto, `SHOPIFY_ADMIN_TOKEN`, envíos, pagos, ÁFA, sitemap a GSC, blogs SEO)

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
