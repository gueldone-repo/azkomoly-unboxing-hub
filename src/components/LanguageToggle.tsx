import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useI18n, LANGS, type Lang } from "@/lib/i18n";

// Windows no renderiza los emoji de bandera regional (🇭🇺/🇬🇧) como banderas
// reales — muestra las letras del código de país en texto plano. Usamos SVGs
// propios para que se vea igual en cualquier sistema operativo.
function FlagIcon({ code, className = "" }: { code: Lang; className?: string }) {
  if (code === "hu") {
    return (
      <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
        <rect width="30" height="20" fill="#FFFFFF" />
        <rect width="30" height="6.67" fill="#CE2939" />
        <rect y="13.33" width="30" height="6.67" fill="#477050" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 30 20" className={className} aria-hidden="true">
      <rect width="30" height="20" fill="#00247D" />
      <path d="M0,0 L30,20 M30,0 L0,20" stroke="#FFFFFF" strokeWidth="4" />
      <path d="M0,0 L30,20 M30,0 L0,20" stroke="#CF142B" strokeWidth="1.5" />
      <path d="M15,0 V20 M0,10 H30" stroke="#FFFFFF" strokeWidth="6.5" />
      <path d="M15,0 V20 M0,10 H30" stroke="#CF142B" strokeWidth="4" />
    </svg>
  );
}

// Únicas rutas que hoy tienen gemela /en (ver CLAUDE.md — SEO / GEO). Fuera
// de esta lista (legales, etc.) no hay mirror: el toggle solo cambia cookie,
// como antes.
function mirrorPath(pathname: string, target: Lang): string | null {
  const isEn = pathname === "/en" || pathname.startsWith("/en/");
  const huPath = isEn ? pathname.slice(3) || "/" : pathname;
  const hasMirror = huPath === "/" || huPath.startsWith("/shop/");
  if (!hasMirror) return null;
  if (target === "hu") return huPath;
  return huPath === "/" ? "/en" : `/en${huPath}`;
}

export function LanguageToggle({
  className = "",
  light = true,
}: {
  className?: string;
  /** true = fondo oscuro/morado detrás (anillo blanco). false = fondo claro (anillo morado). */
  light?: boolean;
}) {
  const { lang, setLang } = useI18n();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  function selectLang(target: Lang) {
    if (target === lang) return;
    setLang(target);
    const dest = mirrorPath(pathname, target);
    // Navega de verdad entre / (hu) y /en (SEO: URLs indexables separadas)
    // cuando la ruta actual tiene gemela; si no (legales, etc.) solo cambia
    // el idioma del contenido sin tocar la URL — igual que antes.
    if (dest && dest !== pathname) navigate({ to: dest });
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 ${className}`}
      role="group"
      aria-label="Language"
    >
      {LANGS.map((l) => {
        const active = l.code === lang;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => selectLang(l.code)}
            aria-pressed={active}
            aria-label={l.label}
            title={l.label}
            className={`block rounded-sm overflow-hidden ring-offset-1 transition-all ${
              active
                ? `scale-110 ring-2 ${light ? "ring-white" : "ring-fire"}`
                : "opacity-60 hover:opacity-100"
            }`}
          >
            <FlagIcon code={l.code} className="h-4 w-6 block" />
          </button>
        );
      })}
    </div>
  );
}
