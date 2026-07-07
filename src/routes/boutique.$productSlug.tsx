import * as React from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Check, ChevronLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getProductBySlug } from "@/data/products";
import { submitProductInquiry } from "@/lib/submissions.functions";

export const Route = createFileRoute("/boutique/$productSlug")({
  loader: ({ params }) => {
    const product = getProductBySlug(params.productSlug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — Boutique Hanny Tresse` },
          { name: "description", content: loaderData.product.shortDescription },
          { property: "og:title", content: loaderData.product.name },
          { property: "og:description", content: loaderData.product.shortDescription },
          { property: "og:image", content: loaderData.product.image },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="font-sans font-bold text-3xl text-primary">Produit introuvable</h1>
      <Button asChild className="mt-6">
        <Link to="/boutique">Retour à la boutique</Link>
      </Button>
    </div>
  ),
  component: ProductPage,
});

const schema = z.object({
  fullName: z.string().trim().min(2, "Nom requis").max(100),
  email: z.string().trim().email("Email invalide").max(255),
  phone: z.string().trim().min(6, "Téléphone requis").max(30),
  message: z.string().trim().max(800).optional(),
});
type Values = z.infer<typeof schema>;

function ProductPage() {
  const { product } = Route.useLoaderData();
  const submit = useServerFn(submitProductInquiry);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: Values) => {
    try {
      await submit({
        data: {
          ...values,
          message: values.message ?? "",
          productSlug: product.slug,
          productName: product.name,
        },
      });
      toast.success("Demande envoyée", {
        description: `Nous vous recontactons au sujet de « ${product.name} ».`,
      });
      reset();
    } catch (err) {
      toast.error("Envoi impossible", {
        description: err instanceof Error ? err.message : "Réessayez plus tard.",
      });
    }
  };

  return (
    <section className="container mx-auto px-4 py-10 md:px-6 md:py-16">
      <Link
        to="/boutique"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-secondary font-medium"
      >
        <ChevronLeft className="h-4 w-4" /> Retour à la boutique
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2 md:gap-14">
        <div className="overflow-hidden rounded-lg bg-muted border border-border">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="aspect-square w-full object-cover"
          />
        </div>

        <div>
          <Badge variant="secondary" className="bg-slate-100 text-primary">{product.category}</Badge>
          <h1 className="mt-3 font-sans font-bold text-3xl text-primary md:text-4xl">{product.name}</h1>
          <p className="mt-3 text-muted-foreground leading-relaxed">{product.description}</p>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-sans font-bold text-3xl text-secondary">{product.price} €</span>
            <span className="text-sm text-muted-foreground font-medium">
              {product.inStock ? "En stock" : "Sur commande (~10 jours)"}
            </span>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-4 rounded-lg border border-border bg-card p-5 text-sm shadow-sm">
            <div>
              <dt className="text-muted-foreground font-medium">Type de cheveux</dt>
              <dd className="mt-0.5 font-bold text-primary">{product.hairType}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground font-medium">Longueur</dt>
              <dd className="mt-0.5 font-bold text-primary">{product.length}</dd>
            </div>
          </dl>

          {product.highlights.length > 0 && (
            <ul className="mt-5 space-y-1.5 text-sm">
              {product.highlights.map((h: string) => (
                <li key={h} className="flex items-center gap-2 text-foreground/80 font-medium">
                  <Check className="h-4 w-4 text-secondary" /> {h}
                </li>
              ))}
            </ul>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 space-y-4 rounded-lg border border-border bg-card p-6 shadow-sm"
            noValidate
          >
            <p className="font-sans font-bold text-lg text-primary">Demander ce produit</p>
            <p className="-mt-2 text-sm text-muted-foreground leading-relaxed">
              Parcours d'achat en mode test : envoyez votre demande, nous vous
              recontactons pour valider la commande.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-primary font-semibold">Nom *</Label>
                <Input id="fullName" {...register("fullName")} aria-invalid={!!errors.fullName} />
                {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-primary font-semibold">Téléphone *</Label>
                <Input id="phone" type="tel" {...register("phone")} aria-invalid={!!errors.phone} />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-primary font-semibold">Email *</Label>
              <Input id="email" type="email" {...register("email")} aria-invalid={!!errors.email} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="message" className="text-primary font-semibold">Message (optionnel)</Label>
              <Textarea id="message" rows={3} {...register("message")} />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-lg" disabled={isSubmitting}>
              {isSubmitting ? "Envoi..." : "Commander ce produit"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
