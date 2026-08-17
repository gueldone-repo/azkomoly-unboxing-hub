import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { BlogCard } from "@/components/blog/BlogCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/nav/SiteNav";
import { BLOG_POSTS } from "@/content/blog/posts";
import { useT, useI18n, readLangCookie } from "@/lib/i18n";
import { DICTIONARIES } from "@/lib/i18n/dictionary";
import { seoLinks } from "@/lib/seo";

export const Route = createFileRoute("/blog/")({
  head: () => {
    // Igual que en `index.tsx`: un crawler llega sin cookie -> húngaro (x-default).
    const lang = readLangCookie();
    const t = DICTIONARIES[lang];
    return {
      meta: [
        { title: `${t.blog.heading} — AZKOMOLY` },
        { name: "description", content: t.blog.sub },
        { property: "og:title", content: `${t.blog.heading} — AZKOMOLY` },
        { property: "og:description", content: t.blog.sub },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [...seoLinks("/blog", lang)],
    };
  },
  component: BlogIndexPage,
});

const TITLE_STYLE = {
  fontFamily: "'Anton', var(--font-display)",
  letterSpacing: "-0.02em",
  lineHeight: 0.85,
} as const;

/**
 * Sin props: lee el idioma del `I18nProvider` de contexto — mismo patrón que
 * `Landing` en `index.tsx`. Para `/blog` ese provider sigue la cookie; para
 * `/en/blog` el layout `en.tsx` ya lo fuerza a inglés con `forceLang="en"`, así
 * que este componente sirve tal cual para ambas rutas sin duplicar lógica.
 */
export function BlogIndexPage() {
  const { lang } = useI18n();
  return (
    <main className="bg-background pt-16">
      <SiteNav />
      <BlogHero />
      <BlogGrid />
      <SiteFooter productsHref={lang === "hu" ? "/#termekek" : "/en#termekek"} />
    </main>
  );
}

function BlogHero() {
  const t = useT();
  const { lang } = useI18n();
  return (
    <section className="bg-background px-6 pt-14 pb-10 sm:pt-20 sm:pb-14 flex flex-col items-center text-center gap-6">
      <Link to={lang === "hu" ? "/" : "/en"} aria-label="AZKOMOLY">
        <img
          src="/azkomoly_new_logo.webp"
          alt="AZKOMOLY logó"
          className="h-24 sm:h-32 w-auto"
        />
      </Link>
      <span className="font-sans text-xs uppercase tracking-[0.3em] text-fire">
        {t.blog.kicker}
      </span>
      <h1 className="text-fire text-3d-fire text-[clamp(2.5rem,12vw,6rem)] uppercase" style={TITLE_STYLE}>
        {t.blog.heading}
      </h1>
      <p className="font-sans text-sm sm:text-base text-foreground/70 max-w-md">{t.blog.sub}</p>
    </section>
  );
}

function BlogGrid() {
  const t = useT();
  const { lang } = useI18n();
  if (BLOG_POSTS.length === 0) {
    return (
      <section className="bg-background px-6 pb-20 text-center">
        <p className="font-sans text-foreground/60">{t.blog.empty}</p>
      </section>
    );
  }
  return (
    <section className="bg-background px-6 pb-20">
      <div className="mx-auto max-w-5xl grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {BLOG_POSTS.map((post) => (
          <BlogCard
            key={post.slug}
            post={post}
            content={post[lang]}
            lang={lang}
            readMore={t.blog.readMore}
          />
        ))}
      </div>
    </section>
  );
}

