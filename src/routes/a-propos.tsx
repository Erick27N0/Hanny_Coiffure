import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Clock, Facebook, Instagram } from "lucide-react";
import { salonInfo } from "@/data/salonInfo";
import { CTASection } from "@/components/cta-section";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos — Le salon Hanny Tresse à Perpignan" },
      {
        name: "description",
        content:
          "Découvrez l'histoire, les valeurs et le salon Hanny Tresse à Perpignan : expertise afro et accompagnement perruques médicales.",
      },
      { property: "og:title", content: "À propos — Hanny Tresse Perpignan" },
      {
        property: "og:description",
        content: "L'histoire et les valeurs du salon Hanny Tresse à Perpignan.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="container mx-auto px-4 pt-14 md:px-6 md:pt-20">
        <p className="text-xs uppercase tracking-[0.2em] text-secondary font-bold">Le salon</p>
        <h1 className="mt-3 max-w-3xl font-sans font-bold text-4xl text-primary md:text-5xl">
          Hanny, coiffeuse passionnée et accompagnante avant tout.
        </h1>
        <p className="mt-5 max-w-2xl text-muted-foreground leading-relaxed">
          Installée à Perpignan, Hanny met son savoir-faire au service de la beauté
          afro et de l'accompagnement des patientes en perte de cheveux. Le salon
          est pensé comme un cocon : un endroit où l'on prend le temps d'écouter,
          de conseiller et de prendre soin.
        </p>
      </section>

      <section className="container mx-auto grid gap-10 px-4 py-14 md:grid-cols-3 md:px-6">
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h3 className="font-sans font-bold text-lg text-primary">Écoute</h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Chaque rendez-vous commence par une vraie conversation pour comprendre
            vos envies, vos contraintes et votre cuir chevelu.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h3 className="font-sans font-bold text-lg text-primary">Expertise</h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Formée aux techniques afro et aux prothèses capillaires médicales,
            Hanny actualise régulièrement ses compétences.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h3 className="font-sans font-bold text-lg text-primary">Bienveillance</h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Un espace privé pour les essayages de perruques, sans jugement, à
            votre rythme.
          </p>
        </div>
      </section>

      <section className="bg-slate-50 py-16 md:py-20 border-y border-border">
        <div className="container mx-auto grid gap-10 px-4 md:grid-cols-2 md:px-6">
          <div>
            <h2 className="font-sans font-bold text-3xl text-primary">Nous trouver</h2>
            <div className="mt-5 space-y-3 text-sm">
              <p className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 text-secondary" />
                <span className="font-medium">
                  {salonInfo.address.street}
                  <br />
                  {salonInfo.address.city}
                </span>
              </p>
              <div className="flex items-start gap-2 text-muted-foreground">
                <Clock className="mt-0.5 h-4 w-4 text-secondary" />
                <ul className="space-y-0.5 font-medium">
                  {salonInfo.hours.map((h) => (
                    <li key={h.day}>
                      <span className="text-foreground/80 font-bold">{h.day}</span> — {h.value}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-4 pt-2">
                <a
                  href={salonInfo.social.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-secondary font-medium"
                >
                  <Facebook className="h-4 w-4" /> Facebook
                </a>
                 <a
                  href={salonInfo.social.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-secondary font-medium"
                >
                  <Instagram className="h-4 w-4" /> Instagram
                </a>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-border bg-white shadow-sm h-72 md:h-auto">
            <iframe
              title="Plan d'accès Hanny Tresse"
              src="https://www.openstreetmap.org/export/embed.html?bbox=2.8800%2C42.6900%2C2.9200%2C42.7100&layer=mapnik"
              className="h-full w-full"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <CTASection
        title="Prête à venir au salon ?"
        description="Réservez votre rendez-vous : nous vous accueillons avec plaisir."
        secondaryLabel="Voir nos prestations"
        secondaryTo="/coiffure-afro"
      />
    </>
  );
}
