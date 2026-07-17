/**
 * Genera public/sitemap.xml leyendo los productos reales de Shopify.
 *
 *   node scripts/generate-sitemap.mjs
 *
 * Correr cada vez que se agregue/quite/renombre un producto en Shopify.
 * (Esta versión de TanStack Start no expone server routes, así que el sitemap
 * es un archivo estático — por eso hay que regenerarlo a mano.)
 *
 * Cada URL declara sus alternates hreflang hu/en + x-default, como pide Google.
 */
import { writeFileSync } from "node:fs";

const SITE = "https://azkomoly.hu";
const SHOP = "ipqptg-19.myshopify.com";
const TOKEN = "88a7bc92a4e3b38691a12713f4a7ac34"; // storefront, público read-only
const API = "2025-07";

/**
 * Rutas estáticas: [path, prioridad, changefreq, tieneVersionEn]
 *
 * Las legales son hu-only: su texto está hardcodeado en húngaro, así que no
 * existe /en/privacy y NO deben declarar alternate en inglés (sería una señal
 * falsa hacia contenido húngaro).
 */
const STATIC_ROUTES = [
  ["/", "1.0", "daily", true],
  ["/privacy", "0.3", "yearly", false],
  ["/terms", "0.3", "yearly", false],
  ["/cookies", "0.3", "yearly", false],
];

async function fetchProducts() {
  const res = await fetch(`https://${SHOP}/api/${API}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN,
    },
    body: JSON.stringify({
      query: `{ products(first: 50) { edges { node { handle updatedAt } } } }`,
    }),
  });
  if (!res.ok) throw new Error(`Shopify ${res.status}: ${await res.text()}`);
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data.products.edges.map((e) => e.node);
}

const xmlEscape = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
   .replace(/"/g, "&quot;").replace(/'/g, "&apos;");

/** Un <url> con sus alternates hreflang. `path` es el path húngaro (sin /en). */
function urlEntry(path, { lastmod, priority, changefreq, hasEn = true } = {}) {
  const hu = `${SITE}${path === "/" ? "/" : path}`;
  const en = `${SITE}/en${path === "/" ? "" : path}`;
  const alts = hasEn
    ? [["hu", hu], ["en", en], ["x-default", hu]]
        .map(([l, href]) =>
          `    <xhtml:link rel="alternate" hreflang="${l}" href="${xmlEscape(href)}"/>`)
        .join("\n")
    : null;

  return [
    "  <url>",
    `    <loc>${xmlEscape(hu)}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : null,
    priority ? `    <priority>${priority}</priority>` : null,
    alts,
    "  </url>",
  ].filter(Boolean).join("\n");
}

const products = await fetchProducts();
const today = new Date().toISOString().slice(0, 10);

const entries = [
  ...STATIC_ROUTES.map(([path, priority, changefreq, hasEn]) =>
    urlEntry(path, { lastmod: today, priority, changefreq, hasEn })),
  ...products.map((p) =>
    urlEntry(`/shop/${p.handle}`, {
      lastmod: (p.updatedAt || today).slice(0, 10),
      priority: "0.8",
      changefreq: "weekly",
      hasEn: true,
    })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join("\n")}
</urlset>
`;

writeFileSync("public/sitemap.xml", xml, "utf8");
console.log(
  `sitemap.xml -> ${entries.length} URLs ` +
  `(${STATIC_ROUTES.length} estáticas + ${products.length} productos), ` +
  `cada una con hreflang hu/en/x-default`,
);
