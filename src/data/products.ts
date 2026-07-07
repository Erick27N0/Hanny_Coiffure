const wig1 = "https://images.unsplash.com/photo-1595642527925-4d41cb00e6d2?q=80&w=600&auto=format&fit=crop";
const wig2 = "https://images.unsplash.com/photo-1565728741221-2131810c27f6?q=80&w=600&auto=format&fit=crop";
const extensions = "https://images.unsplash.com/photo-1605497746444-17366d419356?q=80&w=600&auto=format&fit=crop";
const care = "https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=600&auto=format&fit=crop";

export type Product = {
  slug: string;
  name: string;
  category: "Perruques médicales" | "Perruques" | "Extensions" | "Soins";
  shortDescription: string;
  description: string;
  hairType: string;
  length: string;
  price: number;
  inStock: boolean;
  image: string;
  highlights: string[];
};

export const products: Product[] = [
  {
    slug: "perruque-medicale-lisse-mid",
    name: "Perruque médicale — Lisse mi-longue",
    category: "Perruques médicales",
    shortDescription: "Cheveux naturels, monture confort respirante.",
    description:
      "Perruque médicale en cheveux naturels remy, monture lace front réglable, particulièrement adaptée après traitement oncologique. Éligible au remboursement Sécurité sociale (LPPR).",
    hairType: "Cheveux naturels Remy",
    length: "35 cm",
    price: 690,
    inStock: true,
    image: wig1,
    highlights: ["Éligible Sécu", "Lace front", "Monture respirante", "Pose offerte"],
  },
  {
    slug: "perruque-medicale-bouclee",
    name: "Perruque médicale — Bouclée volumineuse",
    category: "Perruques médicales",
    shortDescription: "Bouclage afro naturel, confort longue durée.",
    description:
      "Perruque médicale bouclée, fibres premium texture afro, monture anti-allergique. Conseil personnalisé en salon pour adaptation à la morphologie.",
    hairType: "Fibres premium texture 3C/4A",
    length: "30 cm",
    price: 520,
    inStock: true,
    image: wig2,
    highlights: ["Éligible Sécu", "Texture afro", "Monture hypoallergénique"],
  },
  {
    slug: "extensions-wavy-bundles",
    name: "Extensions wavy — Lot 3 bundles",
    category: "Extensions",
    shortDescription: "Cheveux 100% naturels, ondulation douce.",
    description:
      "Lot de 3 bundles de cheveux 100% naturels, ondulation wavy, pour un tissage volumineux et soyeux. Disponible en plusieurs longueurs sur demande.",
    hairType: "100% cheveux naturels",
    length: "40 / 45 / 50 cm",
    price: 240,
    inStock: true,
    image: extensions,
    highlights: ["3 bundles", "Réutilisable", "Coloration possible"],
  },
  {
    slug: "extensions-straight-bundles",
    name: "Extensions lisses — Lot 3 bundles",
    category: "Extensions",
    shortDescription: "Lisse soyeux, idéal pour tissage cousu.",
    description:
      "Bundles lisses brillants, parfaits pour un rendu sleek. Densité régulière et trame solide.",
    hairType: "100% cheveux naturels",
    length: "40 / 45 / 50 cm",
    price: 230,
    inStock: false,
    image: extensions,
    highlights: ["3 bundles", "Trame renforcée"],
  },
  {
    slug: "soin-huile-fortifiante",
    name: "Huile fortifiante cuir chevelu",
    category: "Soins",
    shortDescription: "Ricin, romarin, jojoba — pour favoriser la pousse.",
    description:
      "Sérum capillaire formulé à base d'huile de ricin, romarin et jojoba. À appliquer 2 à 3 fois par semaine en massage du cuir chevelu.",
    hairType: "Tous types",
    length: "100 ml",
    price: 24,
    inStock: true,
    image: care,
    highlights: ["Naturel", "Made in France"],
  },
  {
    slug: "soin-masque-nourrissant",
    name: "Masque nourrissant intense",
    category: "Soins",
    shortDescription: "Beurre de karité & huile d'argan, hydratation profonde.",
    description:
      "Masque réparateur pour cheveux secs, abîmés ou tressés. Restaure souplesse et brillance dès la première application.",
    hairType: "Cheveux secs & abîmés",
    length: "250 ml",
    price: 32,
    inStock: true,
    image: care,
    highlights: ["Sans sulfates", "Karité bio"],
  },
];

export const getProductBySlug = (slug: string) =>
  products.find((p) => p.slug === slug);

export const productCategories = [
  "Toutes",
  "Perruques médicales",
  "Extensions",
  "Soins",
] as const;
