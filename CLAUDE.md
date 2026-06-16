# AZKOMOLY — Claude context

Mystery-box streetwear webshop. Pre-launch landing + fake storefront with mock data.
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

| Token | Value | Usage |
|---|---|---|
| `--fire` | `oklch(0.78 0.17 70)` = #F5A623 | Primary accent, CTAs |
| `--cardboard` | `oklch(0.66 0.12 65)` = #C8923A | Borders, secondary |
| `--dark-bg` | `oklch(0.16 0 0)` = #111 | Card backgrounds |
| `--background` | `oklch(0.14 0 0)` | Page background |

**Fonts:** `font-display` = Permanent Marker (graffiti), `font-sans` = Space Grotesk.

**Signature utilities** (defined in `src/styles.css`):
- `.graffiti-border` — fire-colored offset box-shadow
- `.text-fire-glow` — fire text-shadow glow
- `.text-stroke-black` — black text stroke
- `.torn-card` / `.torn-divider` — clip-path torn paper edges
- Animations: `pulse-glow`, `float-piece`, `fade-up`, `marquee`

---

## Architecture

### Routes
- `/` → `src/routes/index.tsx` — Full landing page
- `/shop/$slug` → `src/routes/shop.$slug.tsx` — Product detail
- `/privacy`, `/terms`, `/cookies` — Legal pages

### Key components
| File | What it does |
|---|---|
| `src/components/ScrubBackdrop.tsx` | Sticky canvas that scrubs 101 JPEG frames on scroll. Frames are **reversed** (f_101 = first visible = box open, f_001 = last = box closed). Initial draw triggers on f_101 load (`i === FRAME_COUNT - 1`). |
| `src/components/HeroOverlay.tsx` | Text + CTA on top of the scrub canvas. Parallax decoupled from scrub (uses `scrollY / innerHeight`). No corner brackets. Text centered-bottom. |
| `src/components/BoxSpinner.tsx` | Temu-style popup: 3 floating boxes, pick one, reveals discount code `AZKOMOLY10`. Auto-shows 1.8s after page load. |
| `src/components/cart/CartSheet.tsx` | `CartButton` (badge) + right-side drawer. Mock checkout (no payment). |
| `src/components/LanguageToggle.tsx` | HU/EN segmented button. |
| `src/components/shop/ProductCard.tsx` | Product card with real photo (`p.image`), badges, quick-add. |

### Data
- **Products:** `src/lib/mock-products.ts` — 4 tiers: mini (9990), klasszik (19990), premium (39990), legendas (79990) HUF. Each has an `image` path pointing to `/public/*.jpeg`.
- **i18n:** `src/lib/i18n/dictionary.ts` — Full typed `Dict` with `hu` and `en`. Always add keys to **both** languages. Use `useT()` hook in components. Cookie `azkomoly_lang`, default `hu`.
- **Cart:** `src/lib/cart.tsx` — localStorage `azkomoly_cart_v1`, keyed by `productId-size`. `add()` auto-opens drawer.

### Hero frames
- 101 JPEGs in `public/hero-frames/f_001.jpg` → `f_101.jpg` (1280×698 source)
- `f_101.jpg` was replaced with `HERO_1_FRAME.jpeg` (high-quality exploding box shot)
- Reversed order: `idx = (1 - p) * (FRAME_COUNT - 1)` — box opens on load, closes as you scroll

### Images in `public/`
| File | Used where |
|---|---|
| `1_box_cerrada.png` | BoxSpinner closed boxes, `2_box_abierta.png` for open |
| `Floating_cardboard_box_AZKOMOLY_….jpeg` | All 4 product cards + product detail pages |
| `azkomoly (1).png` | Navbar logo (white graffiti, `filter: brightness(0) invert(1)`) |
| `Outfit_reveal_vertical_box_…`, `Unboxing_…`, `Hands_…` | LifestyleStrip marquee (index.tsx) |

> Filenames with `…` (U+2026) are literal — use the character as-is in `src` attributes.

---

## Backend (do NOT touch unless asked)

- **Supabase:** Only `azkomoly_leads` table (email signups/waitlist). Lead insert + Google Sheet mirror via `appendLeadToSheet` server fn.
- **Shopify:** Planned for checkout — not implemented yet. Do NOT add Stripe.
- Everything else is mock data. No products/orders/cart tables in Supabase.

---

## Known gotchas

### TS false positive on `shop.$slug.tsx`
Running the dev server regenerates `routeTree.gen.ts` with a `Register` block causing a cyclic type error on `Route.useLoaderData()`. **It's a dev-server artifact, not real.** Fix if needed:
```
git checkout -- src/routeTree.gen.ts
```
`tsc --noEmit` exits 0 with the committed file.

### npm install
Always use:
```
npm install --legacy-peer-deps --no-package-lock
```
Plain `npm install` fails due to a nitro ↔ `@lovable.dev/vite-tanstack-config` peer-dep conflict.

### BoxSpinner
Shows on every page load (no sessionStorage gate — intentional for demo). When going to production, add back a `localStorage` check with a timestamp for once-per-day behavior.

---

## Rules

1. **Visual/design only** — Diego guides all work. Don't run ahead or build features unprompted.
2. **No backend changes** — Supabase schema and server functions are frozen unless explicitly requested.
3. **No Stripe** — future checkout is Shopify only.
4. **Don't commit `routeTree.gen.ts`** if it has a `Register` block added by the dev server.
5. When adding copy, always add to **both** `hu` and `en` in `dictionary.ts` and the `Dict` type.
