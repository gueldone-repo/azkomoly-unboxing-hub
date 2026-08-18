import { createFileRoute } from "@tanstack/react-router";

import { FaqPageBody } from "@/components/pages/FaqPageBody";
import { DICTIONARIES } from "@/lib/i18n/dictionary";
import { seoLinks, jsonLd, faqSchema } from "@/lib/seo";

export const Route = createFileRoute("/faq")({
  head: () => {
    const t = DICTIONARIES.hu;
    return {
      meta: [
        { title: "GYIK — AZKOMOLY mystery box kérdések és válaszok" },
        { name: "description", content: t.faqPage.intro },
        { property: "og:title", content: "GYIK — AZKOMOLY" },
        { property: "og:description", content: t.faqPage.intro },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [...seoLinks("/faq", "hu")],
      scripts: [jsonLd(faqSchema(t.faq.items, "hu"))],
    };
  },
  component: FaqPageBody,
});
