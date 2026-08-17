import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteBreadcrumb } from "@/components/SiteBreadcrumb";
import { BlogPostBody } from "@/components/blog/BlogPostBody";
import { SiteFooter } from "@/components/SiteFooter";
import { getBlogPost, type BlogPost } from "@/content/blog/posts";
import { useT, useI18n } from "@/lib/i18n";
import { DICTIONARIES, type Lang } from "@/lib/i18n/dictionary";
import {
  SITE_URL,
  seoLinks,
  canonicalUrl,
  jsonLd,
  blogPostingSchema,
  breadcrumbSchema,
} from "@/lib/seo";

export const Route = createFileRoute("/blog/$slug")({
  head: (ctx) => {
    const params = ctx.params as { slug: string };
    const post = getBlogPost(params.slug);
    const t = DICTIONARIES.hu;

    if (!post) {
      return {
        meta: [{ title: "AZKOMOLY Blog" }],
        links: seoLinks(`/blog/${params.slug}`, "hu"),
      };
    }

    const content = post.hu;
    const image = `${SITE_URL}${post.coverImage}`;
    return {
      meta: [
        { title: `${content.title} — AZKOMOLY` },
        { name: "description", content: content.excerpt },
        { property: "og:title", content: content.title },
        { property: "og:description", content: content.excerpt },
        { property: "og:type", content: "article" },
        { property: "og:url", content: canonicalUrl(`/blog/${post.slug}`, "hu") },
        { property: "og:image", content: image },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: seoLinks(`/blog/${post.slug}`, "hu"),
      scripts: [
        jsonLd(blogPostingSchema({
          slug: post.slug,
          title: content.title,
          excerpt: content.excerpt,
          image,
          publishedAt: post.publishedAt,
        }, "hu")),
        jsonLd(breadcrumbSchema([
          { name: "AZKOMOLY", path: "/" },
          { name: t.blog.heading, path: "/blog" },
          { name: content.title, path: `/blog/${post.slug}` },
        ], "hu")),
      ],
    };
  },
  loader: ({ params }) => {
    const post = getBlogPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  notFoundComponent: () => <BlogPostNotFound lang="hu" />,
  component: HuBlogPostPage,
});

function HuBlogPostPage() {
  const { post } = Route.useLoaderData();
  return <BlogPostPage post={post} />;
}

function BlogPostNotFound({ lang }: { lang: Lang }) {
  const t = useT();
  return (
    <div className="min-h-screen grid place-items-center bg-background text-foreground p-6 text-center">
      <div>
        <h1 className="font-display text-4xl text-fire mb-4">{t.product.notFound}</h1>
        <Link
          to={lang === "hu" ? "/blog" : "/en/blog"}
          className="bg-fire text-primary-foreground font-display px-6 py-3 btn-drip"
        >
          {t.blog.backToBlog}
        </Link>
      </div>
    </div>
  );
}

const TITLE_STYLE = {
  fontFamily: "'Anton', var(--font-display)",
  letterSpacing: "-0.02em",
  lineHeight: 0.9,
} as const;

/**
 * Recibe `post` por prop (no lee `Route.useLoaderData()` acá adentro) — mismo
 * motivo que `ProductPage` en `shop.$slug.tsx`: lo reutiliza `/en/blog/$slug`
 * con un `Route` distinto.
 */
export function BlogPostPage({ post }: { post: BlogPost }) {
  const t = useT();
  const { lang } = useI18n();
  const content = post[lang];
  const blogPath = lang === "hu" ? "/blog" : "/en/blog";
  const publishedDate = new Date(post.publishedAt).toLocaleDateString(
    lang === "hu" ? "hu-HU" : "en-GB",
    { year: "numeric", month: "long", day: "numeric" },
  );

  return (
    <main className="bg-background text-foreground min-h-screen">
      <SiteBreadcrumb
        trail={[
          { name: "AZKOMOLY", path: lang === "hu" ? "/" : "/en" },
          { name: t.blog.heading, path: blogPath },
          { name: content.title },
        ]}
      />

      <article className="px-6 pt-8 pb-16">
        <header className="mx-auto max-w-2xl flex flex-col gap-3 pb-8">
          <span className="font-sans text-[11px] uppercase tracking-widest text-fire">
            {post.category}
          </span>
          <h1
            className="text-fire text-3d-fire text-[clamp(2rem,8vw,3.5rem)] uppercase leading-[0.95]"
            style={TITLE_STYLE}
          >
            {content.title}
          </h1>
          <p className="font-sans text-xs text-foreground/50">
            {t.blog.publishedOn} {publishedDate}
          </p>
        </header>

        <div className="mx-auto max-w-2xl mb-8 rounded-2xl overflow-hidden">
          <img src={post.coverImage} alt="" className="w-full object-cover" />
        </div>

        <BlogPostBody blocks={content.blocks} />

        {/* Enlazado interno real: el pedido original era justo esto. */}
        <div className="mx-auto max-w-2xl mt-12 pt-8 border-t border-cardboard/30">
          <p className="font-sans text-xs uppercase tracking-widest text-foreground/50 mb-3">
            {t.blog.relatedHeading}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to={lang === "hu" ? "/" : "/en"}
              hash="termekek"
              className="rounded-full bg-fire text-white font-sans text-sm px-5 py-2.5 btn-drip"
            >
              {t.blog.relatedShop}
            </Link>
            {/* /faq sólo existe en húngaro por ahora (ver about.tsx/faq.tsx) —
                enlazamos ahí en ambos idiomas hasta que tenga versión /en. */}
            <Link
              to="/faq"
              className="rounded-full border-2 border-fire text-fire font-sans text-sm px-5 py-2.5 hover:bg-fire hover:text-white transition-colors"
            >
              {t.blog.relatedFaq}
            </Link>
          </div>
          <Link
            to={blogPath}
            className="inline-block mt-6 font-sans text-sm text-foreground/60 hover:text-fire"
          >
            ← {t.blog.backToBlog}
          </Link>
        </div>
      </article>

      <SiteFooter productsHref={lang === "hu" ? "/#termekek" : "/en#termekek"} />
    </main>
  );
}
