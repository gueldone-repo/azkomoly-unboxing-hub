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
    how: string;
    faq: string;
    notify: string;
  };
  hero: {
    est: string;
    index: string;
    mysteryBox: string;
    tagline: string;
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
  products: {
    kicker: string;
    heading: string;
    sub: string;
    open: string;
    lastUnits: (n: number) => string;
    inStock: string;
    guaranteedValue: string;
    contents: string;
    rarity: { common: string; rare: string; epic: string; legendary: string };
    items: Record<string, ProductCopy>;
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
    showBoxes: string;
    notify: string;
  };
  faq: {
    kicker: string;
    heading: string;
    items: { q: string; a: string }[];
  };
  footer: {
    follow: string;
    privacy: string;
    terms: string;
    cookies: string;
    rights: string;
  };
  signup: {
    title: string;
    name: string;
    namePlaceholder: string;
    email: string;
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
      "AZKOMOLY mystery box: márkás ruhák, véletlenszerű tartalom, nevetséges áron. Válassz dobozt, fizess, kapd meg, nyisd ki.",
    ogTitle: "AZKOMOLY — Mi van a dobozban?",
    ogDescription: "Márkás ruhák. Véletlenszerű tartalom. Nevetséges áron.",
  },
  nav: { shop: "Bolt", how: "Hogyan működik", faq: "GYIK", notify: "Értesíts" },
  hero: {
    est: "EST · MMXXVI",
    index: "/01",
    mysteryBox: "MYSTERY · BOX",
    tagline: "Márkás ruhák. Véletlenszerű tartalom. Nevetséges áron.",
    scroll: "GÖRGESS",
    cta: "Légy az első, aki felfedi a titkot",
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
  products: {
    kicker: "VÁLASZD A TÉTEDET",
    heading: "A dobozaink",
    sub: "Minél nagyobb a doboz, annál nagyobb a dobás. Minden tier garantált minimum értékkel.",
    open: "MEGNYITOM",
    lastUnits: (n) => `UTOLSÓ ${n} DB`,
    inStock: "Készleten",
    guaranteedValue: "Garantált érték",
    contents: "Tartalom",
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
  values: {
    items: [
      { title: "100% MÁRKÁS", text: "Csak igazolt brand cucc. Nincs gagyi, nincs replika." },
      { title: "GARANTÁLT ÉRTÉK", text: "Minden doboz tartalmának értéke meghaladja az árát." },
      { title: "GYORS SZÁLLÍTÁS", text: "2–4 munkanap egész Magyarországon. Foxpost / GLS." },
      { title: "14 NAP GARANCIA", text: "Ha valami sérült érkezik, cseréljük. Egyszerűen." },
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
      { n: "01", title: "VÁLASSZ DOBOZT", text: "Mini, Klasszikus, Prémium vagy Legendás. Te döntöd el a tétet." },
      { n: "02", title: "FIZESS", text: "Bankkártya, Apple Pay, Google Pay. 2 perc az egész." },
      { n: "03", title: "VÁRJ 2–4 NAPOT", text: "Becsomagoljuk, elküldjük, jön a postás." },
      { n: "04", title: "NYISD KI", text: "Vedd fel kamerával. Posztold. Címkézz be minket." },
    ],
  },
  bigCta: {
    kicker: "NE OLVASS · NYISS",
    heading: "AZ ELSŐ DOBOZ\nMOST INDUL",
    showBoxes: "MUTASD A DOBOZOKAT →",
    notify: "ÉRTESÍTSETEK",
  },
  faq: {
    kicker: "GYAKORI KÉRDÉSEK",
    heading: "Még valami?",
    items: [
      { q: "Mi van a dobozban?", a: "Márkás ruhák és kiegészítők. A tartalom véletlenszerű, de minden doboz minimum érték garantált — a tartalom értéke meghaladja a doboz árát." },
      { q: "Választhatok méretet?", a: "Igen. A vásárlás során megadod a méreted (S/M/L/XL), és csak abban a méretben kapsz ruhát." },
      { q: "Mi van, ha nem tetszik?", a: "14 napon belül visszaküldheted bontatlanul. Sérült termék esetén cseréljük." },
      { q: "Mennyi a szállítás?", a: "Foxpost: 1490 Ft. GLS házhoz: 1990 Ft. 20.000 Ft feletti rendelés ingyenes." },
      { q: "Mikor érkeznek új dobozok?", a: "Minden vasárnap 20:00-kor új drop. Iratkozz fel, hogy elsőként szólj." },
    ],
  },
  footer: {
    follow: "KÖVESS MINKET",
    privacy: "Adatvédelem",
    terms: "Felhasználási feltételek",
    cookies: "Süti szabályzat",
    rights: "Minden jog fenntartva",
  },
  signup: {
    title: "FELIRATKOZÁS",
    name: "Név",
    namePlaceholder: "Név",
    email: "Email",
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
      "AZKOMOLY mystery box: branded clothing, random contents, ridiculous prices. Pick a box, pay, get it, open it.",
    ogTitle: "AZKOMOLY — What's in the box?",
    ogDescription: "Branded clothing. Random contents. Ridiculous prices.",
  },
  nav: { shop: "Shop", how: "How it works", faq: "FAQ", notify: "Notify me" },
  hero: {
    est: "EST · MMXXVI",
    index: "/01",
    mysteryBox: "MYSTERY · BOX",
    tagline: "Branded clothing. Random contents. Ridiculous prices.",
    scroll: "SCROLL",
    cta: "Be the first to reveal the secret",
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
  products: {
    kicker: "PICK YOUR STAKE",
    heading: "Our boxes",
    sub: "The bigger the box, the bigger the hit. Every tier has a guaranteed minimum value.",
    open: "OPEN IT",
    lastUnits: (n) => `LAST ${n} LEFT`,
    inStock: "In stock",
    guaranteedValue: "Guaranteed value",
    contents: "Contents",
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
  values: {
    items: [
      { title: "100% BRANDED", text: "Verified brand gear only. No junk, no replicas." },
      { title: "GUARANTEED VALUE", text: "Every box's contents are worth more than its price." },
      { title: "FAST SHIPPING", text: "2–4 business days across Hungary. Foxpost / GLS." },
      { title: "14-DAY GUARANTEE", text: "If something arrives damaged, we replace it. Simple." },
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
      { n: "01", title: "PICK A BOX", text: "Mini, Classic, Premium or Legendary. You set the stake." },
      { n: "02", title: "PAY", text: "Card, Apple Pay, Google Pay. Takes 2 minutes." },
      { n: "03", title: "WAIT 2–4 DAYS", text: "We pack it, ship it, the courier comes." },
      { n: "04", title: "OPEN IT", text: "Film it. Post it. Tag us." },
    ],
  },
  bigCta: {
    kicker: "DON'T READ · OPEN",
    heading: "THE FIRST BOX\nDROPS NOW",
    showBoxes: "SHOW ME THE BOXES →",
    notify: "NOTIFY ME",
  },
  faq: {
    kicker: "FREQUENT QUESTIONS",
    heading: "Anything else?",
    items: [
      { q: "What's in the box?", a: "Branded clothing and accessories. The contents are random, but every box has a guaranteed minimum value — the contents are worth more than the box price." },
      { q: "Can I choose my size?", a: "Yes. During checkout you pick your size (S/M/L/XL), and you only get clothes in that size." },
      { q: "What if I don't like it?", a: "You can return it unopened within 14 days. Damaged items get replaced." },
      { q: "How much is shipping?", a: "Foxpost: 1490 HUF. GLS to your door: 1990 HUF. Free over 20,000 HUF." },
      { q: "When do new boxes drop?", a: "New drop every Sunday at 8 PM. Subscribe to be the first to know." },
    ],
  },
  footer: {
    follow: "FOLLOW US",
    privacy: "Privacy",
    terms: "Terms of use",
    cookies: "Cookie policy",
    rights: "All rights reserved",
  },
  signup: {
    title: "SUBSCRIBE",
    name: "Name",
    namePlaceholder: "Name",
    email: "Email",
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
    couponLabel: "COUPON CODE",
    discount: "−10% on your first order",
    copyHint: "Copy it and enter it at checkout",
    cta: "ORDER NOW →",
  },
};

export const DICTIONARIES: Record<Lang, Dict> = { hu, en };
