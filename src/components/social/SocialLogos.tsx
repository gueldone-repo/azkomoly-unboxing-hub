import { siInstagram, siTiktok, siYoutube, siFacebook } from "simple-icons";

/**
 * Logos OFICIALES de las redes, en un solo sitio.
 *
 * Los paths vienen del paquete `simple-icons`, que publica el trazo oficial de
 * cada marca. Antes el sitio usaba los iconos genéricos de lucide-react (líneas
 * dibujadas "a la manera de"), que no son los logos reales; y el de TikTok era
 * un path suelto copiado dentro de index.tsx.
 *
 * Los enlaces también viven acá: estaban duplicados en dos sitios de index.tsx
 * y la copia del navbar tenía `href="#"` en Facebook, YouTube y TikTok, así que
 * tres de los cuatro iconos de la barra superior no llevaban a ninguna parte.
 */

export type SocialKey = "instagram" | "tiktok" | "youtube" | "facebook";

export const SOCIAL_LINKS: {
  key: SocialKey;
  label: string;
  href: string;
  path: string;
  /** Color de marca oficial, tal como lo publica cada compañía. */
  brand: string;
}[] = [
  {
    key: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/azkomoly.hu/",
    path: siInstagram.path,
    brand: `#${siInstagram.hex}`,
  },
  {
    key: "tiktok",
    label: "TikTok",
    href: "https://www.tiktok.com/@azkomoly.hu",
    path: siTiktok.path,
    brand: `#${siTiktok.hex}`,
  },
  {
    key: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/@AzKomolyHungary",
    path: siYoutube.path,
    brand: `#${siYoutube.hex}`,
  },
  {
    key: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61590505527795",
    path: siFacebook.path,
    brand: `#${siFacebook.hex}`,
  },
];

export function SocialGlyph({ path, className = "" }: { path: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

/**
 * Fila de logos.
 *
 * `tone`:
 *  - "brand"  → cada logo en su color oficial. Sólo sobre fondo claro.
 *  - "white"  → todos en blanco, para las secciones moradas. El negro oficial
 *               de TikTok sobre morado no se distingue, y el azul de Facebook
 *               queda casi ilegible, así que ahí la forma oficial se mantiene
 *               pero el relleno se unifica.
 */
export function SocialRow({
  tone = "brand",
  className = "",
  iconClassName = "h-5 w-5",
}: {
  tone?: "brand" | "white";
  className?: string;
  iconClassName?: string;
}) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {SOCIAL_LINKS.map((s) => (
        <a
          key={s.key}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          className="transition-transform duration-200 hover:-translate-y-0.5"
          style={{ color: tone === "brand" ? s.brand : "#FFFFFF" }}
        >
          <SocialGlyph path={s.path} className={iconClassName} />
        </a>
      ))}
    </div>
  );
}

/**
 * Columna lateral del hero. Pedido de George: que se pueda seguir a AZKOMOLY
 * de inmediato, sin buscar. Queda pegada al borde izquierdo, fuera del camino
 * del CTA de compra, así no compiten por el mismo clic.
 *
 * Oculta por debajo de lg: en móvil el hero ya va justo de espacio y una
 * columna flotante taparía la caja. Ahí las redes viven en el menú y el footer.
 */
export function SocialRail() {
  return (
    <div className="hidden lg:flex fixed left-3 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-1">
      {SOCIAL_LINKS.map((s) => (
        <a
          key={s.key}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          className="grid place-items-center h-11 w-11 rounded-full bg-white/85 backdrop-blur-sm shadow-[0_4px_14px_rgba(13,13,13,0.10)] transition-all duration-200 hover:scale-110 hover:bg-white hover:shadow-[0_6px_20px_rgba(13,13,13,0.18)]"
          style={{ color: s.brand }}
        >
          <SocialGlyph path={s.path} className="h-[18px] w-[18px]" />
        </a>
      ))}
    </div>
  );
}
