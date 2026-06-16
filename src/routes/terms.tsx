import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Felhasználási feltételek — AZKOMOLY" },
      {
        name: "description",
        content: "AZKOMOLY általános szerződési feltételek és felhasználási feltételek.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-12">
      <article className="mx-auto max-w-3xl flex flex-col gap-6">
        <Link to="/" className="text-fire underline font-sans text-sm">
          ← Vissza
        </Link>
        <h1 className="font-display text-fire text-4xl sm:text-5xl">
          FELHASZNÁLÁSI FELTÉTELEK
        </h1>
        <p className="font-sans text-sm text-muted-foreground">Hatályos: 2025. január 1.</p>

        <Section title="1. A szolgáltatás">
          <p>
            Az AZKOMOLY weboldalon „mystery box" termékekkel kapcsolatos várólistára
            iratkozhatsz fel. A feliratkozás nem jelent vásárlást és nem keletkeztet
            fizetési kötelezettséget.
          </p>
        </Section>

        <Section title="2. Feliratkozás">
          <p>
            A feliratkozáshoz valós nevet és email címet kell megadnod. A telefonszám
            megadása opcionális. A 16 év alattiak csak szülői hozzájárulással
            iratkozhatnak fel.
          </p>
        </Section>

        <Section title="3. Kommunikáció és marketing">
          <p>
            A feliratkozással hozzájárulsz, hogy a megadott elérhetőségeken
            <strong> marketing tartalmú üzeneteket</strong> küldjünk neked (termékindítás,
            ajánlatok, hírlevelek). A hozzájárulás bármikor visszavonható.
          </p>
        </Section>

        <Section title="4. Szellemi tulajdon">
          <p>
            A weboldalon megjelenő minden tartalom (logó, szövegek, képek, grafikák) az
            AZKOMOLY szellemi tulajdona. Engedély nélküli felhasználása tilos.
          </p>
        </Section>

        <Section title="5. Felelősség korlátozása">
          <p>
            A szolgáltatást „ahogy van" alapon nyújtjuk. Nem vállalunk felelősséget a
            weboldal elérhetetlenségéből, hibájából vagy a tartalom esetleges
            pontatlanságából eredő közvetett károkért.
          </p>
        </Section>

        <Section title="6. Módosítások">
          <p>
            Fenntartjuk a jogot a feltételek egyoldalú módosítására. A módosításokról a
            weboldalon vagy emailben tájékoztatunk.
          </p>
        </Section>

        <Section title="7. Irányadó jog">
          <p>
            Jelen feltételekre Magyarország joga irányadó. Vitás kérdésekben a magyar
            bíróságok kizárólagosan illetékesek.
          </p>
        </Section>

        <Section title="8. A szolgáltató adatai">
          <p>
            <strong>Oscar Investments Kft.</strong><br />
            Székhely: 4029 Debrecen, Csapó utca 26. Fsz. 1. ajtó<br />
            Adószám: 32331486-2-09<br />
            Cégjegyzékszám: 09 09 036321<br />
            Kapcsolat:{" "}
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
