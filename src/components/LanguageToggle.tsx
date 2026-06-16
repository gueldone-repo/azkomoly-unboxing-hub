import { useI18n, LANGS } from "@/lib/i18n";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useI18n();

  return (
    <div
      className={`inline-flex items-center border-2 border-cardboard/50 ${className}`}
      role="group"
      aria-label="Language"
    >
      {LANGS.map((l) => {
        const active = l.code === lang;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => setLang(l.code)}
            aria-pressed={active}
            className={`px-2.5 py-1 font-sans text-xs font-bold tracking-wider transition-colors ${
              active
                ? "bg-fire text-primary-foreground"
                : "text-foreground/60 hover:text-fire"
            }`}
          >
            {l.short}
          </button>
        );
      })}
    </div>
  );
}
