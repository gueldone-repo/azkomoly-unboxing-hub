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
          ÁLTALÁNOS SZERZŐDÉSI FELTÉTELEK
        </h1>
        <p className="font-sans text-sm text-muted-foreground">Hatályos: 2026. január 1.</p>

        <Section title="1. A szolgáltató adatai">
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

        <Section title="2. A szolgáltatás leírása">
          <p>
            Az AZKOMOLY egy online mystery box webáruház. A termékek visszaküldött, nem átvett és
            túlkészletezett árucikkekből összeállított meglepetésdobozok, amelyek tartalma előre
            nem ismert — ez a vásárlási élmény lényege. A dobozok minőségi, új termékeket
            tartalmaznak ruhák, kiegészítők, kütyük és különlegességek formájában.
          </p>
        </Section>

        <Section title="3. Megrendelés és szerződéskötés">
          <p>
            A vásárlás a weboldalon keresztül, a Shopify fizetési rendszeren át történik.
            A megrendelés leadásával a vásárló ajánlatot tesz a termék megvásárlására.
            A szerződés a fizetés sikeres teljesítésével jön létre. A megrendelés visszaigazolása
            emailben történik.
          </p>
        </Section>

        <Section title="4. Árak és fizetés">
          <p>
            Az árak forintban (HUF) értendők és tartalmazzák az ÁFÁ-t (27%). A fizetés
            bankkártyával, Apple Pay-jel vagy Google Pay-jel lehetséges a Shopify biztonságos
            fizetési felületén keresztül. A fizetési adatokat kizárólag a Shopify PCI-DSS
            tanúsítvánnyal rendelkező rendszere kezeli — mi kártyaadatokat nem tárolunk.
          </p>
        </Section>

        <Section title="5. Szállítás">
          <p>
            A csomagok kézbesítése futárszolgálaton keresztül történik. A szállítási idő
            általában 2–3 munkanap, de a kézbesítési vállalattól függően legfeljebb egy hétig
            tarthat. A szállítás módja (házhozszállítás vagy csomagpont) a rendelés során
            választható — csomagpont esetén mindig a megadott címhez legközelebbi pontot
            jelöljük ki.
          </p>
        </Section>

        <Section title="6. A mystery box természete és elállási jog">
          <p>
            A mystery box termékek egyedi, meglepetésjellegű összeállítások. Mivel a doboz
            tartalma a vásárlási élmény szerves részét képezi, és a termékek egyedi válogatás
            alapján kerülnek összeállításra, az EU fogyasztóvédelmi irányelv (2011/83/EU)
            16. cikk c) pontja alapján — amely a fogyasztó egyéni kérésére készített vagy
            személyre szabott árukra vonatkozik — az elállási jog a doboz tartalmára nem
            alkalmazható.
          </p>
          <p className="mt-2">
            Amennyiben a termék sérülten, hibásan vagy a megrendeléstől eltérően érkezik,
            kérjük, vedd fel a kapcsolatot ügyfélszolgálatunkkal az{" "}
            <a href="mailto:azkomoly.hu@gmail.com" className="text-fire underline">
              azkomoly.hu@gmail.com
            </a>{" "}
            címen, és a problémát haladéktalanul rendezzük.
          </p>
        </Section>

        <Section title="7. Jótállás és szavatosság">
          <p>
            A termékek új állapotban kerülnek értékesítésre. A Ptk. szerinti kellékszavatosság
            érvényes. Sérült vagy hibás termék esetén kérjük, jelezd ügyfélszolgálatunkon —
            cseréről vagy egyéb megoldásról gondoskodunk.
          </p>
        </Section>

        <Section title="8. Feliratkozás és marketing">
          <p>
            A várólistára vagy a doboznyitó játékban való részvétellel a megadott
            elérhetőségeken <strong>marketing tartalmú üzeneteket</strong> küldhetünk
            (termékindítás, ajánlatok, hírlevelek). A hozzájárulás bármikor visszavonható.
          </p>
        </Section>

        <Section title="9. Szellemi tulajdon">
          <p>
            A weboldalon megjelenő minden tartalom (logó, szövegek, képek, grafikák) az
            AZKOMOLY szellemi tulajdona. Engedély nélküli felhasználása tilos.
          </p>
        </Section>

        <Section title="10. Felelősség korlátozása">
          <p>
            Nem vállalunk felelősséget a weboldal átmeneti elérhetetlenségéből, technikai
            hibájából eredő közvetett károkért. A mystery box tartalmának meglepetésjellegéből
            adódó esetleges elváráseltéréssel kapcsolatban felelősséget nem vállalunk.
          </p>
        </Section>

        <Section title="11. Módosítások">
          <p>
            Fenntartjuk a jogot a feltételek módosítására. A módosításokról a weboldalon
            vagy emailben tájékoztatunk. A módosítás előtt leadott rendelésekre a korábbi
            feltételek vonatkoznak.
          </p>
        </Section>

        <Section title="12. Panaszkezelés és vitarendezés">
          <p>
            Panasz esetén kérjük, írj az{" "}
            <a href="mailto:azkomoly.hu@gmail.com" className="text-fire underline">
              azkomoly.hu@gmail.com
            </a>{" "}
            címre — 30 napon belül válaszolunk. Fogyasztói jogvita esetén a Debreceni
            Békéltető Testülethez (4025 Debrecen, Vörösmarty u. 13–15.) fordulhatsz, illetve
            az EU online vitarendezési platformjához:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fire underline"
            >
              ec.europa.eu/consumers/odr
            </a>
            .
          </p>
        </Section>

        <Section title="13. Irányadó jog">
          <p>
            Jelen feltételekre Magyarország joga irányadó. Vitás kérdésekben a magyar
            bíróságok illetékesek.
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
