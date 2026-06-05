import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

const STORAGE_KEY = "azkomoly_cookie_consent_v1";

export type CookieConsent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  decidedAt: string;
};

export function getStoredConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CookieConsent) : null;
  } catch {
    return null;
  }
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);

  useEffect(() => {
    if (!getStoredConsent()) setVisible(true);
  }, []);

  function save(consent: Omit<CookieConsent, "necessary" | "decidedAt">) {
    const full: CookieConsent = {
      necessary: true,
      analytics: consent.analytics,
      marketing: consent.marketing,
      decidedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(full));
    } catch {}
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4">
      <div className="mx-auto max-w-3xl bg-dark-bg border-2 border-fire/70 graffiti-border p-4 sm:p-5 shadow-2xl">
        {!showPrefs ? (
          <div className="flex flex-col gap-3">
            <p className="font-display text-fire text-lg sm:text-xl">SÜTIK / COOKIES</p>
            <p className="font-sans text-sm text-white">
              Sütiket használunk a weboldal működéséhez, valamint{" "}
              <span className="text-fire">marketing és elemzési célokra</span>. Az „Elfogadom"
              gombra kattintva hozzájárulsz az adataid marketing célú felhasználásához. Részletek:{" "}
              <Link to="/cookies" className="underline hover:text-fire">
                Süti szabályzat
              </Link>{" "}
              ·{" "}
              <Link to="/privacy" className="underline hover:text-fire">
                Adatvédelem
              </Link>
              .
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => save({ analytics: true, marketing: true })}
                className="bg-fire text-primary-foreground font-display px-4 py-2 hover:translate-y-[-1px] transition-transform"
              >
                Elfogadom mindet
              </button>
              <button
                onClick={() => save({ analytics: false, marketing: false })}
                className="border-2 border-cardboard/60 text-white font-sans px-4 py-2 hover:border-fire hover:text-fire transition-colors"
              >
                Csak szükséges
              </button>
              <button
                onClick={() => setShowPrefs(true)}
                className="text-cardboard underline font-sans px-2 py-2 hover:text-fire"
              >
                Beállítások
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="font-display text-fire text-lg sm:text-xl">SÜTI BEÁLLÍTÁSOK</p>
            <label className="flex items-start gap-3 text-sm text-white font-sans">
              <input type="checkbox" checked disabled className="mt-1" />
              <span>
                <strong>Szükséges sütik</strong> — az oldal működéséhez nélkülözhetetlen. Mindig
                aktív.
              </span>
            </label>
            <label className="flex items-start gap-3 text-sm text-white font-sans">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="mt-1"
              />
              <span>
                <strong>Elemzési sütik</strong> — segítenek megérteni, hogyan használod az oldalt.
              </span>
            </label>
            <label className="flex items-start gap-3 text-sm text-white font-sans">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="mt-1"
              />
              <span>
                <strong>Marketing sütik</strong> — személyre szabott ajánlatokhoz és hirdetésekhez.
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => save({ analytics, marketing })}
                className="bg-fire text-primary-foreground font-display px-4 py-2"
              >
                Mentés
              </button>
              <button
                onClick={() => setShowPrefs(false)}
                className="border-2 border-cardboard/60 text-white font-sans px-4 py-2 hover:border-fire hover:text-fire"
              >
                Vissza
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
