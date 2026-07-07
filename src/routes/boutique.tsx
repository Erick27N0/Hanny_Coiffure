import * as React from "react";
import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { products, productCategories } from "@/data/products";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/boutique")({
  head: () => ({
    meta: [
      { title: "Boutique — Perruques, extensions & soins | Hanny Tresse" },
      {
        name: "description",
        content:
          "Catalogue de perruques médicales, extensions naturelles et soins capillaires sélectionnés par Hanny Tresse à Perpignan.",
      },
      { property: "og:title", content: "Boutique — Hanny Tresse" },
      {
        property: "og:description",
        content: "Perruques médicales, extensions et soins capillaires premium.",
      },
    ],
  }),
  component: BoutiquePage,
});

function BoutiquePage() {
  const [filter, setFilter] = useState<(typeof productCategories)[number]>("Toutes");
  const filtered = filter === "Toutes" ? products : products.filter((p) => p.category === filter);

  return (
    <section className="container mx-auto px-4 py-14 md:px-6 md:py-20">
      <p className="text-xs uppercase tracking-[0.2em] text-secondary font-bold">Boutique</p>
      <h1 className="mt-3 max-w-2xl font-sans font-bold text-4xl text-primary md:text-5xl">
        Notre sélection capillaire.
      </h1>
      <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
        Perruques médicales éligibles Sécu, extensions naturelles et soins éprouvés.
        Pour toute demande spécifique, contactez-nous : nous sourçons sur mesure.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {productCategories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={cn(
              "rounded-lg border px-4 py-1.5 text-sm transition font-medium cursor-pointer",
              filter === c
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-card text-muted-foreground hover:border-secondary hover:text-secondary"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <Card key={p.slug} className="group flex flex-col overflow-hidden p-0 transition-shadow hover:shadow-md border border-border shadow-sm">
            <Link to="/boutique/$productSlug" params={{ productSlug: p.slug } as any} className="block">
              <div className="aspect-square overflow-hidden bg-muted">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
            </Link>
            <div className="flex flex-1 flex-col p-5">
              <Badge variant="secondary" className="w-fit bg-slate-100 text-primary">{p.category}</Badge>
              <h2 className="mt-2 font-sans font-bold text-lg text-primary">
                <Link
                  to="/boutique/$productSlug"
                  params={{ productSlug: p.slug } as any}
                  className="hover:text-secondary"
                >
                  {p.name}
                </Link>
              </h2>
              <p className="mt-1 flex-1 text-sm text-muted-foreground leading-relaxed">{p.shortDescription}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-bold text-primary">{p.price} €</span>
                <span
                  className={cn(
                    "text-xs font-semibold",
                    p.inStock ? "text-secondary" : "text-muted-foreground"
                  )}
                >
                  {p.inStock ? "En stock" : "Sur commande"}
                </span>
              </div>
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link to="/boutique/$productSlug" params={{ productSlug: p.slug } as any}>
                  Voir le produit
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
