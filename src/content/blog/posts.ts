import type { Lang } from "@/lib/i18n/dictionary";

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "img"; src: string; alt: string }
  | { type: "quote"; text: string };

export type BlogPostContent = {
  title: string;
  excerpt: string;
  blocks: BlogBlock[];
};

export type BlogPost = {
  slug: string;
  publishedAt: string; // ISO date
  category: string;
  coverImage: string;
  hu: BlogPostContent;
  en: BlogPostContent;
};

/**
 * Contenido del blog vivo en el repo — sin CMS ni tabla nueva de Supabase (el
 * schema está congelado salvo pedido explícito, ver CLAUDE.md). Para publicar
 * un post nuevo: agregarlo acá (mismo slug en hu/en) y sumarlo a mano a
 * `BLOG_ROUTES` en `scripts/generate-sitemap.mjs`.
 *
 * Los 2 posts de acá son placeholder — mismo patrón `[Placeholder]` que ya usan
 * `about.tsx` y `faq.tsx` — para dejar el sistema demostrable. Diego reemplaza
 * el contenido real editando este archivo.
 */
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "mi-az-a-mystery-box",
    publishedAt: "2026-08-17",
    category: "guias",
    coverImage: "/HERO_1_FRAME.jpeg",
    hu: {
      title: "Mi az a mystery box, és miért nem tudod előre mi van benne?",
      excerpt:
        "[Placeholder] Rövid bevezető cikk: mi az a mystery box koncepció, honnan jött, és miért éppen ez a lényege.",
      blocks: [
        {
          type: "p",
          text: "[Placeholder — bevezető bekezdés a mystery box koncepcióról, 2-3 mondat.]",
        },
        { type: "h2", text: "[Placeholder] Miért izgalmasabb, mint egy sima rendelés?" },
        {
          type: "p",
          text: "[Placeholder — magyarázó szöveg a meglepetés-élményről.]",
        },
        {
          type: "ul",
          items: [
            "[Placeholder] Garantált minimum érték minden dobozban",
            "[Placeholder] Eredeti, új termékek",
            "[Placeholder] Gyors szállítás",
          ],
        },
        { type: "h2", text: "[Placeholder] Melyik dobozzal érdemes kezdeni?" },
        {
          type: "p",
          text: "[Placeholder — ajánlás a Mini dobozra kezdőknek, link a bolthoz lent.]",
        },
      ],
    },
    en: {
      title: "What is a mystery box, and why don't you know what's inside?",
      excerpt:
        "[Placeholder] A short intro article: what the mystery box concept is, where it came from, and why not knowing is the whole point.",
      blocks: [
        {
          type: "p",
          text: "[Placeholder — intro paragraph about the mystery box concept, 2-3 sentences.]",
        },
        { type: "h2", text: "[Placeholder] Why is it more exciting than a regular order?" },
        {
          type: "p",
          text: "[Placeholder — explainer copy about the surprise experience.]",
        },
        {
          type: "ul",
          items: [
            "[Placeholder] Guaranteed minimum value in every box",
            "[Placeholder] Original, brand new products",
            "[Placeholder] Fast shipping",
          ],
        },
        { type: "h2", text: "[Placeholder] Which box should you start with?" },
        {
          type: "p",
          text: "[Placeholder — recommendation for the Mini box for first-timers, link to the shop below.]",
        },
      ],
    },
  },
  {
    slug: "honnan-szarmaznak-a-termekeink",
    publishedAt: "2026-08-17",
    category: "detras-de-la-caja",
    coverImage: "/HERO_1_FRAME.jpeg",
    hu: {
      title: "Honnan származnak az AZKOMOLY dobozokban lévő termékek?",
      excerpt:
        "[Placeholder] Betekintés abba, hogyan válogatjuk össze a dobozok tartalmát — átvett, visszaküldött és túlkészletezett csomagokból.",
      blocks: [
        {
          type: "p",
          text: "[Placeholder — bevezető a téma fontosságáról: átláthatóság a vásárlók felé.]",
        },
        { type: "h2", text: "[Placeholder] A liquidation csomagok világa" },
        {
          type: "p",
          text: "[Placeholder — bővebb magyarázat, ugyanaz a téma mint a GYIK-ben, de kifejtve.]",
        },
        { type: "quote", text: "[Placeholder] Minden szállítmány más — ezért minden doboz egyedi." },
      ],
    },
    en: {
      title: "Where do the products inside AZKOMOLY boxes come from?",
      excerpt:
        "[Placeholder] A look behind how we source the contents of each box — from unclaimed, returned, and overstock parcels.",
      blocks: [
        {
          type: "p",
          text: "[Placeholder — intro about why this matters: transparency toward customers.]",
        },
        { type: "h2", text: "[Placeholder] The world of liquidation parcels" },
        {
          type: "p",
          text: "[Placeholder — expanded explanation, same topic as the FAQ but in more depth.]",
        },
        { type: "quote", text: "[Placeholder] Every shipment is different — that's why every box is unique." },
      ],
    },
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getBlogPostContent(post: BlogPost, lang: Lang): BlogPostContent {
  return post[lang];
}
