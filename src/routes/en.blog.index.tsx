import { createFileRoute } from "@tanstack/react-router";
import { BlogIndexPage } from "./blog.index";
import { DICTIONARIES } from "@/lib/i18n/dictionary";
import { seoLinks } from "@/lib/seo";

/** `/en/blog` — mismo listado, metadata y contenido forzados a inglés. */
export const Route = createFileRoute("/en/blog/")({
  head: () => {
    const t = DICTIONARIES.en;
    return {
      meta: [
        { title: `${t.blog.heading} — AZKOMOLY` },
        { name: "description", content: t.blog.sub },
        { property: "og:title", content: `${t.blog.heading} — AZKOMOLY` },
        { property: "og:description", content: t.blog.sub },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: "en_GB" },
      ],
      links: [...seoLinks("/blog", "en")],
    };
  },
  component: BlogIndexPage,
});
