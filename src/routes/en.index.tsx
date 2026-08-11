import { createFileRoute } from "@tanstack/react-router";
import { Landing } from "./index";
import { DICTIONARIES } from "@/lib/i18n/dictionary";
import { seoLinks, jsonLd, faqSchema } from "@/lib/seo";

/** `/en` — misma landing, metadata y contenido forzados a inglés. */
export const Route = createFileRoute("/en/")({
  head: () => {
    const t = DICTIONARIES.en;
    return {
      meta: [
        { title: t.meta.title },
        { name: "description", content: t.meta.description },
        { property: "og:title", content: t.meta.ogTitle },
        { property: "og:description", content: t.meta.ogDescription },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "en_GB" },
      ],
      links: [
        // Las fuentes se cargan una sola vez en __root.tsx (ver comentario ahí).
        ...seoLinks("/", "en"),
      ],
      scripts: [jsonLd(faqSchema(t.faq.items, "en"))],
    };
  },
  component: Landing,
});
