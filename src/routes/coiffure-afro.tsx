import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CTASection } from "@/components/cta-section";
import { services, formatDuration } from "@/data/services";

export const Route = createFileRoute("/coiffure-afro")({
  head: () => ({
    meta: [
      { title: "Coiffure afro & extensions — Hanny Tresse Perpignan" },
      {
        name: "description",
        content:
          "Tresses, tissages, twists, locks, extensions et soins du cuir chevelu à Perpignan. Découvrez nos prestations et tarifs indicatifs.",
      },
      { property: "og:title", content: "Coiffure afro & extensions — Hanny Tresse" },
      {
        property: "og:description",
        content: "Toutes nos prestations de coiffure afro à Perpignan.",
      },
    ],
  }),
  component: AfroPage,
});

function AfroPage() {
  return (
    <>
      <section className="container mx-auto px-4 pt-14 md:px-6 md:pt-20">
        <p className="text-xs uppercase tracking-[0.2em] text-secondary font-bold">Coiffure afro</p>
        <h1 className="mt-3 max-w-3xl font-sans font-bold text-4xl text-primary md:text-5xl">
          Tresses, tissages et extensions, réalisés avec soin.
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
          Chaque prestation est précédée d'un échange pour comprendre vos envies
          et votre cuir chevelu. Les durées et tarifs ci-dessous sont indicatifs ;
          un devis précis vous est remis lors du rendez-vous.
        </p>
      </section>

      <section className="container mx-auto px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Card key={s.id} className="flex flex-col p-6 shadow-sm border border-border">
              <Badge variant="secondary" className="w-fit bg-slate-100 text-primary">{s.category}</Badge>
              <h2 className="mt-3 font-sans font-bold text-xl text-primary">{s.name}</h2>
              <p className="mt-2 flex-1 text-sm text-muted-foreground leading-relaxed">{s.description}</p>
              <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                  <Clock className="h-4 w-4 text-secondary" /> {formatDuration(s.durationMinutes)}
                </span>
                <span className="flex items-center gap-1.5 font-bold text-primary">
                  <Tag className="h-4 w-4 text-secondary" /> à partir de {s.priceFrom} €
                </span>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-lg">
            <Link to="/contact">Prendre rendez-vous</Link>
          </Button>
        </div>
      </section>

      <CTASection
        title="Une envie particulière ?"
        description="Décrivez-nous votre projet, on construit ensemble la coiffure qui vous ressemble."
        secondaryLabel="Voir la boutique"
      />
    </>
  );
}
