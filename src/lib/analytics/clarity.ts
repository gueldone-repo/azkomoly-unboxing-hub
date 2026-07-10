const CLARITY_PROJECT_ID = "xkb7njvdoh";

let loaded = false;

export function initClarity() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;

  type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[] };
  const w = window as unknown as { clarity?: ClarityFn };

  w.clarity = w.clarity || function (...args: unknown[]) {
    (w.clarity!.q = w.clarity!.q || []).push(args);
  };

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${CLARITY_PROJECT_ID}`;
  const first = document.getElementsByTagName("script")[0];
  first.parentNode?.insertBefore(script, first);
}
