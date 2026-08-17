import { Link } from "@tanstack/react-router";
import type { BlogPost, BlogPostContent } from "@/content/blog/posts";
import type { Lang } from "@/lib/i18n/dictionary";

export function BlogCard({
  post,
  content,
  lang,
  readMore,
}: {
  post: BlogPost;
  content: BlogPostContent;
  lang: Lang;
  readMore: string;
}) {
  const href = lang === "hu" ? `/blog/${post.slug}` : `/en/blog/${post.slug}`;
  return (
    <Link
      to={href}
      className="group rounded-2xl overflow-hidden border-2 border-cardboard/30 bg-dark-bg hover:border-fire/60 transition-colors flex flex-col"
    >
      <div className="aspect-[16/9] overflow-hidden">
        <img
          src={post.coverImage}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-5 flex flex-col gap-2">
        <span className="font-sans text-[11px] uppercase tracking-widest text-fire">
          {post.category}
        </span>
        <h3 className="font-display text-xl text-foreground leading-tight">{content.title}</h3>
        <p className="font-sans text-sm text-foreground/70 leading-relaxed line-clamp-2">
          {content.excerpt}
        </p>
        <span className="font-sans text-xs font-semibold text-fire group-hover:underline mt-1">
          {readMore} →
        </span>
      </div>
    </Link>
  );
}
