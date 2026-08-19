// Datos de reseñas reales (reels/TikToks propios) usados por `LifestyleStrip`
// en `index.tsx` (sección "#velemenyek", único lugar donde hoy se muestran —
// el componente `SocialProofMarquee` que vivía en `SocialProofMarquee.tsx`
// nunca se llegó a renderizar y se eliminó).
export const SOCIAL_REVIEWS: { src: string; href: string; platform: "instagram" | "tiktok" }[] = [
  { src: "/review1.webp", href: "https://www.instagram.com/reel/DbOVwukMheu/?utm_source=ig_web_button_share_sheet&igsh=MzRlODBiNWFlZA==", platform: "instagram" },
  { src: "/review2.webp", href: "https://www.instagram.com/reel/DbAyYwQO_z9/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==", platform: "instagram" },
  { src: "/review3.webp", href: "https://www.instagram.com/reel/DanS3tFsao4/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==", platform: "instagram" },
  { src: "/review4.webp", href: "https://www.instagram.com/reel/DaLM-yzsLz_/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==", platform: "instagram" },
  { src: "/review5.webp", href: "https://www.instagram.com/reel/DaFsFjgKlCR/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==", platform: "instagram" },
  { src: "/review6.webp", href: "https://www.tiktok.com/@azkomoly.hu/video/7670098419981110550?is_from_webapp=1&sender_device=pc&web_id=7644208246575662593", platform: "tiktok" },
];
