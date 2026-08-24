import { createFileRoute, notFound } from "@tanstack/react-router";
import { BlogPostPage } from "./blog.$slug";
import { getBlogPost, type BlogPost } from "@/content/blog/posts";
import { DICTIONARIES } from "@/lib/i18n/dictionary";
import {
  SITE_URL,
  seoLinks,
  canonicalUrl,
  jsonLd,
  blogPostingSchema,
  breadcrumbSchema,
} from "@/lib/seo";

/**
 * `/en/blog/$slug` — mismo componente de post, contenido en inglés
 * (`post.en`). Emparejado por hreflang con `/blog/$slug`.
 */
export const Route = createFileRoute("/en/blog/$slug")({
  head: (ctx) => {
    const params = ctx.params as { slug: string };
    const post = getBlogPost(params.slug);
    const t = DICTIONARIES.en;

    if (!post) {
      return {
        meta: [{ title: "AZKOMOLY Blog" }],
        links: seoLinks(`/blog/${params.slug}`, "en"),
      };
    }

    const content = post.en;
    const image = `${SITE_URL}${post.coverImage}`;
    return {
      meta: [
        { title: `${content.title} — AZKOMOLY` },
        { name: "description", content: content.excerpt },
        { property: "og:title", content: content.title },
        { property: "og:description", content: content.excerpt },
        { property: "og:type", content: "article" },
        { property: "og:locale", content: "en_GB" },
        { property: "og:url", content: canonicalUrl(`/blog/${post.slug}`, "en") },
        { property: "og:image", content: image },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: seoLinks(`/blog/${post.slug}`, "en"),
      scripts: [
        jsonLd(blogPostingSchema({
          slug: post.slug,
          title: content.title,
          excerpt: content.excerpt,
          image,
          publishedAt: post.publishedAt,
        }, "en")),
        jsonLd(breadcrumbSchema([
          { name: "AZKOMOLY", path: "/" },
          { name: t.blog.heading, path: "/blog" },
          { name: content.title, path: `/blog/${post.slug}` },
        ], "en")),
      ],
    };
  },
  loader: ({ params }) => {
    const post = getBlogPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  component: EnBlogPostPage,
});

function EnBlogPostPage() {
  const { post } = Route.useLoaderData() as { post: BlogPost };
  return <BlogPostPage post={post} />;
}
