// Estado: provider/hooks de idioma (cookie azkomoly_lang) — envuelve el
// diccionario de dictionary.ts y decide qué idioma ve cada request.
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";
import { useRouterState } from "@tanstack/react-router";
import { DICTIONARIES, type Dict, type Lang } from "./dictionary";

export type { Lang, Dict } from "./dictionary";
export { LANGS } from "./dictionary";

const COOKIE = "azkomoly_lang";
const ONE_YEAR = 60 * 60 * 24 * 365;

function isLang(v: unknown): v is Lang {
  return v === "hu" || v === "en";
}

/**
 * Reads the language cookie on both server (request headers) and client
 * (document.cookie). Because both sides resolve to the same value, the first
 * client render matches the SSR output — no hydration mismatch, no flash.
 */
export const readLangCookie = createIsomorphicFn()
  .server((): Lang => {
    const v = getCookie(COOKIE);
    return isLang(v) ? v : "hu";
  })
  .client((): Lang => {
    const match = document.cookie.match(/(?:^|;\s*)azkomoly_lang=(hu|en)/);
    return match && isLang(match[1]) ? match[1] : "hu";
  });

type I18nValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dict;
};

const I18nCtx = createContext<I18nValue | null>(null);

/**
 * `forceLang` fija el idioma ignorando la cookie. Lo usa el layout `/en` para
 * que esas URLs sirvan inglés siempre — un crawler llega sin cookie y tiene que
 * ver inglés en /en y húngaro en /. Sin `forceLang` el comportamiento es el de
 * siempre (cookie), así que `/` no cambia en nada.
 */
export function I18nProvider({
  children,
  forceLang,
}: {
  children: ReactNode;
  forceLang?: Lang;
}) {
  const [cookieLang, setLangState] = useState<Lang>(() => readLangCookie());
  // Las URLs `/en/*` mandan sobre la cookie incluso en este provider raíz:
  // los overlays globales (SignupDialog, CartSheet, BottomNav) viven en
  // `__root.tsx`, FUERA del provider de `/en`, así que sin esto salían en
  // húngaro para un usuario que está navegando la versión inglesa.
  const routePathname = useRouterState({ select: (s) => s.location.pathname });
  const pathLang: Lang | undefined =
    routePathname === "/en" || routePathname.startsWith("/en/") ? "en" : undefined;
  const lang = forceLang ?? pathLang ?? cookieLang;

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    if (typeof document !== "undefined") {
      document.cookie = `${COOKIE}=${next};path=/;max-age=${ONE_YEAR};SameSite=Lax`;
      document.documentElement.lang = next;
    }
  }, []);

  // Este provider (el de la raíz, sin forceLang) vive montado durante toda
  // la sesión — al navegar entre / y /en vía LanguageToggle, el layout /en
  // usa su PROPIO provider (forceLang="en"), así que este nunca se entera
  // del cambio de cookie por sí solo. Releerla en cada cambio de ruta evita
  // que "/" se quede mostrando el idioma viejo tras volver de /en.
  const pathname = routePathname;
  useEffect(() => {
    if (forceLang) return;
    setLangState(readLangCookie());
  }, [pathname, forceLang]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <I18nCtx.Provider value={{ lang, setLang, t: DICTIONARIES[lang] }}>
      {children}
    </I18nCtx.Provider>
  );
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

/** Shorthand: returns the dictionary for the active language. */
export function useT(): Dict {
  return useI18n().t;
}
