import { createFileRoute } from "@tanstack/react-router";

import { AboutPageBody } from "@/components/pages/AboutPageBody";
import { DICTIONARIES } from "@/lib/i18n/dictionary";
import { seoLinks } from "@/lib/seo";

export const Route = createFileRoute("/en/about")({
  head: () => {
    const t = DICTIONARIES.en;
    return {
      meta: [
        { title: `${t.about.title} — AZKOMOLY | 100% Hungarian mystery box` },
        { name: "description", content: t.about.intro },
        { property: "og:title", content: `${t.about.title} — AZKOMOLY` },
        { property: "og:description", content: t.about.intro },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [...seoLinks("/about", "en")],
    };
  },
  component: AboutPageBody,
});
