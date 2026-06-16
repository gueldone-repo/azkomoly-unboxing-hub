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

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => readLangCookie());

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    if (typeof document !== "undefined") {
      document.cookie = `${COOKIE}=${next};path=/;max-age=${ONE_YEAR};SameSite=Lax`;
      document.documentElement.lang = next;
    }
  }, []);

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
