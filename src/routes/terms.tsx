import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/nav/SiteNav";
import { seoLinksHuOnly } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Általános Szerződési Feltételek (ÁSZF) — AZKOMOLY" },
      {
        name: "description",
        content: "AZKOMOLY általános szerződési feltételek (ÁSZF).",
      },
    ],
    // Solo húngaro: el texto legal está hardcodeado en hu, sin versión /en.
    links: seoLinksHuOnly("/terms"),
  }),
  component: TermsPage,
});

export function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground px-6 pt-28 pb-12">
      <SiteNav />
      <article className="mx-auto max-w-3xl flex flex-col gap-6">
        <h1 className="font-display text-fire text-4xl sm:text-5xl">
          ÁLTALÁNOS SZERZŐDÉSI FELTÉTELEK (ÁSZF)
        </h1>
        <p className="font-sans text-sm text-muted-foreground">Hatályos: 2026. július 10.</p>

        <Section title="1. Szolgáltató adatai">
          <p>
            <strong>Oscar Investments Kft.</strong><br />
            Székhely: 4029 Debrecen, Csapó utca 26 Fsz. 1. ajtó<br />
            Adószám: 32331486-2-09<br />
            <a href="mailto:azkomoly.hu@gmail.com" className="text-fire underline">
              azkomoly.hu@gmail.com
            </a>
          </p>
        </Section>

        <Section title="2. A szolgáltatás jellege">
          <p>A Webshop „mystery box” és „return pack” jellegű termékeket értékesít.</p>
          <p className="mt-2">A termékek:</p>
          <ul className="list-disc pl-5 mt-1">
            <li>visszaküldött (return), outlet vagy új termékek lehetnek</li>
            <li>ellenőrzött, de vegyes összetételű csomagban kerülnek értékesítésre</li>
            <li>a csomag tartalma előre nem ismert</li>
          </ul>
          <p className="mt-2">A vásárló tudomásul veszi, hogy a termék:</p>
          <ul className="list-disc pl-5 mt-1">
            <li>véletlenszerű összetételű</li>
            <li>egyedi csomagként kerül összeállításra</li>
          </ul>
        </Section>

        <Section title="3. Szerződés létrejötte">
          <p>A megrendelés leadásával és visszaigazolásával a szerződés létrejön.</p>
          <p className="mt-2">A vásárló a rendelés véglegesítése előtt kijelenti, hogy:</p>
          <ul className="list-disc pl-5 mt-1">
            <li>az ÁSZF-et megismerte</li>
            <li>azt elfogadja</li>
          </ul>
        </Section>

        <Section title="4. Árak és fizetés">
          <p className="font-semibold">4.1 Árak</p>
          <p>
            Minden ár forintban (HUF) értendő. Az árak tartalmazzák az ÁFA-t. Az árak a
            weboldalon feltüntetett időpontban érvényesek. Az Eladó fenntartja az
            árváltoztatás jogát, azonban a már leadott rendeléseket ez nem érinti.
          </p>
          <p className="font-semibold mt-3">4.2 Fizetési módok</p>
          <ul className="list-disc pl-5 mt-1">
            <li>Bankkártyás fizetés</li>
            <li>Apple Pay / Google Pay</li>
          </ul>
          <p className="font-semibold mt-3">4.3 Fizetés időpontja</p>
          <p>Online fizetés esetén a rendelés leadásakor történik.</p>
          <p className="font-semibold mt-3">4.4 Számlázás</p>
          <p>
            Az Eladó elektronikus számlát állít ki. A számla e-mailben kerül megküldésre
            vagy a rendeléshez kapcsolódóan elérhető.
          </p>
          <p className="font-semibold mt-3">4.5 Hibás árak</p>
          <p>
            Nyilvánvalóan hibás ár (pl. technikai hiba miatt 0 Ft vagy a piaci értéktől
            jelentősen eltérő ár) esetén az Eladó nem köteles a szerződést teljesíteni,
            hanem felajánlhatja a helyes áron történő teljesítést vagy elállhat a
            szerződéstől.
          </p>
        </Section>

        <Section title="5. Szállítás">
          <p className="font-semibold">5.1 Szállítási módok</p>
          <ul className="list-disc pl-5 mt-1">
            <li>Csomagpont</li>
            <li>Házhozszállítás</li>
          </ul>
          <p className="font-semibold mt-3">5.2 Szállítási díjak</p>
          <p>A szállítási díj a rendelés véglegesítése előtt a pénztárban kerül feltüntetésre.</p>
          <p className="font-semibold mt-3">5.3 Teljesítési határidő</p>
          <p>
            A megrendelések feldolgozása munkanapokon történik. A várható szállítási idő a
            rendelés visszaigazolásától számított 1–5 munkanap, ettől eltérő esetben az
            Eladó tájékoztatja a Vásárlót.
          </p>
          <p className="mt-2">
            A mystery boxok összeállítása a megrendelés feldolgozását követően történik,
            ezért egyes időszakokban a szállítási határidő hosszabb lehet. Erről az Eladó
            szükség esetén előzetesen tájékoztatja a Vásárlót.
          </p>
          <p className="font-semibold mt-3">5.4 Csomag átvétele</p>
          <p>
            A Vásárló köteles a csomagot átvételkor megvizsgálni. Látható sérülés esetén
            jegyzőkönyv felvételét kell kérni a futárszolgálattól.
          </p>
          <p className="font-semibold mt-3">5.5 Sikertelen kézbesítés</p>
          <p>
            Amennyiben a kézbesítés a Vásárlónak felróható okból meghiúsul, az ismételt
            kiszállítás költsége a Vásárlót terheli.
          </p>
          <p className="font-semibold mt-3">5.6 Tulajdonjog és kárveszély</p>
          <p>
            A termék tulajdonjoga a vételár teljes kiegyenlítésével, a kárveszély pedig a
            termék átvételével száll át a Vásárlóra.
          </p>
        </Section>

        <Section title="6. Elállási jog (14 nap)">
          <p>
            A fogyasztót a 45/2014. (II.26.) Korm. rendelet alapján a termék átvételétől
            számított 14 napon belül indokolás nélküli elállási jog illeti meg.
          </p>
          <p className="font-semibold mt-3">6.1 Visszaküldés költsége</p>
          <p>Elállás esetén a termék visszaküldésének közvetlen költsége a Fogyasztót terheli.</p>
          <p className="font-semibold mt-3">6.2 A termék állapota</p>
          <p>
            A Fogyasztó a terméket köteles rendeltetésszerűen használni és eredeti
            állapotában visszaküldeni.
          </p>
          <p className="mt-2">Amennyiben a termék:</p>
          <ul className="list-disc pl-5 mt-1">
            <li>hiányos</li>
            <li>sérült</li>
            <li>használt mértékben meghaladja a kipróbálás szintjét</li>
          </ul>
          <p className="mt-2">
            a Vállalkozás jogosult a termék értékcsökkenését a visszatérítendő összegből
            levonni.
          </p>
          <p className="font-semibold mt-3">6.3 Mystery box jelleg</p>
          <p>A vásárló tudomásul veszi, hogy a termék:</p>
          <ul className="list-disc pl-5 mt-1">
            <li>vegyes, véletlenszerű összetételű</li>
            <li>egyedi csomagként kerül kiszállításra</li>
          </ul>
          <p className="mt-2">
            Az elállási jog a teljes csomagra vonatkozik, a csomag megbontása az elállási
            jog gyakorlását nem zárja ki.
          </p>
        </Section>

        <Section title="7. Panaszkezelés">
          <p className="font-semibold">7.1 Panasz benyújtása</p>
          <p>
            A vásárló panaszt tehet e-mailben (
            <a href="mailto:azkomoly.hu@gmail.com" className="text-fire underline">
              azkomoly.hu@gmail.com
            </a>
            ).
          </p>
          <p className="font-semibold mt-3">7.2 A panasz kivizsgálása</p>
          <p>
            Az Eladó a panaszt a lehető legrövidebb időn belül kivizsgálja. Írásban érkezett
            panaszra legkésőbb 30 naptári napon belül írásban válaszol.
          </p>
          <p className="font-semibold mt-3">7.3 Jegyzőkönyv</p>
          <p>
            Ha telefonon vagy személyesen történik panaszkezelés, szükség esetén jegyzőkönyv
            készül, amelyet a jogszabályban meghatározott ideig megőrzünk.
          </p>
          <p className="font-semibold mt-3">7.4 Jogorvoslati lehetőségek</p>
          <p>Ha a vásárló nem elégedett a panasz kezelésével, jogosult:</p>
          <ul className="list-disc pl-5 mt-1">
            <li>a területileg illetékes fogyasztóvédelmi hatósághoz fordulni,</li>
            <li>békéltető testületi eljárást kezdeményezni,</li>
            <li>bírósághoz fordulni.</li>
          </ul>
        </Section>

        <Section title="8. Felelősségkorlátozás">
          <p>A termékek jellegéből adódóan a Webshop nem vállal felelősséget:</p>
          <ul className="list-disc pl-5 mt-1">
            <li>a termékek egyéni ízlés szerinti megfeleléséért</li>
            <li>a tartalom szubjektív értékeléséért</li>
          </ul>
        </Section>

        <Section title="9. Egyéb rendelkezések">
          <p className="font-semibold">9.1 Az ÁSZF hatálya</p>
          <p>
            Az ÁSZF a webáruházban leadott valamennyi megrendelésre vonatkozik. A vásárló a
            rendelés leadásával elfogadja az ÁSZF rendelkezéseit.
          </p>
          <p className="font-semibold mt-3">9.2 Az ÁSZF módosítása</p>
          <p>
            Az Eladó jogosult az ÁSZF egyoldalú módosítására. A módosítás a weboldalon
            történő közzététellel lép hatályba, és a hatálybalépést követően leadott
            rendelésekre alkalmazandó.
          </p>
          <p className="font-semibold mt-3">9.3 Részleges érvénytelenség</p>
          <p>
            Amennyiben az ÁSZF valamely rendelkezése érvénytelennek vagy végrehajthatatlannak
            bizonyul, az a többi rendelkezés érvényességét nem érinti.
          </p>
          <p className="font-semibold mt-3">9.4 Alkalmazandó jog</p>
          <p>
            A jelen ÁSZF-re a magyar jog rendelkezései irányadók, különös tekintettel a
            Polgári Törvénykönyvről szóló 2013. évi V. törvény, valamint a fogyasztóvédelmi
            és elektronikus kereskedelemre vonatkozó hatályos jogszabályok rendelkezéseire.
          </p>
          <p className="font-semibold mt-3">9.5 Hatálybalépés</p>
          <p>
            Jelen Általános Szerződési Feltételek 2026. július 10. napjától hatályosak, és
            visszavonásig vagy módosításukig érvényesek.
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
