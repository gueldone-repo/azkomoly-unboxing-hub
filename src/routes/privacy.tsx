import { createFileRoute, Link } from "@tanstack/react-router";
import { seoLinksHuOnly } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Adatvédelmi tájékoztató — AZKOMOLY" },
      {
        name: "description",
        content:
          "AZKOMOLY adatvédelmi tájékoztató. Hogyan kezeljük adataidat a GDPR szerint.",
      },
    ],
    // Solo húngaro: el texto legal está hardcodeado en hu, sin versión /en.
    links: seoLinksHuOnly("/privacy"),
  }),
  component: PrivacyPage,
});

export function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-12">
      <article className="mx-auto max-w-3xl flex flex-col gap-6">
        <Link to="/" className="text-fire underline font-sans text-sm">
          ← Vissza
        </Link>
        <h1 className="font-display text-fire text-4xl sm:text-5xl">ADATVÉDELMI TÁJÉKOZTATÓ</h1>
        <p className="font-sans text-sm text-muted-foreground">
          Hatályba lépés dátuma: 2026. július 10.
        </p>

        <Section title="1. Bevezetés">
          <p>
            A(z) Oscar Investments Kft. (a továbbiakban: Adatkezelő) elkötelezett a
            felhasználók és vásárlók magánéletének védelme és a személyes adatok
            jogszabályoknak megfelelő kezelése mellett. Jelen Adatkezelési Tájékoztató célja,
            hogy részletesen bemutassa, miként gyűjtjük, tároljuk és használjuk fel az Ön
            adatait az azkomoly.hu webáruház (a továbbiakban: Webshop) használata, valamint a
            mystery box termékek vásárlása során.
          </p>
          <p className="mt-2">
            Az Adatkezelő a személyes adatokat a mindenkori hatályos jogszabályoknak, így
            különösen az Európai Parlament és a Tanács (EU) 2016/679 rendeletének (GDPR),
            valamint az információs önrendelkezési jogról és az információszabadságról szóló
            2011. évi CXII. törvénynek (Infotörvény) megfelelően kezeli.
          </p>
        </Section>

        <Section title="2. Az Adatkezelő adatai">
          <p>
            Név / Cégnév: Oscar Investments Kft.<br />
            Székhely: 4029 Debrecen Csapó utca 26. Fsz. 1. ajtó<br />
            Cégjegyzékszám / Nyilvántartási szám: 0909035321<br />
            Adószám: 32331486-2-09<br />
            E-mail cím:{" "}
            <a href="mailto:azkomoly.hu@gmail.com" className="text-fire underline">
              azkomoly.hu@gmail.com
            </a>
            <br />
            Weboldal:{" "}
            <a
              href="https://azkomoly.hu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fire underline"
            >
              https://azkomoly.hu
            </a>
          </p>
        </Section>

        <Section title="3. A kezelt adatok köre, célja, jogalapja és időtartama">
          <p className="font-semibold">3.1. Webshopos vásárlás és megrendelés teljesítése</p>
          <p>
            A Webshopban történő mystery box vásárlás során az adatok megadása kötelező a
            szerződés teljesítéséhez.
          </p>
          <p className="mt-2">
            <strong>Kezelt adatok köre:</strong> Vezetéknév, keresztnév, számlázási cím,
            szállítási cím (ha eltér), e-mail cím, telefonszám, a vásárolt termék adatai, a
            fizetés módja.
          </p>
          <p className="mt-2">
            <strong>Az adatkezelés célja:</strong> A megrendelés feldolgozása, a mystery box
            összeállítása, szállítása, a fizetés lebonyolítása, a vásárlói kapcsolattartás,
            valamint a számviteli kötelezettségek teljesítése.
          </p>
          <p className="mt-2">
            <strong>Az adatkezelés jogalapja:</strong> Szerződés teljesítése [GDPR 6. cikk (1)
            bek. b) pont], illetve jogi kötelezettség teljesítése (számlázás esetén) [GDPR 6.
            cikk (1) bek. c) pont].
          </p>
          <p className="mt-2">
            <strong>Az adatkezelés időtartama:</strong> A számviteli bizonylatokat a
            Számvitelről szóló 2000. évi C. törvény 169. § (2) bekezdése alapján 8 évig köteles
            megőrizni az Adatkezelő.
          </p>

          <p className="font-semibold mt-4">
            3.2. Felhasználói fiók regisztráció (Opcionális)
          </p>
          <p>
            <strong>Kezelt adatok köre:</strong> Név, e-mail cím, jelszó, korábbi vásárlások
            előzményei.
          </p>
          <p className="mt-2">
            <strong>Az adatkezelés célja:</strong> A vásárlás kényelmesebbé tétele, a
            rendelések nyomon követése.
          </p>
          <p className="mt-2">
            <strong>Az adatkezelés jogalapja:</strong> Az Ön önkéntes hozzájárulása [GDPR 6.
            cikk (1) bek. a) pont].
          </p>
          <p className="mt-2">
            <strong>Az adatkezelés időtartama:</strong> A fiók törléséig, vagy a hozzájárulás
            visszavonásáig.
          </p>

          <p className="font-semibold mt-4">
            3.3. Hírlevél és marketing célú megkeresések
          </p>
          <p>
            <strong>Kezelt adatok köre:</strong> Név, e-mail cím.
          </p>
          <p className="mt-2">
            <strong>Az adatkezelés célja:</strong> Akciókról, új mystery box dropokról,
            exkluzív ajánlatokról és promóciókról szóló értesítések küldése.
          </p>
          <p className="mt-2">
            <strong>Az adatkezelés jogalapja:</strong> Az Ön kifejezett és önkéntes
            hozzájárulása [GDPR 6. cikk (1) bek. a) pont].
          </p>
          <p className="mt-2">
            <strong>Az adatkezelés időtartama:</strong> A leiratkozásig (a hozzájárulás
            visszavonásáig). Minden hírlevél alján található leiratkozási link.
          </p>

          <p className="font-semibold mt-4">
            3.4. Élő közvetítések (Live Stream) és Nyereményjátékok
          </p>
          <p>
            Amennyiben a Webshophoz kapcsolódóan élő adásban (pl. TikTok, Twitch, YouTube)
            rendelések kerülnek kibontásra, vagy nyertesek nevei kerülnek kihirdetésre:
          </p>
          <p className="mt-2">
            <strong>Kezelt adatok köre:</strong> Keresztnév, Monogram, Rendelésszám vagy
            Felhasználónév (egyedileg egyeztetett módon). Full nevet és pontos címet élő
            adásban nem kezelünk/jelenítünk meg.
          </p>
          <p className="mt-2">
            <strong>Az adatkezelés célja:</strong> Közösségi élmény biztosítása, interaktív
            mystery box bontás, nyereményjátékok lebonyolítása.
          </p>
          <p className="mt-2">
            <strong>Az adatkezelés jogalapja:</strong> Az Ön kifejezett hozzájárulása (a
            vásárlási folyamat során vagy külön check-box formájában).
          </p>
          <p className="mt-2">
            <strong>Az adatkezelés időtartama:</strong> A nyereményjáték vagy a live stream
            kampány lezárultáig.
          </p>
        </Section>

        <Section title="4. Adatfeldolgozók és Adattovábbítás">
          <p>
            Az adatok feldolgozását és tárolását az Adatkezelő mellett az alábbi partnerek
            (adatfeldolgozók) végzik a feladataik ellátásához szükséges mértekben.
          </p>
          <ul className="list-disc pl-5 mt-1">
            <li>Webshop platform: Shopify</li>
          </ul>
        </Section>

        <Section title="5. Cookie-k (Sütik) kezelése">
          <p>
            Az azkomoly.hu weboldal sütiket (cookie-kat) használ a honlap működtetése, a
            felhasználói élmény fokozása, valamint statisztikai és marketing (pl. Facebook
            Pixel, Google Analytics) célokból. A weboldalra történő első belépéskor a
            cookie-banner segítségével Ön beállíthatja, hogy mely sütik használatához járul
            hozzá. A sütik beállításait a böngészőjében bármikor módosíthatja vagy törölheti.
          </p>
        </Section>

        <Section title="6. Az Ön jogai az adatkezeléssel kapcsolatban">
          <p>Önt az adatkezeléssel kapcsolatban az alábbi jogok illetik meg:</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>
              <strong>Hozzáférés joga:</strong> Jogosult tájékoztatást kérni arról, hogy
              milyen adatokat kezelünk Önre vonatkozóan.
            </li>
            <li>
              <strong>Helyesbítés joga:</strong> Kérheti a pontatlan vagy elavult adatai
              javítását.
            </li>
            <li>
              <strong>Törléshez való jog („az elfeledtetéshez való jog”):</strong> Kérheti
              adatai törlését, kivéve, ha az adatkezelést jogszabály (pl. a számviteli
              törvény) kötelezővé teszi.
            </li>
            <li>
              <strong>Az adatkezelés korlátozásához való jog:</strong> Bizonyos esetekben
              kérheti az adatok zárolását.
            </li>
            <li>
              <strong>Adathordozhatósághoz való jog:</strong> Kérheti adatai kiadását tagolt,
              széles körben használt formátumban.
            </li>
            <li>
              <strong>Tiltakozáshoz való jog:</strong> Tiltakozhat személyes adatai jogos
              érdek alapján történő kezelése ellen.
            </li>
          </ul>
          <p className="mt-2">
            Ezen igényeit az{" "}
            <a href="mailto:azkomoly.hu@gmail.com" className="text-fire underline">
              azkomoly.hu@gmail.com
            </a>{" "}
            e-mail címre küldött nyilatkozattal bármikor jelezheti felénk.
          </p>
        </Section>

        <Section title="7. Jogorvoslati lehetőségek">
          <p>
            Amennyiben úgy érzi, hogy az Adatkezelő megsértette a személyes adatok védelméhez
            fűződő jogait, kérjük, forduljon hozzánk közvetlenül az{" "}
            <a href="mailto:azkomoly.hu@gmail.com" className="text-fire underline">
              azkomoly.hu@gmail.com
            </a>{" "}
            címen, hogy a problémát mielőbb orvosolhassuk.
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
      <div className="font-sans text-foreground/80 text-base leading-relaxed">{children}</div>
    </section>
  );
}
