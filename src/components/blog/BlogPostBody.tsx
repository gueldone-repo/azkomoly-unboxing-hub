import type { BlogBlock } from "@/content/blog/posts";

const TITLE_STYLE = {
  fontFamily: "'Anton', var(--font-display)",
  letterSpacing: "-0.02em",
  lineHeight: 0.9,
} as const;

/** Mapea los bloques de contenido de un post a JSX con la tipografía del sitio. */
export function BlogPostBody({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="mx-auto max-w-2xl flex flex-col gap-5">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "h2":
            return (
              <h2
                key={i}
                className="text-fire text-[clamp(1.75rem,6vw,2.75rem)] uppercase mt-4"
                style={TITLE_STYLE}
              >
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="font-display text-xl text-foreground mt-2">
                {block.text}
              </h3>
            );
          case "p":
            return (
              <p key={i} className="font-sans text-base text-foreground/85 leading-relaxed">
                {block.text}
              </p>
            );
          case "ul":
            return (
              <ul key={i} className="font-sans text-base text-foreground/85 leading-relaxed list-disc pl-5 flex flex-col gap-1.5">
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            );
          case "quote":
            return (
              <blockquote
                key={i}
                className="border-l-4 border-fire pl-4 font-sans italic text-lg text-foreground/80"
              >
                {block.text}
              </blockquote>
            );
          case "img":
            return (
              <img
                key={i}
                src={block.src}
                alt={block.alt}
                loading="lazy"
                className="w-full rounded-2xl object-cover"
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
