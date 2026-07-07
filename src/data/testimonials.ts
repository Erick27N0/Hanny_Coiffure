export type Testimonial = {
  name: string;
  role: string;
  quote: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Aminata D.",
    role: "Cliente fidèle",
    quote:
      "Hanny a des mains en or. Mes box braids tiennent parfaitement et le salon est un vrai cocon.",
  },
  {
    name: "Sophie L.",
    role: "Patiente accompagnée",
    quote:
      "Après mon traitement, Hanny m'a aidée à choisir une perruque médicale qui me ressemble vraiment. Tout a été simple, y compris la prise en charge Sécu.",
  },
  {
    name: "Karine M.",
    role: "Cliente",
    quote:
      "Conseils personnalisés, qualité des cheveux irréprochable. Je recommande les yeux fermés.",
  },
];
