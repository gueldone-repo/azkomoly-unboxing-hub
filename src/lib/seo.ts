/**
 * SEO / GEO helpers.
 *
 * Todo lo de acá es invisible en la página: solo alimenta <head> (canonical,
 * hreflang, JSON-LD). No renderiza UI ni cambia layout.
 *
 * Arquitectura de idiomas (ver CLAUDE.md):
 *   /      -> húngaro para crawlers (sin cookie). Es el x-default.
 *   /en    -> inglés, URL indexable propia.
 * Los dominios .com redirigen a .hu — la autoridad se concentra en azkomoly.hu.
 */
import type { Lang } from "./i18n/dictionary";

export const SITE_URL = "https://azkomoly.hu";
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

/** Prefijo de ruta por idioma. El húngaro vive en la raíz. */
export function langPrefix(lang: Lang): string {
  return lang === "hu" ? "" : "/en";
}

/** URL absoluta canónica para un path interno ("/", "/shop/x", "/privacy"). */
export function canonicalUrl(path: string, lang: Lang = "hu"): string {
  const clean = path === "/" ? "" : path.replace(/\/+$/, "");
  return `${SITE_URL}${langPrefix(lang)}${clean}` || SITE_URL;
}

/**
 * Tags <link> de canonical + hreflang para un path dado.
 * Google exige que hreflang sea recíproco y que exista x-default.
 */
export function seoLinks(path: string, lang: Lang = "hu") {
  return [
    { rel: "canonical", href: canonicalUrl(path, lang) },
    { rel: "alternate", hrefLang: "hu", href: canonicalUrl(path, "hu") },
    { rel: "alternate", hrefLang: "en", href: canonicalUrl(path, "en") },
    { rel: "alternate", hrefLang: "x-default", href: canonicalUrl(path, "hu") },
  ];
}

/**
 * Canonical sin alternates, para páginas que existen SOLO en húngaro.
 *
 * Las páginas legales (/privacy, /terms, /cookies) tienen el texto hardcodeado
 * en húngaro — no salen del diccionario. Declararles un hreflang="en" apuntaría
 * a contenido húngaro, que es una señal falsa y Google lo penaliza. Además, para
 * una Kft. húngara el ÁSZF en húngaro es lo correcto legalmente.
 */
export function seoLinksHuOnly(path: string) {
  return [{ rel: "canonical", href: canonicalUrl(path, "hu") }];
}

/** Envuelve un objeto JSON-LD como script para el array `scripts` de head(). */
export function jsonLd(data: unknown) {
  return {
    type: "application/ld+json",
    children: JSON.stringify(data),
  };
}

const ORG_ID = `${SITE_URL}/#organization`;

/**
 * Organization + WebSite. Le da a Google y a los LLMs la entidad de marca:
 * quién es AZKOMOLY, qué vende, cómo contactarlo, dónde está registrado.
 * Datos legales: Oscar Investments Kft. (ver CLAUDE.md).
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "OnlineStore",
        "@id": ORG_ID,
        name: "AZKOMOLY",
        legalName: "Oscar Investments Kft.",
        url: SITE_URL,
        logo: `${SITE_URL}/favicon-512x512.png`,
        image: OG_IMAGE,
        email: "azkomoly.hu@gmail.com",
        vatID: "32331486-2-09",
        taxID: "32331486-2-09",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Csapó utca 26. Fsz. 1. ajtó",
          addressLocality: "Debrecen",
          postalCode: "4029",
          addressCountry: "HU",
        },
        areaServed: { "@type": "Country", name: "Hungary" },
        currenciesAccepted: "HUF",
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "AZKOMOLY",
        publisher: { "@id": ORG_ID },
        inLanguage: ["hu", "en"],
      },
    ],
  };
}

export type FaqItem = { q: string; a: string };

/**
 * FAQPage. Es la pieza de mayor impacto para GEO: los motores generativos
 * (Perplexity, AI Overviews) citan pares pregunta/respuesta casi literalmente.
 */
export function faqSchema(items: FaqItem[], lang: Lang = "hu") {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: lang,
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

export type ProductSchemaInput = {
  handle: string;
  title: string;
  description: string;
  image?: string;
  price?: string;
  currency?: string;
  available?: boolean;
};

/** Product + Offer para /shop/$slug. Habilita rich results de producto. */
export function productSchema(p: ProductSchemaInput, lang: Lang = "hu") {
  const url = canonicalUrl(`/shop/${p.handle}`, lang);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    description: p.description,
    image: p.image || OG_IMAGE,
    url,
    brand: { "@type": "Brand", name: "AZKOMOLY" },
    category: "Mystery Box / Streetwear",
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: p.currency || "HUF",
      ...(p.price ? { price: p.price } : {}),
      availability: p.available === false
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
      seller: { "@id": ORG_ID },
    },
  };
}

export type BlogPostingInput = {
  slug: string;
  title: string;
  excerpt: string;
  image?: string;
  publishedAt: string;
};

/** BlogPosting — para /blog/$slug. Le da a Google (y a los LLMs) fecha, autor y resumen del post. */
export function blogPostingSchema(p: BlogPostingInput, lang: Lang = "hu") {
  const url = canonicalUrl(`/blog/${p.slug}`, lang);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: p.title,
    description: p.excerpt,
    image: p.image || OG_IMAGE,
    url,
    datePublished: p.publishedAt,
    inLanguage: lang,
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    mainEntityOfPage: url,
  };
}

/** BreadcrumbList — ayuda a Google a entender la jerarquía del sitio. */
export function breadcrumbSchema(
  trail: { name: string; path: string }[],
  lang: Lang = "hu",
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: canonicalUrl(t.path, lang),
    })),
  };
}
