import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Scissors, HeartHandshake, Sparkles, ShieldCheck, MapPin, Star } from "lucide-react";
import { StepsList } from "@/components/steps-list";
import { CTASection } from "@/components/cta-section";
import { testimonials } from "@/data/testimonials";

const heroImg = "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1200&auto=format&fit=crop";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hanny Tresse — Salon de coiffure afro & perruques médicalisées à Perpignan" },
      {
        name: "description",
        content:
          "Tresses, tissages, extensions et perruques médicales avec prise en charge Sécu. Salon Hanny Tresse, Perpignan.",
      },
      { property: "og:title", content: "Hanny Tresse — Salon de coiffure afro à Perpignan" },
      {
        property: "og:description",
        content:
          "Expertise coiffure afro & perruques médicales remboursées par la Sécurité sociale.",
      },
    ],
  }),
  component: Index,
});

const specialties = [
  {
    icon: Scissors,
    title: "Coiffure afro",
    desc: "Tresses, twists, tissages, extensions, locks — réalisés avec soin et précision.",
    to: "/coiffure-afro" as const,
  },
  {
    icon: HeartHandshake,
    title: "Perruques médicalisées",
    desc: "Accompagnement bienveillant et prise en charge Sécurité sociale.",
    to: "/perruques-medicalisees" as const,
  },
  {
    icon: Sparkles,
    title: "Soins du cuir chevelu",
    desc: "Diagnostic personnalisé, soins nourrissants et conseils experts.",
    to: "/coiffure-afro" as const,
  },
];

const reasons = [
  { icon: MapPin, title: "Expertise locale", desc: "Un savoir-faire reconnu à Perpignan." },
  { icon: HeartHandshake, title: "Accompagnement personnalisé", desc: "Une écoute attentive à chaque étape." },
  { icon: ShieldCheck, title: "Prise en charge Sécu", desc: "Tiers payant pour les perruques de classe I." },
  { icon: Sparkles, title: "Qualité des cheveux", desc: "Sélection rigoureuse de produits premium." },
];

const securitySteps = [
  { title: "Ordonnance", description: "Votre médecin ou oncologue vous prescrit une prothèse capillaire." },
  { title: "Rendez-vous", description: "Nous fixons un essayage privé et bienveillant en salon." },
  { title: "Choix & ajustement", description: "Vous essayez plusieurs modèles, nous ajustons à votre morphologie." },
  { title: "Tiers payant", description: "Nous gérons le remboursement Sécu, sans avance de frais (classe I)." },
];

function Index() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto grid gap-10 px-4 pb-16 pt-10 md:grid-cols-2 md:items-center md:gap-16 md:px-6 md:pt-16 lg:pb-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-1 text-xs uppercase tracking-[0.18em] text-secondary font-semibold">
              <Star className="h-3 w-3 text-secondary fill-current" /> Salon Perpignan
            </span>
            <h1 className="mt-5 font-sans font-bold text-4xl leading-[1.05] tracking-tight text-primary md:text-6xl">
              La beauté de vos cheveux,{" "}
              <span className="text-secondary font-bold">avec cœur et expertise.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base text-muted-foreground md:text-lg leading-relaxed">
              Coiffure afro, extensions et perruques médicalisées avec prise en charge
              Sécurité sociale. Un salon qui prend soin de vous, vraiment.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/contact">Prendre rendez-vous</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/perruques-medicalisees">Découvrir les perruques médicales</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-3 -z-10 rounded-lg bg-gradient-to-br from-secondary/20 via-primary/10 to-transparent blur-2xl" />
            <img
              src={heroImg}
              alt="Hanny Tresse, salon de coiffure afro à Perpignan"
              width={1600}
              height={1024}
              className="aspect-[5/4] w-full rounded-lg object-cover shadow-sm border border-border"
            />
          </div>
        </div>
      </section>

      {/* Specialties */}
      <section className="container mx-auto px-4 py-16 md:px-6 md:py-24">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-secondary font-bold">Nos spécialités</p>
          <h2 className="mt-2 font-sans font-bold text-3xl text-primary md:text-4xl">
            Trois expertises, un même soin du détail.
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {specialties.map(({ icon: Icon, title, desc, to }) => (
            <Card key={title} className="group relative overflow-hidden p-7 transition-shadow hover:shadow-md border border-border">
              <Icon className="h-7 w-7 text-secondary" />
              <h3 className="mt-4 font-sans font-bold text-xl text-primary">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
              <Link
                to={to}
                className="mt-4 inline-flex text-sm font-semibold text-secondary hover:underline"
              >
                En savoir plus →
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* Why us */}
      <section className="bg-slate-50 py-16 md:py-24 border-y border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-secondary font-bold">Pourquoi nous choisir</p>
            <h2 className="mt-2 font-sans font-bold text-3xl text-primary md:text-4xl">
              Un accompagnement humain, du premier conseil à la touche finale.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {reasons.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-lg border border-border bg-card p-6 shadow-sm">
                <Icon className="h-6 w-6 text-secondary" />
                <h3 className="mt-3 font-sans font-bold text-lg text-primary">{title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sécu process */}
      <section className="container mx-auto px-4 py-16 md:px-6 md:py-24">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-secondary font-bold">Prise en charge Sécu</p>
          <h2 className="mt-2 font-sans font-bold text-3xl text-primary md:text-4xl">
            4 étapes simples pour votre perruque médicale.
          </h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            Nous vous accompagnons à chaque étape, sans avance de frais pour les
            perruques de classe I.
          </p>
        </div>
        <StepsList steps={securitySteps} />
      </section>

      {/* Testimonials */}
      <section className="bg-slate-50 py-16 md:py-24 border-y border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-secondary font-bold">Témoignages</p>
            <h2 className="mt-2 font-sans font-bold text-3xl text-primary md:text-4xl">
              Ce qu'en disent nos clientes.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="rounded-lg border border-border bg-card p-7 shadow-sm">
                <div className="flex gap-0.5 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current text-secondary" />
                  ))}
                </div>
                <blockquote className="mt-4 font-sans text-base leading-relaxed text-primary italic">
                  « {t.quote} »
                </blockquote>
                <figcaption className="mt-4 text-sm text-muted-foreground">
                  <span className="font-semibold text-primary">{t.name}</span> — {t.role}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
