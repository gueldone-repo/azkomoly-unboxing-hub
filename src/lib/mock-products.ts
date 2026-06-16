export type MockProduct = {
  id: string;
  slug: string;
  name: string;
  tier: string;
  price: number; // HUF
  compareAt?: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  pieces: string;
  blurb: string;
  badge?: string;
  accent: "fire" | "cardboard" | "bone";
  stock: number;
  image: string;
};

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: "mini",
    slug: "mini-doboz",
    name: "MINI DOBOZ",
    tier: "Belépő szint",
    price: 9990,
    compareAt: 14990,
    rarity: "common",
    pieces: "2–3 darab",
    blurb:
      "Az első adagod. Pólók, sapkák, kis kiegészítők. Garantált márkás cucc, nulla ráhatás.",
    badge: "STARTER",
    accent: "cardboard",
    stock: 120,
    image: "/Floating_cardboard_box_AZKOMOLY_…_202606092122.jpeg",
  },
  {
    id: "klasszik",
    slug: "klasszikus",
    name: "KLASSZIKUS",
    tier: "A nép kedvence",
    price: 19990,
    compareAt: 29990,
    rarity: "rare",
    pieces: "4–5 darab",
    blurb:
      "A legkeresettebb doboz. Streetwear darabok, hoodie-k, cipő esély. Itt kezdődik a buli.",
    badge: "TOP ELADÓ",
    accent: "fire",
    stock: 64,
    image: "/Floating_cardboard_box_AZKOMOLY_…_202606092122.jpeg",
  },
  {
    id: "premium",
    slug: "premium",
    name: "PRÉMIUM",
    tier: "Komolyan veszed",
    price: 39990,
    compareAt: 59990,
    rarity: "epic",
    pieces: "5–7 darab",
    blurb:
      "Kapucnis felsők, sneakerek, designer kiegészítők. Magasabb tét, nagyobb dobás.",
    badge: "HOT",
    accent: "fire",
    stock: 24,
    image: "/Floating_cardboard_box_AZKOMOLY_…_202606092122.jpeg",
  },
  {
    id: "legendas",
    slug: "legendas",
    name: "LEGENDÁS",
    tier: "Csak a bátraknak",
    price: 79990,
    compareAt: 129990,
    rarity: "legendary",
    pieces: "7+ darab",
    blurb:
      "Ritka drop. Limitált sneakerek, designer hoodie-k, az értéke akár 3x a doboz ára.",
    badge: "LIMITÁLT",
    accent: "bone",
    stock: 6,
    image: "/Floating_cardboard_box_AZKOMOLY_…_202606092122.jpeg",
  },
];

export const formatHUF = (n: number) =>
  new Intl.NumberFormat("hu-HU", { maximumFractionDigits: 0 }).format(n) + " Ft";
