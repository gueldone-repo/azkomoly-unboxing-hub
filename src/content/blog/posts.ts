import type { Lang } from "@/lib/i18n/dictionary";

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "img"; src: string; alt: string }
  | { type: "quote"; text: string };

export type BlogPostContent = {
  title: string;
  excerpt: string;
  blocks: BlogBlock[];
};

export type BlogPost = {
  slug: string;
  publishedAt: string; // ISO date
  category: string;
  coverImage: string;
  hu: BlogPostContent;
  en: BlogPostContent;
};

/**
 * Contenido del blog vive en el repo, sin CMS ni tabla nueva de Supabase
 * (schema congelado salvo pedido explícito, ver CLAUDE.md). Para publicar un
 * post nuevo: agregarlo acá y sumarlo a mano a BLOG_ROUTES en
 * `scripts/generate-sitemap.mjs`.
 */
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "mystery-box-rendeles-magyarorszagon",
    publishedAt: "2026-08-17",
    category: "vasarlasi-utmutato",
    coverImage: "/boxes.webp",
    hu: {
      title: "Mystery box rendelés Magyarországon: hogyan válassz dobozt?",
      excerpt:
        "Mystery box rendelés előtt ezt érdemes végiggondolni: méret, érték, stílus, szállítás és az, hogy mennyi meglepetést bírsz el.",
      blocks: [
        {
          type: "p",
          text: "A mystery box rendelés Magyarországon akkor jó döntés, ha nem egy pontosan kiválasztott terméket akarsz, hanem egy bontási élményt. Az AZKOMOLY dobozoknál nem az a lényeg, hogy előre kipipálj minden színt, fazont és darabot. Az a lényeg, hogy fix csomagot választasz, kinyitod, és csak ott derül ki, mit kaptál. Ezért más, mint egy sima webshopos kosár: itt a meglepetés maga a termék része.",
        },
        { type: "h2", text: "Először döntsd el, mekkora kockázatot szeretnél" },
        {
          type: "p",
          text: "A jó mystery box választás nem ott kezdődik, hogy melyik doboz neve hangzik a legmenőbben. Ott kezdődik, hogy mennyire akarsz belevágni. Ha csak kipróbálnád az élményt, egy kisebb csomag logikusabb. Ha ajándékba adnád, vagy tényleg nagyobb unboxing-pillanatot akarsz, akkor a nagyobb kategóriák jobban működnek. Az AZKOMOLY dobozoknál a Mini, Klasszikus, Prémium és Legendás szintek pont ezt a döntést könnyítik meg: nem terméktípust választasz, hanem élményszintet.",
        },
        {
          type: "p",
          text: "Ez fontos, mert a mystery box természetéből adódik, hogy nem tudod előre a pontos tartalmat. Lehet benne ruha, kiegészítő, kütyü vagy más meglepetés. Ha ezt hibának érzed, akkor nem biztos, hogy ez a neked való vásárlás. Ha viszont pont ettől lesz izgalmas, akkor jó helyen jársz.",
        },
        {
          type: "ul",
          items: [
            "Mini: belépő az AZKOMOLY világába, ha először próbálnád ki.",
            "Klasszikus: a legkönnyebben érthető választás, ha ajándék vagy saját doboz kell.",
            "Prémium: nagyobb unboxing, erősebb streetwear-hangulat.",
            "Legendás: akkor érdemes nézni, ha nem kis meglepetést keresel.",
          ],
        },
        { type: "h2", text: "Mire figyelj rendelés előtt?" },
        {
          type: "p",
          text: "Az első kérdés mindig ez: elfogadod-e, hogy a tartalom nem választható ki előre? A második: mit kezdesz azzal, ha valamelyik darab nem pont a te stílusod vagy méreted? A FAQ-ban is ezért szerepel külön a méretkérdés. A mystery box nem személyre szabott stylist-szolgáltatás, hanem meglepetésdoboz. Amit az AZKOMOLY ígér: új, válogatott termékek és olyan csomag, ahol a bontás izgalma valós.",
        },
        {
          type: "p",
          text: "Érdemes azt is megnézni, kinek veszed a dobozt. Saját rendelésnél könnyebb bevállalni a meglepetést, mert te döntöd el, mit tartasz meg és mit adsz tovább. Ajándéknál jobban számít, hogy az illető szereti-e a váratlan dolgokat. A mystery box nem akkor erős, amikor valaki mindent kontrollálni akar, hanem akkor, amikor a kibontás pillanata önmagában is ajándék.",
        },
        {
          type: "p",
          text: "Ha ruha kerül a dobozba és nem jó a méret, ajándékként vagy továbbadásra is működhet. Magyarországon a Vinted és a Vatera miatt ez nem elméleti lehetőség: új termékeknél sokkal könnyebb továbbadni azt, ami neked nem passzol. Ez nem helyettesíti a saját választást, de csökkenti a vásárlás kockázatát.",
        },
        { type: "h2", text: "Ajándéknak vagy magadnak jobb?" },
        {
          type: "p",
          text: "Mindkettőre működik, de más okból. Magadnak akkor jó, ha szereted a váratlan darabokat, és nem akarsz fél órát görgetni egy webshopban egyetlen pólóért. Ajándéknak akkor jó, ha olyan embernek adod, aki bírja a meglepetést. Ha valaki csak konkrét méretet, konkrét márkát és konkrét színt fogad el, neki jobb egy hagyományos ajándék. Ha viszont szereti a streetwear, drop, unboxing és zsákbamacska hangulatot, a mystery box sokkal emlékezetesebb.",
        },
        { type: "h2", text: "Szállítás és rendelés: mit lehet tudni?" },
        {
          type: "p",
          text: "A szállításról nem érdemes többet ígérni, mint amit a rendszer tényleg tartani tud. Az AZKOMOLY jelenlegi FAQ-ja szerint a kézbesítés általában 2-3 munkanap, de a futárszolgálattól függően legfeljebb egy hétig tarthat. A checkout külön Shopify-alapon fut, a rendelés pedig HUF-ban történik, magyar piacra optimalizálva.",
        },
        {
          type: "p",
          text: "Ha Európából nézed az oldalt, fontos tudni, hogy az angol oldal jelenleg inkább információs réteg, nem külön nemzetközi piac. A fő fókusz Magyarország: magyar domain, magyar checkout-útvonal, forintos vásárlás és magyar vásárlói kérdések. Ez SEO szempontból is jó, mert nem próbál egyszerre mindenkinek beszélni. Aki magyar mystery boxot keres, annak egyértelmű jelzést kap.",
        },
        { type: "h2", text: "Melyik AZKOMOLY dobozzal kezdd?" },
        {
          type: "p",
          text: "Ha ez az első mystery box rendelésed, kezdd azzal, mennyire akarsz nagyot nyitni. A Mini jó teszt. A Klasszikus a legbiztonságosabb középút. A Prémium már erősebb ajándék vagy saját unboxing. A Legendás azoknak való, akik nem csak kipróbálni akarják, hanem rámennek az élményre. Nézd meg az aktuális dobozokat a shopban, aztán olvasd át a FAQ-t is, főleg a méret, szállítás és termékeredet részeket.",
        },
      ],
    },
    en: {
      title: "Mystery box ordering in Hungary: how to choose the right box",
      excerpt:
        "Before ordering a mystery box in Hungary, think through size, value, style, shipping, and how much surprise you actually want.",
      blocks: [
        {
          type: "p",
          text: "Ordering a mystery box in Hungary makes sense when you are not looking for one exact item, but for an unboxing experience. With AZKOMOLY boxes, the point is not to choose every color, cut, and product upfront. The point is to pick a box level, open it, and discover what is inside only when it arrives. That makes it different from a normal webshop cart: the surprise is part of the product.",
        },
        { type: "h2", text: "Start with how much surprise you want" },
        {
          type: "p",
          text: "A good mystery box choice does not start with the coolest name. It starts with how far you want to go. If you only want to test the concept, a smaller box is the cleaner first step. If you are buying a gift or want a bigger unboxing moment, the larger levels make more sense. AZKOMOLY's Mini, Classic, Premium, and Legendary categories are built around that decision: you are choosing the level of the experience, not a fixed product list.",
        },
        {
          type: "p",
          text: "That matters because a mystery box, by definition, does not reveal the exact contents upfront. It can include clothing, accessories, gadgets, and other surprises. If that sounds like a problem, this may not be the right purchase for you. If that is exactly what makes it exciting, you are in the right place.",
        },
        {
          type: "ul",
          items: [
            "Mini: a simple entry point if you are trying AZKOMOLY for the first time.",
            "Classic: the easiest middle choice for a gift or your own first box.",
            "Premium: a bigger unboxing with a stronger streetwear feel.",
            "Legendary: the level to look at when you want the full experience.",
          ],
        },
        { type: "h2", text: "What should you check before ordering?" },
        {
          type: "p",
          text: "The first question is simple: are you comfortable with not choosing the contents upfront? The second is what you will do if one item is not exactly your style or size. That is why the size question is answered separately in the FAQ. A mystery box is not a personal styling service. It is a surprise box. What AZKOMOLY promises is new, selected products and a real unboxing moment.",
        },
        {
          type: "p",
          text: "If a clothing item appears in the box and the size does not work for you, it can still be a gift or something to resell. In Hungary, platforms like Vinted and Vatera make that practical rather than theoretical, especially when the products are new. It does not replace choosing for yourself, but it lowers the risk of the surprise format.",
        },
        { type: "h2", text: "Is it better as a gift or for yourself?" },
        {
          type: "p",
          text: "Both work, but for different reasons. For yourself, it works if you like unexpected pieces and do not want to scroll through a webshop for half an hour just to pick one item. As a gift, it works for someone who enjoys surprise. If a person only accepts a specific size, brand, color, and cut, a traditional gift is safer. If they like streetwear, drops, unboxing, and the thrill of not knowing, a mystery box is much more memorable.",
        },
        { type: "h2", text: "Shipping and checkout: what can you know?" },
        {
          type: "p",
          text: "Shipping should not be overpromised. AZKOMOLY's current FAQ says delivery usually takes 2-3 business days, but depending on the delivery company it can take up to one week. Checkout runs through Shopify on a separate checkout domain, orders are priced in HUF, and the store is currently built around the Hungarian market.",
        },
        { type: "h2", text: "Which AZKOMOLY box should you start with?" },
        {
          type: "p",
          text: "If this is your first mystery box order, start with how big you want the experience to feel. Mini is a good test. Classic is the safest middle choice. Premium is a stronger gift or personal unboxing. Legendary is for people who do not just want to try the idea, but want the full box moment. Check the current boxes in the shop, then read the FAQ as well, especially the size, shipping, and product origin answers.",
        },
      ],
    },
  },
  {
    slug: "ruha-mystery-box-mi-van-a-dobozban",
    publishedAt: "2026-08-17",
    category: "streetwear",
    coverImage: "/boxes inside.webp",
    hu: {
      title: "Ruha mystery box: mi van a dobozban, és kinek éri meg?",
      excerpt:
        "A ruha mystery box akkor működik, ha nem katalógust vársz, hanem stílusos meglepetést. Itt van, mire számíts.",
      blocks: [
        {
          type: "p",
          text: "A ruha mystery box lényege egyszerű: ruhák, kiegészítők és streetwear-hangulat egy olyan csomagban, aminek a pontos tartalmát nem látod előre. Nem klasszikus ruhavásárlás, ahol kiválasztod a fekete pólót M-es méretben, beteszed a kosárba, és pontosan azt kapod. Itt az élmény része, hogy a doboz csak bontáskor beszél.",
        },
        { type: "h2", text: "Mit jelent az, hogy ruha mystery box?" },
        {
          type: "p",
          text: "A keresőkben sokan írják be úgy, hogy mystery box, meglepetés doboz, ruha csomag vagy zsákbamacska ruha. Ezek ugyanarra a kíváncsiságra épülnek: lehet-e jó áron érdekes darabokat kapni úgy, hogy nem te válogatod össze őket egyesével? Az AZKOMOLY válasza erre nem egy steril divatcsomag, hanem egy karakteres, streetwearre hangolt unboxing. A pontos tartalom változik, de a doboz célja ugyanaz: olyan pillanatot adni, amit egy sima rendelés nem tud.",
        },
        {
          type: "p",
          text: "A streetwear miatt ez különösen működik. Ennél a stílusnál sokszor nem egyetlen hibátlanul megtervezett outfit a lényeg, hanem az, hogy találsz egy darabot, ami megtöri a megszokott szettet. Egy sapka, egy kiegészítő, egy hoodie vagy egy váratlan szín sokkal többet tud hozzáadni, mint egy túl biztonságos választás. A doboz pont ezt a váratlan energiát hozza be.",
        },
        {
          type: "p",
          text: "Ezért fontos elengedni azt az elvárást, hogy minden darab garantáltan a kedvenc színed, fazonod vagy méreted lesz. A mystery box nem így működik. Ha a meglepetést választod, cserébe kapsz egy játékosabb, impulzívabb vásárlást, ahol az első reakció tényleg számít.",
        },
        { type: "h2", text: "Mi lehet a dobozban?" },
        {
          type: "p",
          text: "Az AZKOMOLY FAQ-ja direkt nem spoilerez: ruhák, kiegészítők, kütyük és meglepetések is előfordulhatnak. Ez nem véletlenül van így megfogalmazva. Ha minden tételt előre felsorolnánk, a mystery box elveszítené azt, amiért működik. A vásárlás nem arról szól, hogy tudod, mi jön. Arról szól, hogy kinyitod, reagálsz, felpróbálod, továbbadod, megtartod vagy elajándékozod.",
        },
        {
          type: "ul",
          items: [
            "Ruhadarabok, amelyek streetwear szettekbe is beilleszthetők.",
            "Kiegészítők, amelyek feldobják a doboz élményét.",
            "Váratlan extra tételek, mert nem minden csomag ugyanaz.",
            "Új termékek, amelyeket nem használtként kell elképzelni.",
          ],
        },
        { type: "h2", text: "Mi a helyzet a mérettel?" },
        {
          type: "p",
          text: "Ez az egyik legfontosabb kérdés, és jobb őszintén kezelni. A méret előre nem választható, mert a mystery box nem személyre szabott rendelés. Ha ez számodra kizáró ok, akkor inkább ne ebből indulj ki. Ha viszont tudod kezelni, hogy egy ruha nem biztos, hogy rád lesz szabva, akkor a doboz még mindig lehet jó vétel: ajándékba adhatod, továbbadhatod, vagy eladhatod olyan platformokon, ahol az új ruhadarabok könnyen mozognak.",
        },
        {
          type: "p",
          text: "Ez a rész azért fontos, mert a csalódás nagy része rossz elvárásból jön. Ha úgy rendeled meg, mintha konkrét méretű nadrágot vennél, könnyen félreértés lesz. Ha úgy rendeled meg, mint egy streetwear meglepetéscsomagot, amiben a jó darabokat megtartod, a nem passzolókat pedig okosan továbbadod, akkor sokkal reálisabb élményt kapsz.",
        },
        {
          type: "p",
          text: "A legjobb vásárló itt nem az, aki vakon mindent elfogad, hanem aki érti a játék szabályait. A doboz nem ígér teljes kontrollt. Azt ígéri, hogy a vásárlás nem unalmas.",
        },
        { type: "h2", text: "Kinek éri meg a ruha mystery box?" },
        {
          type: "p",
          text: "Annak, aki szereti a váratlan darabokat, és nem akar mindent túltervezni. Annak, aki ajándékot keres, de nem akar megint parfümöt, bögrét vagy ajándékkártyát venni. Annak is, aki streetwear hangulatot keres, de nyitott arra, hogy a doboz adjon irányt. Nem annak való, aki egyetlen konkrét terméket akar megvenni. Erre ott van a hagyományos webshop. A mystery box másik pálya.",
        },
        {
          type: "quote",
          text: "Ha pontos listát akarsz, ez nem a te dobozod. Ha bontani akarsz, akkor pont ez a lényeg.",
        },
        { type: "h2", text: "Melyik doboz illik hozzád?" },
        {
          type: "p",
          text: "Első vásárlásnál a Mini vagy a Klasszikus a legkönnyebb belépő. Ha már tudod, hogy bírod a meglepetést, a Prémium és a Legendás ad nagyobb unboxing-érzést. Érdemes a shopban megnézni az aktuális dobozokat, majd átfutni a FAQ-t is: a méret, szállítás, sérülés és termékeredet kérdéseire ott vannak a rövid, ügyfélnek szánt válaszok.",
        },
      ],
    },
    en: {
      title: "Clothing mystery box: what's inside, and who is it worth it for?",
      excerpt:
        "A clothing mystery box works when you want a stylish surprise, not a catalog order. Here is what to expect.",
      blocks: [
        {
          type: "p",
          text: "A clothing mystery box is simple in concept: clothing, accessories, and streetwear energy in a package whose exact contents you do not see upfront. It is not a classic clothing order where you choose a black T-shirt in size M, add it to cart, and receive exactly that. Here, the box speaks only when you open it.",
        },
        { type: "h2", text: "What does clothing mystery box mean?" },
        {
          type: "p",
          text: "People search for this in different ways: mystery box, surprise box, clothing box, lucky bag, or streetwear mystery box. The intent behind those searches is similar: can you get interesting pieces at a good value without choosing them one by one? AZKOMOLY's answer is not a plain fashion parcel. It is a characterful, streetwear-leaning unboxing experience. The exact contents change, but the goal stays the same: create a moment a normal order cannot give you.",
        },
        {
          type: "p",
          text: "That means you need to let go of the idea that every item will be your favorite color, cut, or size. A mystery box does not work like that. When you choose the surprise, you get a more playful, more impulsive purchase where the first reaction actually matters.",
        },
        { type: "h2", text: "What can be inside the box?" },
        {
          type: "p",
          text: "AZKOMOLY's FAQ intentionally does not spoil the box: clothing, accessories, gadgets, and other surprises may appear. That wording is deliberate. If every item were listed upfront, the mystery box would lose the reason it works. The purchase is not about knowing what is coming. It is about opening it, reacting, trying things on, keeping them, gifting them, or passing them on.",
        },
        {
          type: "ul",
          items: [
            "Clothing pieces that can fit into streetwear outfits.",
            "Accessories that add to the box experience.",
            "Unexpected extras, because not every package is the same.",
            "New products that should not be imagined as used items.",
          ],
        },
        { type: "h2", text: "What about sizing?" },
        {
          type: "p",
          text: "This is one of the most important questions, and it is better to be direct. Size selection is not available upfront because the mystery box is not a personalized order. If that is a deal breaker, start with a normal product instead. If you can handle the fact that a clothing item may not be made for you, the box can still make sense: you can gift it, pass it on, or resell it on platforms where new clothing items move easily.",
        },
        { type: "h2", text: "Who is a clothing mystery box worth it for?" },
        {
          type: "p",
          text: "It is worth it for someone who likes unexpected pieces and does not want to overplan every purchase. It works for someone buying a gift who does not want another perfume, mug, or gift card. It also works for someone who wants streetwear energy but is open to letting the box set the direction. It is not for someone who wants one exact product. That is what a normal webshop is for. A mystery box is a different lane.",
        },
        {
          type: "quote",
          text: "If you want a fixed list, this is not your box. If you want to open something, that is the point.",
        },
        { type: "h2", text: "Which box fits you?" },
        {
          type: "p",
          text: "For a first order, Mini or Classic is the easiest entry point. If you already know you enjoy the surprise, Premium and Legendary create a bigger unboxing feeling. Check the current boxes in the shop, then skim the FAQ as well: the size, shipping, damaged item, and product origin answers are all written for real buyers.",
        },
        {
          type: "p",
          text: "The key is expectation. Do not order it like a fixed-size clothing product. Order it like a streetwear surprise where the best pieces stay with you and the pieces that do not fit can still become a gift or a resale item. That mindset is what makes the format work.",
        },
      ],
    },
  },
  {
    slug: "honnan-szarmaznak-a-mystery-box-termekek",
    publishedAt: "2026-08-17",
    category: "doboz-mogott",
    coverImage: "/asset_azkomoly.webp",
    hu: {
      title: "Honnan származnak a mystery box termékek?",
      excerpt:
        "Liquidation, visszaküldött csomagok, túlkészlet és második esély: így érdemes érteni, honnan jönnek a mystery box termékek.",
      blocks: [
        {
          type: "p",
          text: "A mystery box termékek eredete jogos kérdés. Ha nem tudod előre, mi van a dobozban, legalább azt szeretnéd tudni, honnan jönnek a benne lévő dolgok. Az AZKOMOLY dobozoknál a rövid válasz: nem átvett, visszaküldött és túlkészletezett csomagokból, illetve nagy e-kereskedelmi platformokhoz kötődő vegyes tételekből válogatunk. Ilyen termékek eredetileg olyan nagy webáruházak rendszerében mozoghatnak, mint a Shein, Temu, Amazon és más online retailerek.",
        },
        { type: "h2", text: "Mi az a liquidation vagy túlkészlet?" },
        {
          type: "p",
          text: "A nagy webáruházakban rengeteg termék mozog. Vannak csomagok, amelyeket nem vesznek át. Vannak visszaküldések. Vannak tételek, amelyekből túl sok marad raktáron. Ezek nem feltétlenül rossz vagy használhatatlan termékek. Sokszor egyszerűen arról van szó, hogy a kereskedelmi rendszer továbbpörgött: jön az új készlet, változik a szezon, lezárul egy kampány, és a vegyes tételeket továbbértékesítik liquidation csatornákon keresztül.",
        },
        {
          type: "p",
          text: "A mystery box modell pont itt lép be. Ahelyett, hogy ezek a termékek eltűnnének a háttérben vagy feleslegesen állnának raktárban, új csomagként kapnak második esélyt. A vásárló nem egy adott termékoldalt vesz meg, hanem egy válogatott meglepetést. Ezért minden doboz más, és ezért nem lehet előre teljes listát adni a tartalomról.",
        },
        {
          type: "p",
          text: "Ez nem ugyanaz, mint amikor valaki saját használt ruháit összedobja egy csomagba. A lényeg a forrás és a válogatás: nagyobb retail-rendszerekből érkező vegyes tételek, amelyeket át kell nézni, szűrni kell, és csak utána lehet belőlük eladható dobozélményt csinálni. Ettől lesz a mystery box egyszerre kereskedelmi termék és meglepetés.",
        },
        { type: "h2", text: "Új termékekről van szó?" },
        {
          type: "p",
          text: "Az AZKOMOLY kommunikációja szerint csak minőségi, új termékek kerülnek a dobozba. Ez lényeges különbség. A visszaküldött vagy túlkészletezett forrás nem azt jelenti, hogy használt, hordott vagy hibás dolgokat kell elképzelni. A gyakorlatban ezek vegyes készletek, amelyeket át kell nézni, válogatni kell, és úgy lehet belőlük mystery boxot építeni, hogy a bontás élménye megmaradjon.",
        },
        {
          type: "quote",
          text: "Minden szállítmány különböző, ezért minden doboz egyedi.",
        },
        { type: "h2", text: "Miért nem írjuk ki előre a teljes tartalmat?" },
        {
          type: "p",
          text: "Mert akkor nem mystery box lenne. A teljes tartalom előzetes listázása megölné azt, amiért az emberek ilyen dobozt rendelnek. Ettől még a kérdés jogos: a vásárló szeretné tudni, hogy nem random szemét kerül a csomagba. A megoldás az átlátható keret: elmondani, milyen típusú forrásból származnak a termékek, mit jelent a meglepetés, és mely kérdéseket kell elfogadni rendelés előtt.",
        },
        {
          type: "p",
          text: "A bizalom itt nem abból jön, hogy minden darabot előre megmutatunk. Abból jön, hogy tisztán kimondjuk a szabályokat. Nem választhatsz méretet előre. Nem tudod pontosan, mi lesz benne. A szállítás ideje a futárszolgálattól is függhet. Cserébe egy olyan dobozt kapsz, amelynek az értelme pont a bontásban van.",
        },
        {
          type: "p",
          text: "Ezért a termékeredet nem mellékszál, hanem bizalmi kérdés. Ha tudod, milyen rendszerből jönnek a tételek, könnyebb eldönteni, hogy a meglepetés neked izgalmas vagy túl nagy kompromisszum lesz.",
        },
        {
          type: "ul",
          items: [
            "A pontos terméklista nem ismert előre.",
            "A dobozok tartalma szállítmányonként változhat.",
            "A termékek válogatott, új tételekből állnak.",
            "A cél az unboxing-élmény, nem egy előre fixált kosár.",
          ],
        },
        { type: "h2", text: "Fenntarthatóbb ez, mint simán új terméket venni?" },
        {
          type: "p",
          text: "Nem kell túl nagy szavakat használni: a mystery box nem oldja meg az e-kereskedelem összes problémáját. De azzal, hogy túlkészletezett, visszaküldött vagy nem átvett tételek második esélyt kapnak, kevesebb jó állapotú termék marad értelmetlenül a rendszerben. Ez praktikus oldalról is fontos: a vásárló élményt kap, a termék pedig nem veszik el a logisztikai háttérben.",
        },
        { type: "h2", text: "Mit kérdezz meg magadtól rendelés előtt?" },
        {
          type: "p",
          text: "Ha a termékek eredete miatt bizonytalan vagy, olvasd át a FAQ-t, különösen a 'Mi van a dobozban?', 'Választhatok méretet?' és 'Honnan származnak a termékek?' válaszokat. Ha ezek után is csak konkrét terméket szeretnél, a mystery box valószínűleg nem neked való. Ha viszont érted a keretet, és érdekel a bontás pillanata, nézd meg az aktuális AZKOMOLY dobozokat a shopban.",
        },
      ],
    },
    en: {
      title: "Where do mystery box products come from?",
      excerpt:
        "Liquidation, returns, overstock, and second chances: here is how to understand where mystery box products come from.",
      blocks: [
        {
          type: "p",
          text: "The origin of mystery box products is a fair question. If you do not know exactly what is inside the box, you at least want to know where the products come from. For AZKOMOLY boxes, the short answer is this: we source from unclaimed, returned, and overstock parcels, plus mixed lots connected to large e-commerce platforms. These kinds of products may originally move through systems used by major online retailers such as Shein, Temu, Amazon, and other e-commerce stores.",
        },
        { type: "h2", text: "What does liquidation or overstock mean?" },
        {
          type: "p",
          text: "Large webshops move a huge number of products. Some parcels are never collected. Some orders are returned. Some items remain in stock after a season, campaign, or product cycle ends. That does not automatically make them bad or unusable. Often it simply means the retail system has moved on: new stock arrives, the season changes, the campaign closes, and mixed lots are resold through liquidation channels.",
        },
        {
          type: "p",
          text: "That is where the mystery box model fits. Instead of letting those products disappear into the background or sit in storage, they get a second chance as a new package. The customer is not buying one fixed product page. They are buying a selected surprise. That is why each box is different, and why the full contents cannot be listed upfront.",
        },
        { type: "h2", text: "Are the products new?" },
        {
          type: "p",
          text: "AZKOMOLY's communication says that only quality, new products go into the boxes. That distinction matters. A returned or overstock source does not mean you should imagine used, worn, or broken items. In practice, these are mixed lots that need to be reviewed and selected, then turned into mystery boxes while keeping the unboxing experience intact.",
        },
        {
          type: "quote",
          text: "Every shipment is different, so every box is unique.",
        },
        { type: "h2", text: "Why not list the full contents upfront?" },
        {
          type: "p",
          text: "Because then it would not be a mystery box. Listing every item before purchase would remove the reason people order this kind of box in the first place. Still, the question is valid: customers want to know the package is not random junk. The answer is a transparent frame: explain the type of source, explain what the surprise means, and make the important questions clear before someone orders.",
        },
        {
          type: "ul",
          items: [
            "The exact product list is not known upfront.",
            "Box contents can vary from shipment to shipment.",
            "The products are selected, new items.",
            "The goal is the unboxing experience, not a fixed cart.",
          ],
        },
        { type: "h2", text: "Is this more sustainable than simply buying new?" },
        {
          type: "p",
          text: "There is no need to exaggerate: a mystery box does not solve every problem in e-commerce. But by giving overstock, returned, or unclaimed products a second chance, fewer good-condition items are left stuck in the system. That matters on a practical level too: the customer gets an experience, and the product does not disappear into the logistics background.",
        },
        { type: "h2", text: "What should you ask yourself before ordering?" },
        {
          type: "p",
          text: "If the origin of the products makes you unsure, read the FAQ, especially the answers to 'What's in the box?', 'Can I choose my size?', and 'Where are the products from?'. If you still only want one exact product, a mystery box is probably not for you. If you understand the frame and want the unboxing moment, check the current AZKOMOLY boxes in the shop.",
        },
        {
          type: "p",
          text: "Trust in this format does not come from showing every item before checkout. It comes from being clear about the rules. You cannot choose the exact size upfront. You do not know the full contents before opening. Shipping can depend on the delivery provider. In exchange, you get a box whose whole purpose is the moment of opening it.",
        },
      ],
    },
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getBlogPostContent(post: BlogPost, lang: Lang): BlogPostContent {
  return post[lang];
}
