export const salonInfo = {
  name: "Hanny Tresse",
  tagline: "Coiffure afro & perruques médicalisées à Perpignan",
  address: {
    street: "Adresse à confirmer",
    city: "66000 Perpignan",
  },
  phone: "+33 6 00 00 00 00",
  phoneDisplay: "06 00 00 00 00",
  whatsapp: "33600000000",
  email: "contact@hannytresse.fr",
  hours: [
    { day: "Lundi", value: "Fermé" },
    { day: "Mardi - Vendredi", value: "9h00 – 19h00" },
    { day: "Samedi", value: "9h00 – 18h00" },
    { day: "Dimanche", value: "Fermé" },
  ],
  social: {
    facebook: "https://facebook.com/",
    instagram: "https://www.instagram.com/",
  },
};

export const whatsappLink = (message = "Bonjour, je souhaite prendre rendez-vous.") =>
  `https://wa.me/${salonInfo.whatsapp}?text=${encodeURIComponent(message)}`;
