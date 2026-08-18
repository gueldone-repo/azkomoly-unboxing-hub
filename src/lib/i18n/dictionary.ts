// Capa de datos: diccionario tipado hu/en — fuente única de todo el copy del
// sitio. Al agregar texto nuevo, sumarlo acá en ambos idiomas.
export type Lang = "hu" | "en";

export const LANGS: { code: Lang; label: string; short: string; flag: string }[] = [
  { code: "hu", label: "Magyar", short: "HU", flag: "🇭🇺" },
  { code: "en", label: "English", short: "EN", flag: "🇬🇧" },
];

export type ProductCopy = {
  name: string;
  tier: string;
  blurb: string;
  pieces: string;
  badge?: string;
};

export type Dict = {
  meta: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
  };
  nav: {
    shop: string;
    merch: string;
    how: string;
    about: string;
    faq: string;
    blog: string;
    reviews: string;
    contact: string;
    notify: string;
    home: string;
    cart: string;
    prevSection: string;
    nextSection: string;
    scrollTop: string;
    /** Etiqueta accesible de la barra inferior. Hay dos <nav> en la página, así
     *  que cada uno necesita nombre propio para los lectores de pantalla. */
    primary: string;
  };
  hero: {
    est: string;
    index: string;
    mysteryBox: string;
    heading: string;
    tagline: string;
    rotatingTaglines: string[];
    imageAlt: string;
    marquee: string;
    scrollAria: string;
    scroll: string;
    cta: string;
  };
  promo: {
    live: string;
    heading: string;
    sub: string;
    days: string;
    hours: string;
    mins: string;
    secs: string;
  };
  urgency: {
    prefix: string;
    suffix: string;
    /** Texto que reemplaza al 00:00 cuando el contador llega a cero. */
    ended: string;
  };
  introVideo: {
    title: string;
    copy: string;
    skip: string;
    enter: string;
    mute: string;
    unmute: string;
  };
  products: {
    kicker: string;
    heading: string;
    sub: string;
    open: string;
    lastUnits: (n: number) => string;
    inStock: string;
    guaranteedValue: string;
    contents: string;
    soldOut: string;
    empty: string;
    showMore: string;
    showLess: string;
    previous: string;
    next: string;
    rarity: { common: string; rare: string; epic: string; legendary: string };
    items: Record<string, ProductCopy>;
  };
  velocity: {
    text: string;
    textSecondary: string;
  };
  socialProof: {
    kicker: string;
    heading: string;
    sub: string;
    openOn: string;
    screenshotAlt: string;
  };
  values: {
    items: { title: string; text: string }[];
  };
  reviews: { name: string; text: string }[];
  how: {
    kicker: string;
    heading: string;
    steps: { n: string; title: string; text: string }[];
  };
  bigCta: {
    kicker: string;
    heading: string;
    hoverHint: string;
    showBoxes: string;
    notify: string;
  };
  closingFloat: {
    text: string;
  };
  faq: {
    kicker: string;
    heading: string;
    items: { q: string; a: string }[];
  };
  /** Página /faq (y /en/faq): cabecera y bloque de contacto. */
  faqPage: {
    title: string;
    intro: string;
    helpTitle: string;
    helpSub: string;
    fieldName: string;
    fieldEmail: string;
    fieldMessage: string;
    send: string;
    mailFallback: string;
    breadcrumb: string;
  };
  /** Página /about (y /en/about). */
  about: {
    title: string;
    intro: string;
    goalTitle: string;
    goalP1: string;
    goalP2: string;
    whoTitle: string;
    whoLead: string;
    whoBody: string;
    badgeHungarian: string;
    badgeOriginal: string;
    seeBoxes: string;
    followTitle: string;
    followSub: string;
  };
  blog: {
    kicker: string;
    heading: string;
    sub: string;
    readMore: string;
    backToBlog: string;
    publishedOn: string;
    empty: string;
    relatedHeading: string;
    relatedShop: string;
    relatedFaq: string;
  };
  footer: {
    follow: string;
    products: string;
    about: string;
    faq: string;
    blog: string;
    privacy: string;
    terms: string;
    cookies: string;
    tagline: string;
    taxNumber: string;
    companyNumber: string;
    rights: string;
  };
  signup: {
    title: string;
    name: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    phone: string;
    optional: string;
    phonePlaceholder: string;
    consentPre: string;
    consentTerms: string;
    consentMid: string;
    consentPrivacy: string;
    consentPost: string;
    submit: string;
    sending: string;
    successNew: string;
    successExisting: string;
    errorConsent: string;
    errorGeneric: string;
  };
  discountWidget: {
    title: string;
    sub: string;
    cta: string;
    close: string;
  };
  product: {
    back: string;
    size: string;
    addToCart: string;
    buyNow: string;
    contents: string;
    guaranteedValue: string;
    guaranteedValueShort: string;
    inStock: string;
    units: string;
    trustBranded: string;
    trustShipping: string;
    trustValue: string;
    notFound: string;
    backToShop: string;
    errorTitle: string;
    retry: string;
  };
  cookie: {
    title: string;
    body: string;
    cookiePolicy: string;
    privacy: string;
    acceptAll: string;
    onlyNecessary: string;
    settings: string;
    settingsTitle: string;
    necessary: string;
    analytics: string;
    marketing: string;
    save: string;
    back: string;
  };
  cart: {
    title: string;
    empty: string;
    emptyCta: string;
    size: string;
    subtotal: string;
    shippingNote: string;
    checkout: string;
    remove: string;
    clear: string;
    added: string;
    count: (n: number) => string;
  };
  reveal: {
    kicker: string;
    heading: string;
    sub: string;
    cta: string;
  };
  boxSpinner: {
    pick: string;
    sub: string;
    tap: string;
    congrats: string;
    gateHint: string;
    gateName: string;
    gateEmail: string;
    gatePhone: string;
    gateSubmit: string;
    couponLabel: string;
    discount: string;
    copyHint: string;
    cta: string;
  };
};

const hu: Dict = {
  meta: {
    title: "AZKOMOLY — Mi van a dobozban?",
    description:
      "AZKOMOLY mystery box: nem tudod mi van benne — és ez a lényeg. Válassz dobozt, fizess, kapd meg, nyisd ki.",
    ogTitle: "AZKOMOLY — Mi van a dobozban?",
    ogDescription: "Nem tudod mi van benne. Ez a lényeg.",
  },
  nav: { shop: "Bolt", merch: "Merch", how: "Hogyan működik", about: "Rólunk", faq: "GYIK", blog: "Blog", reviews: "Vélemények", contact: "Kapcsolat", notify: "Feliratkozás", home: "Főoldal", cart: "Kosár", prevSection: "Előző szakasz", nextSection: "Következő szakasz", scrollTop: "Vissza a tetejére", primary: "Fő navigáció" },
  hero: {
    est: "EST · MMXXVI",
    index: "/01",
    mysteryBox: "MYSTERY · BOX",
    heading: "NYISD\nKI A TITKOT",
    tagline: "Válassz egy dobozt. Fedezd fel, mi van benne.",
    rotatingTaglines: [
      "Minden alkalommal más meglepetés.",
      "Eredeti streetwear darabok.",
      "Nincs két egyforma doboz.",
    ],
    imageAlt: "AZKOMOLY mystery box",
    marquee: "AZKOMOLY · MYSTERY BOX",
    scrollAria: "Görgess a termékekhez",
    scroll: "GÖRGESS",
    cta: "KINYITOM A DOBOZOM →",
  },
  promo: {
    live: "DROP #002 · ÉLŐBEN",
    heading: "Új doboz · vasárnap 20:00",
    sub: "Amíg el nem fogy. Limitált darabszám, nincs utánrendelés.",
    days: "NAP",
    hours: "ÓRA",
    mins: "PERC",
    secs: "MP",
  },
  urgency: {
    prefix: "Villámajánlat lejár:",
    suffix: "",
    ended: "A villámajánlat lejárt",
  },
  introVideo: {
    title: "Kattints, ha ugranál",
    copy: "A videó után jönnek a dobozok. Az X-szel azonnal továbbmehetsz.",
    skip: "Intro kihagyása",
    enter: "TOVÁBB A DOBOZOKHOZ",
    mute: "Némítás",
    unmute: "Hang bekapcsolása",
  },
  products: {
    kicker: "VÁLASZD A TÉTEDET",
    heading: "A dobozaink",
    sub: "Minél nagyobb a doboz, annál nagyobb a dobás. Minden tier garantált minimum értékkel.",
    open: "MEGVESZEM",
    lastUnits: (n) => `UTOLSÓ ${n} DB`,
    inStock: "Készleten",
    guaranteedValue: "Garantált érték",
    contents: "Tartalom",
    soldOut: "ELFOGYOTT",
    empty: "Hamarosan új dobozok…",
    showMore: "TÖBB DOBOZ",
    showLess: "KEVESEBB",
    previous: "Előző doboz",
    next: "Következő doboz",
    rarity: { common: "Sima", rare: "Ritka", epic: "Epikus", legendary: "Legendás" },
    items: {
      mini: {
        name: "MINI DOBOZ",
        tier: "Belépő szint",
        pieces: "2–3 darab",
        blurb:
          "Az első adagod. Pólók, sapkák, kis kiegészítők. Garantált márkás cucc, nulla ráhatás.",
        badge: "STARTER",
      },
      klasszik: {
        name: "KLASSZIKUS",
        tier: "A nép kedvence",
        pieces: "4–5 darab",
        blurb:
          "A legkeresettebb doboz. Streetwear darabok, hoodie-k, cipő esély. Itt kezdődik a buli.",
        badge: "TOP ELADÓ",
      },
      premium: {
        name: "PRÉMIUM",
        tier: "Komolyan veszed",
        pieces: "5–7 darab",
        blurb:
          "Kapucnis felsők, sneakerek, designer kiegészítők. Magasabb tét, nagyobb dobás.",
        badge: "HOT",
      },
      legendas: {
        name: "LEGENDÁS",
        tier: "Csak a bátraknak",
        pieces: "7+ darab",
        blurb:
          "Ritka drop. Limitált sneakerek, designer hoodie-k, az értéke akár 3x a doboz ára.",
        badge: "LIMITÁLT",
      },
    },
  },
  velocity: {
    text: "Gyors szállítás · eredeti termékek · garantált meglepetés ·",
    textSecondary: "Minden doboz más · nyisd ki · oszd meg ·",
  },
  socialProof: {
    kicker: "Valódi nyitások",
    heading: "A dobozok már pörögnek",
    sub: "Instagram és TikTok nyitások a saját csatornáinkról, valós linkekkel.",
    openOn: "Megnyitás itt:",
    screenshotAlt: "review képernyőkép",
  },
  values: {
    items: [
      { title: "TOTÁLIS TITOK", text: "Nem tudod, mi van benne. Ez a lényeg. Amit kapsz, azt kapsz." },
      { title: "BÁRMI LEHET", text: "Ruhák, kiegészítők, kütyük, különlegességek. Nem csak ruha." },
      { title: "GYORS SZÁLLÍTÁS", text: "A dobozod gyorsan megérkezik. Csomagold ki, ne várj." },
    ],
  },
  reviews: [
    { name: "Bence · Budapest", text: "Klasszikus dobozban benne volt egy 25e Ft-os hoodie. Komoly." },
    { name: "Réka · Debrecen", text: "Prémium = 3 darabból kettő rögtön mehetett Instára." },
    { name: "Dani · Szeged", text: "Mini doboz tesztnek tökéletes, már a harmadiknál tartok." },
    { name: "Anna · Pécs", text: "Legendás dobozban sneakert húztam. Még mindig nem hiszem el." },
    { name: "Márk · Győr", text: "Gyors szállítás, brutál csomagolás. Visszatérek." },
  ],
  how: {
    kicker: "4 LÉPÉS",
    heading: "Hogyan működik?",
    steps: [
      { n: "01", title: "VÁLASSZ DOBOZT", text: "" },
      { n: "02", title: "FIZETSZ, MI KÉSZÍTJÜK", text: "Bankkártya, Apple Pay, Google Pay. 2 perc az egész." },
      { n: "03", title: "KISZÁLLÍTJUK, TE VÁRSZ", text: "Dőlj hátra. A dobozod úton van hozzád." },
      { n: "04", title: "KINYITOD, MEGJELÖLSZ", text: "Vedd videóra, posztold és jelölj be minket — 20% kedvezményt kapsz a következő rendelésedre." },
    ],
  },
  bigCta: {
    kicker: "NE OLVASS · NYISS",
    heading: "A DOBOZ\nMOST INDUL",
    hoverHint: "Mozgasd az egeret",
    showBoxes: "MUTASD A DOBOZOKAT →",
    notify: "FELIRATKOZÁS",
  },
  closingFloat: {
    text: "NE TALÁLGASS. NYISD KI.",
  },
  faq: {
    kicker: "GYAKORI KÉRDÉSEK",
    heading: "Még valami?",
    items: [
      { q: "Mi van a dobozban?", a: "Ezt nem tudhatod előre — ez a lényeg. Ruhák, kiegészítők, kütyük, meglepetések. Bármi lehet. A titok nem spoilerezhető." },
      { q: "Választhatok méretet?", a: "Sajnos a méret előre nem választható — ez a mystery box természetéből adódik. Amit ígérünk: csak minőségi, új termékek kerülnek a dobozba. Ha egy ruha mégsem lenne a te méreted, az tökéletes darab lehet ajándéknak, vagy add tovább Vinteden vagy Vaterán — ezek a termékek mind újak, így könnyen el lehet őket adni." },
      { q: "Mi van, ha sérülten érkezik?", a: "Általában a termékek hibátlan állapotban érkeznek, de ha mégis valami sérülten kerülne hozzád, azonnal vedd fel a kapcsolatot ügyfélszolgálatunkkal és megoldjuk." },
      { q: "Mennyi ideig tart a szállítás?", a: "Általában 2–3 munkanap, de a kézbesítési vállalattól függően legfeljebb egy hétig tarthat. Mindig a legmegbízhatóbb megoldást választjuk." },
      { q: "Honnan származnak a termékek?", a: "Termékeink nem átvett, visszaküldött és túlkészletezett csomagokból származnak, amelyek eredetileg olyan nagy webáruházakban kerültek értékesítésre, mint a Shein, Temu, Amazon és más e-kereskedelmi platformok. Ezeket a vegyes tételeket gondosan válogatjuk össze, és a bennük lévő termékekből hozzuk létre Mystery Boxainkat. Mivel minden szállítmány különböző, minden doboz egyedi — ez teszi az unboxingot izgalmassá és kiszámíthatatlanná. Azzal, hogy ezeknek a termékeknek második esélyt adunk, a pazarlás csökkentéséhez és a fenntarthatóbb e-kereskedelem támogatásához is hozzájárulunk." },
      { q: "Mi van, ha nem tetszik a termék?", a: "Biztosak vagyunk benne, hogy imádni fogod — de ha mégsem, lépj kapcsolatba ügyfélszolgálatunkkal és megtaláljuk a legjobb megoldást." },
      { q: "Melyik futárszolgálat szállítja a csomagot?", a: "Ez attól függ, hogy házhoz kéred vagy csomagpontra. Mindig a legjobb elérhető megoldást választjuk, és ha csomagpontra megy, mindig a hozzád legközelebbi pontot jelöljük ki." },
    ],
  },
  faqPage: {
    title: "GYIK",
    intro:
      "Minden, amit a mystery boxokról tudni érdemes — szállítás, méret, tartalom és minden, ami eddig kérdés volt.",
    helpTitle: "Még kérdésed van?",
    helpSub: "Nem találtad meg a válaszod? Írj nekünk, és 24 órán belül válaszolunk.",
    fieldName: "Név",
    fieldEmail: "Email",
    fieldMessage: "Üzenet",
    send: "Írj nekünk!",
    mailFallback: "Megnyitottuk a leveleződ. Ha nem indult el automatikusan, írj ide közvetlenül:",
    breadcrumb: "GYIK",
  },
  about: {
    title: "Rólunk",
    intro: "100% magyar mystery box csapat. Eredeti termékek, valódi meglepetés — semmi extra.",
    goalTitle: "A célunk",
    goalP1:
      "Az AZKOMOLY azért létezik, mert hiszünk abban, hogy a vásárlás lehet izgalmas is, nem csak praktikus. Minden doboz egy kis kockázat és egy nagy meglepetés — te választod a tétet, mi garantáljuk az értéket.",
    goalP2:
      "Nem akarunk még egy webshopot, ahol pontosan tudod, mi érkezik. Azt akarjuk, hogy amikor kibontod a dobozod, tényleg érezd azt a pillanatot — mintha ajándékot kapnál magadtól.",
    whoTitle: "Kik vagyunk",
    whoLead: "100% magyar vállalkozás vagyunk, és minden, amit árulunk, eredeti termék.",
    whoBody:
      "Az AZKOMOLY egy maroknyi magyar csapat ötletéből indult, akiket idegesített, hogy a legtöbb webshopban semmi meglepetés nincs a vásárlásban. Elkezdtünk liquidation és túlkészletezett tételekből válogatni, és mystery boxokba rendezni őket — így minden doboz garantáltan minőségi, eredeti terméket tartalmaz, de sosem tudod pontosan, mit kapsz.",
    badgeHungarian: "100% magyar",
    badgeOriginal: "Eredeti termékek",
    seeBoxes: "Nézd meg a dobozainkat",
    followTitle: "Kövess minket",
    followSub:
      "Kövesd az AZKOMOLY-t a közösségi médiában — minden unboxingot ott osztunk meg elsőként.",
  },
  blog: {
    kicker: "AZKOMOLY BLOG",
    heading: "Cikkek & sztorik",
    sub: "Mystery box tippek, unboxing sztorik és minden, amit a dobozok mögött érdemes tudni.",
    readMore: "Elolvasom",
    backToBlog: "Vissza a bloghoz",
    publishedOn: "Közzétéve",
    empty: "Hamarosan új cikkek…",
    relatedHeading: "Ehhez kapcsolódik",
    relatedShop: "Nézd meg a dobozainkat",
    relatedFaq: "Gyakori kérdések",
  },
  footer: {
    follow: "KÖVESS MINKET",
    products: "Termékek",
    about: "Rólunk",
    faq: "GYIK",
    blog: "Blog",
    privacy: "Adatvédelem",
    terms: "Felhasználási feltételek",
    cookies: "Süti szabályzat",
    tagline: "Mystery box élmény eredeti termékekkel, gyors szállítással és valódi unboxing pillanatokkal.",
    taxNumber: "Adószám",
    companyNumber: "Cégjegyzékszám",
    rights: "Minden jog fenntartva",
  },
  signup: {
    title: "FELIRATKOZÁS",
    name: "Név",
    namePlaceholder: "Név",
    email: "Email",
    emailPlaceholder: "te@email.hu",
    phone: "Telefon",
    optional: "(opcionális)",
    phonePlaceholder: "20 123 4567",
    consentPre: "Elfogadom a ",
    consentTerms: "feltételeket",
    consentMid: " és az ",
    consentPrivacy: "adatvédelmi tájékoztatót",
    consentPost: ". Hozzájárulok, hogy adataimat marketing célokra felhasználjátok.",
    submit: "KÜLDÉS",
    sending: "...",
    successNew: "✅ Bent vagy! Hamarosan nyílik a doboz.",
    successExisting: "✅ Már fent vagy a listán!",
    errorConsent: "El kell fogadnod a feltételeket és az adatvédelmi tájékoztatót.",
    errorGeneric: "Hiba történt. Próbáld újra.",
  },
  discountWidget: {
    title: "KEDVEZMÉNY AZ ELSŐ DOBOZODRA",
    sub: "Hagyd meg az adataid, és elküldjük a kódot.",
    cta: "KÉREM A KÓDOT",
    close: "Bezárás",
  },
  product: {
    back: "Vissza a bolthoz",
    size: "MÉRET",
    addToCart: "KOSÁRBA",
    buyNow: "AZONNALI VÁSÁRLÁS",
    contents: "Tartalom",
    guaranteedValue: "Garantált érték",
    guaranteedValueShort: "Garantált érték",
    inStock: "Készleten",
    units: "db",
    trustBranded: "100% márkás",
    trustShipping: "2–4 nap szállítás",
    trustValue: "Garantált érték",
    notFound: "Nincs ilyen doboz",
    backToShop: "VISSZA A BOLTHOZ",
    errorTitle: "Hiba történt",
    retry: "ÚJRA",
  },
  cookie: {
    title: "SÜTIK / COOKIES",
    body: "Sütiket használunk a weboldal működéséhez, valamint marketing és elemzési célokra. Az „Elfogadom” gombra kattintva hozzájárulsz az adataid marketing célú felhasználásához. Részletek:",
    cookiePolicy: "Süti szabályzat",
    privacy: "Adatvédelem",
    acceptAll: "Elfogadom mindet",
    onlyNecessary: "Csak szükséges",
    settings: "Beállítások",
    settingsTitle: "SÜTI BEÁLLÍTÁSOK",
    necessary: "Szükséges sütik — az oldal működéséhez nélkülözhetetlen. Mindig aktív.",
    analytics: "Elemzési sütik — segítenek megérteni, hogyan használod az oldalt.",
    marketing: "Marketing sütik — személyre szabott ajánlatokhoz és hirdetésekhez.",
    save: "Mentés",
    back: "Vissza",
  },
  cart: {
    title: "Kosár",
    empty: "A kosarad még üres.",
    emptyCta: "Nézd meg a dobozokat",
    size: "Méret",
    subtotal: "Részösszeg",
    shippingNote: "A szállítást a pénztárnál számoljuk ki.",
    checkout: "Tovább a pénztárhoz",
    remove: "Törlés",
    clear: "Kosár ürítése",
    added: "Hozzáadva a kosárhoz",
    count: (n) => `${n} termék`,
  },
  reveal: {
    kicker: "LEZÁRVA · ÚTON HOZZÁD",
    heading: "A doboz a tiéd",
    sub: "Most te nyitod ki.",
    cta: "VÁLASSZ DOBOZT",
  },
  boxSpinner: {
    pick: "VÁLASSZ EGY DOBOZT!",
    sub: "Nyerj kedvezményt az első rendelésre",
    tap: "KATTINTS EGY DOBOZRA",
    congrats: "GRATULÁLUNK! 🎉",
    gateHint: "Add meg az adataid a kód megjelenítéséhez",
    gateName: "Neved",
    gateEmail: "E-mail cím",
    gatePhone: "Telefonszám (nem kötelező)",
    gateSubmit: "MUTASD A KÓDOT →",
    couponLabel: "KUPONKÓD",
    discount: "−10% az első rendelésre",
    copyHint: "Másold ki és add meg a pénztárnál",
    cta: "RENDELJ MOST →",
  },
};

const en: Dict = {
  meta: {
    title: "AZKOMOLY — What's in the box?",
    description:
      "AZKOMOLY mystery box: you don't know what's inside — and that's the point. Pick a box, pay, get it, open it.",
    ogTitle: "AZKOMOLY — What's in the box?",
    ogDescription: "You don't know what's inside. That's the point.",
  },
  nav: { shop: "Shop", merch: "Merch", how: "How it works", about: "About", faq: "FAQ", blog: "Blog", reviews: "Reviews", contact: "Contact", notify: "Subscribe", home: "Home", cart: "Cart", prevSection: "Previous section", nextSection: "Next section", scrollTop: "Back to top", primary: "Main navigation" },
  hero: {
    est: "EST · MMXXVI",
    index: "/01",
    mysteryBox: "MYSTERY · BOX",
    heading: "OPEN\nTHE MYSTERY",
    tagline: "Pick a box. Discover what's inside.",
    rotatingTaglines: [
      "A new surprise every time.",
      "Original streetwear pieces.",
      "No two boxes are the same.",
    ],
    imageAlt: "AZKOMOLY mystery box",
    marquee: "AZKOMOLY · MYSTERY BOX",
    scrollAria: "Scroll to the products",
    scroll: "SCROLL",
    cta: "I WANT TO OPEN MY BOX →",
  },
  promo: {
    live: "DROP #002 · LIVE",
    heading: "New box · Sunday 8 PM",
    sub: "Until it's gone. Limited stock, no restock.",
    days: "DAYS",
    hours: "HRS",
    mins: "MIN",
    secs: "SEC",
  },
  urgency: {
    prefix: "Flash offer ends in:",
    suffix: "",
    ended: "Flash offer ended",
  },
  introVideo: {
    title: "Click if you want to skip",
    copy: "The boxes are right after the video. Hit the X to jump straight in.",
    skip: "Skip intro",
    enter: "TAKE ME TO THE BOXES",
    mute: "Mute",
    unmute: "Turn sound on",
  },
  products: {
    kicker: "PICK YOUR STAKE",
    heading: "Our boxes",
    sub: "The bigger the box, the bigger the hit. Every tier has a guaranteed minimum value.",
    open: "OPEN IT",
    lastUnits: (n) => `LAST ${n} LEFT`,
    inStock: "In stock",
    guaranteedValue: "Guaranteed value",
    contents: "Contents",
    soldOut: "SOLD OUT",
    empty: "New boxes coming soon…",
    showMore: "MORE BOXES",
    showLess: "SHOW LESS",
    previous: "Previous box",
    next: "Next box",
    rarity: { common: "Common", rare: "Rare", epic: "Epic", legendary: "Legendary" },
    items: {
      mini: {
        name: "MINI BOX",
        tier: "Entry level",
        pieces: "2–3 pieces",
        blurb:
          "Your first hit. Tees, caps, small accessories. Guaranteed branded gear, zero risk.",
        badge: "STARTER",
      },
      klasszik: {
        name: "CLASSIC",
        tier: "Crowd favorite",
        pieces: "4–5 pieces",
        blurb:
          "The most wanted box. Streetwear pieces, hoodies, a shot at sneakers. This is where it kicks off.",
        badge: "BEST SELLER",
      },
      premium: {
        name: "PREMIUM",
        tier: "You mean it",
        pieces: "5–7 pieces",
        blurb:
          "Hoodies, sneakers, designer accessories. Higher stakes, bigger hit.",
        badge: "HOT",
      },
      legendas: {
        name: "LEGENDARY",
        tier: "For the brave only",
        pieces: "7+ pieces",
        blurb:
          "Rare drop. Limited sneakers, designer hoodies — value up to 3x the box price.",
        badge: "LIMITED",
      },
    },
  },
  velocity: {
    text: "Fast shipping · original products · guaranteed surprise ·",
    textSecondary: "Every box is different · open it · share it ·",
  },
  socialProof: {
    kicker: "Real unboxings",
    heading: "The boxes are already moving",
    sub: "Instagram and TikTok unboxings from our own channels, linked to the real posts.",
    openOn: "Open on",
    screenshotAlt: "review screenshot",
  },
  values: {
    items: [
      { title: "TOTAL MYSTERY", text: "You don't know what's inside. That's the whole point. What you get, you get." },
      { title: "ANYTHING INSIDE", text: "Clothes, accessories, gadgets, collectibles. All kinds of stuff." },
      { title: "FAST SHIPPING", text: "Your box arrives fast. No waiting around — just open it." },
    ],
  },
  reviews: [
    { name: "Bence · Budapest", text: "My Classic box had a 25k HUF hoodie in it. No joke." },
    { name: "Réka · Debrecen", text: "Premium = two of three pieces went straight to Instagram." },
    { name: "Dani · Szeged", text: "Mini box is perfect to test — I'm already on my third." },
    { name: "Anna · Pécs", text: "Pulled sneakers from a Legendary box. Still can't believe it." },
    { name: "Márk · Győr", text: "Fast shipping, insane packaging. I'm coming back." },
  ],
  how: {
    kicker: "4 STEPS",
    heading: "How does it work?",
    steps: [
      { n: "01", title: "CHOOSE A BOX", text: "" },
      { n: "02", title: "YOU PAY, WE PREPARE", text: "Card, Apple Pay, Google Pay. Takes 2 minutes." },
      { n: "03", title: "WE SHIP, YOU WAIT", text: "Sit back. Your box is on its way." },
      { n: "04", title: "YOU OPEN, TAG US", text: "Film it, post it and tag us — you get 20% off your next order." },
    ],
  },
  bigCta: {
    kicker: "DON'T READ · OPEN",
    heading: "THE BOX\nDROPS NOW",
    hoverHint: "Move your cursor",
    showBoxes: "SHOW ME THE BOXES →",
    notify: "SUBSCRIBE",
  },
  closingFloat: {
    text: "STOP GUESSING. OPEN IT.",
  },
  faq: {
    kicker: "FREQUENT QUESTIONS",
    heading: "Anything else?",
    items: [
      { q: "What's in the box?", a: "That's exactly what you can't know upfront. Clothes, accessories, gadgets, random finds — anything goes. The unknown is the whole point." },
      { q: "Can I choose my size?", a: "Unfortunately, size selection isn't possible — that's part of the mystery box experience. What we can promise is that every item inside is brand new and good quality. If a clothing piece isn't your size, it makes a great gift, or you can easily resell it on Vinted or similar platforms — since everything is new, it goes fast." },
      { q: "What if something arrives damaged?", a: "Items almost always arrive in perfect condition. But if something does arrive damaged, just reach out to our customer support team and we'll sort it out straight away." },
      { q: "How long does shipping take?", a: "Usually 2–3 business days, but depending on the delivery company it can take up to a week. We always choose the most reliable option available." },
      { q: "Where are the products from?", a: "Our products come from unclaimed, returned, and overstock parcels originally sold by major online retailers such as Shein, Temu, Amazon, and other e-commerce platforms. These parcels may include orders that were never collected, deliveries that could not be completed, customer returns, or excess inventory. Instead of being discarded, the items are grouped into bulk containers and resold through liquidation channels. We carefully source these mixed lots and create our Mystery Boxes from the products inside. Because every shipment is different, each Mystery Box contains a unique selection of items, making every unboxing experience exciting and unpredictable. By giving these products a second chance, we also help reduce waste and support a more sustainable approach to e-commerce." },
      { q: "What if I don't like my product?", a: "We're confident you'll love what's inside — but if you don't, reach out to our customer support team and we'll find the best solution for you." },
      { q: "Which delivery company will bring my order?", a: "It depends on whether you choose home delivery or a pickup point. Either way, we always select the best available option — and if it's a pickup point, we assign the one closest to your address." },
    ],
  },
  faqPage: {
    title: "FAQ",
    intro:
      "Everything worth knowing about the mystery boxes — shipping, sizing, contents and anything else you've been wondering about.",
    helpTitle: "Still need help?",
    helpSub: "Didn't find your answer? Write to us and we'll reply within 24 hours.",
    fieldName: "Name",
    fieldEmail: "Email",
    fieldMessage: "Message",
    send: "Email us!",
    mailFallback: "We opened your mail app. If it didn't start automatically, write to us directly:",
    breadcrumb: "FAQ",
  },
  about: {
    title: "About Us",
    intro: "100% Hungarian mystery box crew. Original products, real surprises — nothing else.",
    goalTitle: "Our Goal",
    goalP1:
      "AZKOMOLY exists because we believe shopping can be exciting, not just practical. Every box is a small risk and a big surprise — you set the stake, we guarantee the value.",
    goalP2:
      "We don't want to be one more webshop where you know exactly what shows up. We want that moment when you open your box to feel real — like a gift from yourself.",
    whoTitle: "Who We Are",
    whoLead: "We're a 100% Hungarian business, and everything we sell is an original product.",
    whoBody:
      "AZKOMOLY started with a handful of Hungarians who were tired of shopping with zero surprise in it. We began sourcing liquidation and overstock lots and turning them into mystery boxes — so every box holds genuine, quality products, but you never know exactly what you'll get.",
    badgeHungarian: "100% Hungarian",
    badgeOriginal: "Original products",
    seeBoxes: "See our boxes",
    followTitle: "Follow Us",
    followSub: "Follow AZKOMOLY on social — every unboxing lands there first.",
  },
  blog: {
    kicker: "AZKOMOLY BLOG",
    heading: "Articles & stories",
    sub: "Mystery box tips, unboxing stories, and everything worth knowing behind the boxes.",
    readMore: "Read more",
    backToBlog: "Back to the blog",
    publishedOn: "Published on",
    empty: "New articles coming soon…",
    relatedHeading: "Related",
    relatedShop: "Check out our boxes",
    relatedFaq: "Frequently asked questions",
  },
  footer: {
    follow: "FOLLOW US",
    products: "Products",
    about: "About",
    faq: "FAQ",
    blog: "Blog",
    privacy: "Privacy",
    terms: "Terms of use",
    cookies: "Cookie policy",
    tagline: "Mystery box energy with original products, fast shipping, and real unboxing moments.",
    taxNumber: "Tax number",
    companyNumber: "Company registration number",
    rights: "All rights reserved",
  },
  signup: {
    title: "SUBSCRIBE",
    name: "Name",
    namePlaceholder: "Name",
    email: "Email",
    emailPlaceholder: "you@email.com",
    phone: "Phone",
    optional: "(optional)",
    phonePlaceholder: "20 123 4567",
    consentPre: "I accept the ",
    consentTerms: "terms",
    consentMid: " and the ",
    consentPrivacy: "privacy policy",
    consentPost: ". I consent to my data being used for marketing purposes.",
    submit: "SEND",
    sending: "...",
    successNew: "✅ You're in! The box opens soon.",
    successExisting: "✅ You're already on the list!",
    errorConsent: "You must accept the terms and the privacy policy.",
    errorGeneric: "Something went wrong. Try again.",
  },
  discountWidget: {
    title: "A DISCOUNT ON YOUR FIRST BOX",
    sub: "Leave your details and we'll send you the code.",
    cta: "SEND ME THE CODE",
    close: "Close",
  },
  product: {
    back: "Back to shop",
    size: "SIZE",
    addToCart: "ADD TO CART",
    buyNow: "BUY NOW",
    contents: "Contents",
    guaranteedValue: "Guaranteed value",
    guaranteedValueShort: "Guaranteed value",
    inStock: "In stock",
    units: "pcs",
    trustBranded: "100% branded",
    trustShipping: "2–4 day shipping",
    trustValue: "Guaranteed value",
    notFound: "No such box",
    backToShop: "BACK TO SHOP",
    errorTitle: "Something went wrong",
    retry: "RETRY",
  },
  cookie: {
    title: "COOKIES",
    body: "We use cookies to run the website and for marketing and analytics purposes. By clicking “Accept” you consent to your data being used for marketing. Details:",
    cookiePolicy: "Cookie policy",
    privacy: "Privacy",
    acceptAll: "Accept all",
    onlyNecessary: "Necessary only",
    settings: "Settings",
    settingsTitle: "COOKIE SETTINGS",
    necessary: "Necessary cookies — essential for the site to work. Always on.",
    analytics: "Analytics cookies — help us understand how you use the site.",
    marketing: "Marketing cookies — for personalized offers and ads.",
    save: "Save",
    back: "Back",
  },
  cart: {
    title: "Cart",
    empty: "Your cart is empty.",
    emptyCta: "Browse the boxes",
    size: "Size",
    subtotal: "Subtotal",
    shippingNote: "Shipping calculated at checkout.",
    checkout: "Checkout",
    remove: "Remove",
    clear: "Clear cart",
    added: "Added to cart",
    count: (n) => `${n} item${n === 1 ? "" : "s"}`,
  },
  reveal: {
    kicker: "SEALED · ON ITS WAY",
    heading: "The box is yours",
    sub: "Now you open it.",
    cta: "PICK A BOX",
  },
  boxSpinner: {
    pick: "PICK A BOX!",
    sub: "Win a discount on your first order",
    tap: "CLICK A BOX",
    congrats: "CONGRATULATIONS! 🎉",
    gateHint: "Enter your details to reveal your code",
    gateName: "Your name",
    gateEmail: "Email address",
    gatePhone: "Phone number (optional)",
    gateSubmit: "SHOW MY CODE →",
    couponLabel: "COUPON CODE",
    discount: "−10% on your first order",
    copyHint: "Copy it and enter it at checkout",
    cta: "ORDER NOW →",
  },
};

export const DICTIONARIES: Record<Lang, Dict> = { hu, en };
