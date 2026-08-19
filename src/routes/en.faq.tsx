import { createFileRoute } from "@tanstack/react-router";

import { FaqPageBody } from "@/components/pages/FaqPageBody";
import { DICTIONARIES } from "@/lib/i18n/dictionary";
import { seoLinks, jsonLd, faqSchema } from "@/lib/seo";

export const Route = createFileRoute("/en/faq")({
  head: () => {
    const t = DICTIONARIES.en;
    return {
      meta: [
        { title: "FAQ — AZKOMOLY mystery box questions and answers" },
        { name: "description", content: t.faqPage.intro },
        { property: "og:title", content: "FAQ — AZKOMOLY" },
        { property: "og:description", content: t.faqPage.intro },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [...seoLinks("/faq", "en")],
      scripts: [jsonLd(faqSchema(t.faq.items, "en"))],
    };
  },
  component: FaqPageBody,
});
