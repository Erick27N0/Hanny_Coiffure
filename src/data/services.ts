export type Service = {
  id: string;
  name: string;
  category: "Tresses" | "Tissages" | "Extensions" | "Soins" | "Locks";
  description: string;
  durationMinutes: number;
  priceFrom: number;
};

export const services: Service[] = [
  {
    id: "box-braids",
    name: "Box braids",
    category: "Tresses",
    description: "Tresses classiques rectangulaires, longueur et épaisseur au choix.",
    durationMinutes: 300,
    priceFrom: 120,
  },
  {
    id: "knotless-braids",
    name: "Knotless braids",
    category: "Tresses",
    description: "Tresses sans nœud, plus légères et respectueuses du cuir chevelu.",
    durationMinutes: 360,
    priceFrom: 150,
  },
  {
    id: "twists-senegalais",
    name: "Twists sénégalais",
    category: "Tresses",
    description: "Twists élégants à mèches longues, finition impeccable.",
    durationMinutes: 300,
    priceFrom: 130,
  },
  {
    id: "tissage-cousu",
    name: "Tissage cousu",
    category: "Tissages",
    description: "Tissage cousu main sur tresses, naturel et longue tenue.",
    durationMinutes: 180,
    priceFrom: 90,
  },
  {
    id: "tissage-colle",
    name: "Tissage à la colle",
    category: "Tissages",
    description: "Pose rapide pour un volume immédiat, sans tension.",
    durationMinutes: 120,
    priceFrom: 70,
  },
  {
    id: "extensions-keratine",
    name: "Extensions à la kératine",
    category: "Extensions",
    description: "Extensions discrètes posées mèche par mèche pour un rendu naturel.",
    durationMinutes: 180,
    priceFrom: 200,
  },
  {
    id: "locks-entretien",
    name: "Entretien locks",
    category: "Locks",
    description: "Retouche des racines, lavage et soin profond.",
    durationMinutes: 120,
    priceFrom: 60,
  },
  {
    id: "soin-cuir-chevelu",
    name: "Soin cuir chevelu",
    category: "Soins",
    description: "Diagnostic, gommage, masque nourrissant et massage.",
    durationMinutes: 60,
    priceFrom: 40,
  },
];

export const formatDuration = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h}h`;
  return `${h}h${m}`;
};
