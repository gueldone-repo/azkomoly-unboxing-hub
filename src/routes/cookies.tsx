import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Süti szabályzat — AZKOMOLY" },
      {
        name: "description",
        content: "AZKOMOLY süti (cookie) szabályzat: milyen sütiket használunk és miért.",
      },
    ],
  }),
  component: CookiesPage,
});

function CookiesPage() {
  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-12">
      <article className="mx-auto max-w-3xl flex flex-col gap-6">
        <Link to="/" className="text-fire underline font-sans text-sm">
          ← Vissza
        </Link>
        <h1 className="font-display text-fire text-4xl sm:text-5xl">SÜTI SZABÁLYZAT</h1>
        <p className="font-sans text-sm text-muted-foreground">Hatályos: 2026. január 1.</p>

        <Section title="1. Mi az a süti?">
          <p>
            A sütik (cookies) kis szöveges fájlok, amelyeket a böngésződ tárol az oldal
            látogatásakor. Segítenek a weboldal működésében és az élmény személyre szabásában.
          </p>
        </Section>

        <Section title="2. Milyen sütiket használunk?">
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Szükséges sütik</strong> — az oldal alapfunkcióihoz (pl. sütibeállítás
              tárolása). Hozzájárulás nélkül is működnek.
            </li>
            <li>
              <strong>Elemzési sütik</strong> — anonim statisztika a látogatottságról.
            </li>
            <li>
              <strong>Marketing sütik</strong> — személyre szabott hirdetésekhez, remarketinghez
              (pl. Meta Pixel, Google Ads, TikTok Pixel).
            </li>
          </ul>
        </Section>

        <Section title="3. Hozzájárulás kezelése">
          <p>
            Az első látogatáskor a süti banneren keresztül adhatsz hozzájárulást vagy
            utasíthatod el a nem szükséges sütiket. Döntésed bármikor módosítható a
            böngésződ beállításaiban a tárolt sütik törlésével.
          </p>
        </Section>

        <Section title="4. Harmadik felek">
          <p>
            Marketing és elemzési célból harmadik fél szolgáltatókat is használhatunk
            (Google, Meta, TikTok). Ezek saját süti szabályzattal rendelkeznek.
          </p>
        </Section>

        <Section title="5. Kapcsolat">
          <p>
            <strong>Oscar Investments Kft.</strong><br />
            4029 Debrecen, Csapó utca 26. Fsz. 1. ajtó<br />
            Adószám: 32331486-2-09 · Cégjegyzékszám: 09 09 036321<br />
            Email:{" "}
            <a href="mailto:azkomoly.hu@gmail.com" className="text-fire underline">
              azkomoly.hu@gmail.com
            </a>
          </p>
        </Section>
      </article>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="font-display text-fire text-2xl">{title}</h2>
      <div className="font-sans text-white/90 text-base leading-relaxed">{children}</div>
    </section>
  );
}
