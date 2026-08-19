import { SOCIAL_LINKS, SocialGlyph } from "@/components/social/SocialLogos";
import { Marquee } from "@/components/ui/marquee";
import { SOCIAL_REVIEWS } from "@/lib/social-reviews";
import { useT } from "@/lib/i18n";

/**
 * "Real unboxings" — vive en About (pedido de Diego, commit del 17/08).
 * El commit que la creó nunca la conectó a `AboutPageBody`, así que quedó
 * huérfana; se veía como código muerto y se borró por error el 19/08. Se
 * restaura acá, ahora sí importada en `AboutPageBody.tsx`. `SOCIAL_REVIEWS`
 * vive en `src/lib/social-reviews.ts` — mismo origen de datos que usa
 * `LifestyleStrip` en Home, pero con un tratamiento visual distinto
 * (marquee vertical en 3 columnas con perspectiva 3D, no la cinta horizontal
 * de Home): son dos secciones a propósito, no un duplicado.
 */
function ReviewCard({
  review,
  index,
}: {
  review: (typeof SOCIAL_REVIEWS)[number];
  index: number;
}) {
  const t = useT();
  const platform = SOCIAL_LINKS.find((s) => s.key === review.platform);

  return (
    <a
      href={review.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block w-36 overflow-hidden rounded-md border-2 border-black bg-white shadow-[8px_8px_0_#0D0D0D] transition-transform duration-200 hover:-translate-y-1 sm:w-44"
      aria-label={`${t.socialProof.openOn} ${platform?.label ?? review.platform}`}
    >
      <img
        src={review.src}
        alt={`${platform?.label ?? review.platform} ${t.socialProof.screenshotAlt} ${index + 1}`}
        className="aspect-[3/4] h-auto w-full object-cover"
        loading="lazy"
        decoding="async"
      />
      <span className="absolute left-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black text-white">
        {platform && <SocialGlyph path={platform.path} className="h-4 w-4" />}
      </span>
    </a>
  );
}

export function SocialProofMarquee() {
  const t = useT();
  const columns = [
    SOCIAL_REVIEWS.filter((_, i) => i % 3 === 0),
    SOCIAL_REVIEWS.filter((_, i) => i % 3 === 1),
    SOCIAL_REVIEWS.filter((_, i) => i % 3 === 2),
  ];

  return (
    <section className="overflow-hidden bg-white py-18 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <p className="mb-3 font-sans text-xs font-bold uppercase tracking-[0.35em] text-fire">
            {t.socialProof.kicker}
          </p>
          <h2 className="font-display text-4xl leading-none text-black sm:text-6xl">
            {t.socialProof.heading}
          </h2>
          {/* TODO: Replace this with real transcribed creator/customer copy when provided. */}
          <p className="mt-5 max-w-[34rem] font-sans text-base leading-relaxed text-black/68">
            {t.socialProof.sub}
          </p>
        </div>
        {/* Altura fija: en mobile `520px` casi llenaba la pantalla entera —
            achicada ahí, vuelve al tamaño original desde `sm`. */}
        <div className="relative h-[360px] sm:h-[520px] overflow-hidden [perspective:900px]">
          <div className="absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-white to-transparent" />
          <div className="absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-white to-transparent" />
          <div className="grid h-full grid-cols-3 gap-3 [transform:rotateX(10deg)_rotateZ(-4deg)_scale(1.03)] sm:gap-5">
            {columns.map((items, index) => (
              <Marquee
                key={index}
                vertical
                reverse={index % 2 === 1}
                pauseOnHover
                repeat={5}
                className="[--duration:26s] [--gap:1rem]"
              >
                {items.map((review, itemIndex) => (
                  <ReviewCard
                    key={`${review.src}-${itemIndex}`}
                    review={review}
                    index={SOCIAL_REVIEWS.indexOf(review)}
                  />
                ))}
              </Marquee>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
