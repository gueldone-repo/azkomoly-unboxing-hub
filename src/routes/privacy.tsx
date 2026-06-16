import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Adatvédelmi tájékoztató — AZKOMOLY" },
      {
        name: "description",
        content:
          "AZKOMOLY adatvédelmi tájékoztató. Hogyan kezeljük adataidat a GDPR szerint, marketing célokra is.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-12">
      <article className="mx-auto max-w-3xl flex flex-col gap-6">
        <Link to="/" className="text-fire underline font-sans text-sm">
          ← Vissza
        </Link>
        <h1 className="font-display text-fire text-4xl sm:text-5xl">ADATVÉDELMI TÁJÉKOZTATÓ</h1>
        <p className="font-sans text-sm text-muted-foreground">
          Hatályos: 2025. január 1. · GDPR (EU) 2016/679 szerint
        </p>

        <Section title="1. Adatkezelő">
          <p>
            <strong>Oscar Investments Kft.</strong><br />
            Székhely: 4029 Debrecen, Csapó utca 26. Fsz. 1. ajtó<br />
            Adószám: 32331486-2-09<br />
            Cégjegyzékszám: 09 09 036321<br />
            (a továbbiakban: „mi", „AZKOMOLY"). Kapcsolat:{" "}
            <a href="mailto:azkomoly.hu@gmail.com" className="text-fire underline">
              azkomoly.hu@gmail.com
            </a>
          </p>
        </Section>

        <Section title="2. Milyen adatokat gyűjtünk">
          <ul className="list-disc pl-6 space-y-1">
            <li>Név</li>
            <li>Email cím</li>
            <li>Telefonszám és országhívó (opcionális)</li>
            <li>Időbélyeg és forrás (pl. landing oldal)</li>
            <li>Sütikből származó technikai adatok (lásd Süti szabályzat)</li>
          </ul>
        </Section>

        <Section title="3. Az adatkezelés célja és jogalapja">
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Várólista kezelése</strong> — hozzájárulás alapján (GDPR 6. cikk (1) a)).
            </li>
            <li>
              <strong>Marketing kommunikáció</strong> — termékindítás, ajánlatok, hírlevelek
              küldése. Jogalap: <em>kifejezett hozzájárulás</em>. Bármikor visszavonható az
              email-ben található „leiratkozás" linkre kattintva, vagy az{" "}
              <a href="mailto:azkomoly.hu@gmail.com" className="text-fire underline">
                azkomoly.hu@gmail.com
              </a>{" "}
              címre küldött kéréssel.
            </li>
            <li>
              <strong>Elemzés és termékfejlesztés</strong> — jogos érdek (GDPR 6. cikk (1) f)).
            </li>
          </ul>
        </Section>

        <Section title="4. Megőrzési idő">
          <p>
            Adataidat a hozzájárulásod visszavonásáig, illetve legfeljebb a feliratkozástól számított
            5 évig őrizzük. Visszavonás után az adatok 30 napon belül törlésre kerülnek.
          </p>
        </Section>

        <Section title="5. Adatfeldolgozók">
          <ul className="list-disc pl-6 space-y-1">
            <li>Supabase Inc. — adatbázis és autentikáció</li>
            <li>Google LLC — Google Sheets (lista kezelése)</li>
            <li>Tárhely- és infrastruktúra-szolgáltatók (EU/USA, SCC alapján)</li>
          </ul>
        </Section>

        <Section title="6. Jogaid (GDPR)">
          <ul className="list-disc pl-6 space-y-1">
            <li>Hozzáférés, helyesbítés, törlés, korlátozás joga</li>
            <li>Adathordozhatóság joga</li>
            <li>Tiltakozás a marketing célú adatkezelés ellen</li>
            <li>Hozzájárulás bármikori visszavonása</li>
            <li>
              Panasz benyújtása a NAIH-hoz (
              <a
                href="https://naih.hu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-fire underline"
              >
                naih.hu
              </a>
              )
            </li>
          </ul>
        </Section>

        <Section title="7. Biztonság">
          <p>
            Megfelelő technikai és szervezési intézkedéseket alkalmazunk (titkosított kapcsolat,
            jogosultságkezelés, RLS) adataid védelmére.
          </p>
        </Section>

        <Section title="8. Kapcsolat">
          <p>
            Bármely jogod gyakorlásához írj az{" "}
            <a href="mailto:azkomoly.hu@gmail.com" className="text-fire underline">
              azkomoly.hu@gmail.com
            </a>{" "}
            címre.
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
