import { createFileRoute } from "@tanstack/react-router";

import { AboutPageBody } from "@/components/pages/AboutPageBody";
import { DICTIONARIES } from "@/lib/i18n/dictionary";
import { seoLinks } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => {
    const t = DICTIONARIES.hu;
    return {
      meta: [
        { title: `${t.about.title} — AZKOMOLY | 100% magyar mystery box` },
        { name: "description", content: t.about.intro },
        { property: "og:title", content: `${t.about.title} — AZKOMOLY` },
        { property: "og:description", content: t.about.intro },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      // Ya existe la gemela /en/about, así que la página entra en el par
      // hreflang hu/en en vez de declararse sólo-húngaro.
      links: [...seoLinks("/about", "hu")],
    };
  },
  component: AboutPageBody,
});
