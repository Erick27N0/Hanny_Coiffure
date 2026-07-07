import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { StepsList } from "@/components/steps-list";
import { wigFaq } from "@/data/faq";
import { submitAppointment } from "@/lib/submissions.functions";

const medicalImg = "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=1200&auto=format&fit=crop";

export const Route = createFileRoute("/perruques-medicalisees")({
  head: () => ({
    meta: [
      { title: "Perruques médicalisées & Sécu — Hanny Tresse Perpignan" },
      {
        name: "description",
        content:
          "Perruques médicales avec prise en charge Sécurité sociale à Perpignan. Accompagnement bienveillant, tiers payant et conseils personnalisés.",
      },
      { property: "og:title", content: "Perruques médicalisées — Hanny Tresse Perpignan" },
      {
        property: "og:description",
        content:
          "Accompagnement bienveillant et remboursement Sécu for votre prothèse capillaire.",
      },
    ],
  }),
  component: WigsPage,
});

const patientSteps = [
  { title: "Ordonnance", description: "Demandez à votre médecin une prescription de prothèse capillaire." },
  { title: "Premier contact", description: "Appelez-nous ou envoyez le formulaire ci-dessous." },
  { title: "Essayage", description: "Rendez-vous privé d'environ 1h dans un espace dédié." },
  { title: "Validation & pose", description: "Ajustement final, conseils d'entretien, pose offerte." },
  { title: "Remboursement", description: "Nous gérons le tiers payant Sécu (classe I) et votre mutuelle." },
];

const formSchema = z.object({
  fullName: z.string().trim().min(2, "Nom requis").max(100),
  email: z.string().trim().email("Email invalide").max(255),
  phone: z.string().trim().min(6, "Téléphone requis").max(30),
  situation: z.string().trim().min(5, "Précisez votre situation").max(500),
  oncologyCenter: z.string().trim().max(200).optional(),
  preferredSlot: z.string().trim().max(200).optional(),
});

type FormValues = z.infer<typeof formSchema>;

function WigsPage() {
  const submit = useServerFn(submitAppointment);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await submit({ data: values });
      toast.success("Demande envoyée", {
        description: "Nous vous recontactons sous 24h ouvrées.",
      });
      reset();
    } catch (err) {
      toast.error("Envoi impossible", {
        description: err instanceof Error ? err.message : "Réessayez plus tard.",
      });
    }
  };

  return (
    <>
      <section className="container mx-auto grid gap-10 px-4 pt-14 md:grid-cols-2 md:items-center md:px-6 md:pt-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.18em] text-secondary font-bold">
            <ShieldCheck className="h-3 w-3 text-secondary fill-current" /> Prise en charge Sécu
          </span>
          <h1 className="mt-4 font-sans font-bold text-4xl text-primary md:text-5xl">
            Une perruque qui vous ressemble, dans un cadre bienveillant.
          </h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Nous accompagnons les patientes confrontées à une alopécie médicale.
            Tiers payant Sécu, mutuelles partenaires et essayage en espace privé.
          </p>
        </div>
        <img
          src={medicalImg}
          alt="Perruque médicale présentée dans un cadre apaisé"
          width={1280}
          height={960}
          loading="lazy"
          className="aspect-[4/3] w-full rounded-lg object-cover shadow-sm border border-border"
        />
      </section>

      {/* Pédagogie */}
      <section className="container mx-auto px-4 py-16 md:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-6 border border-border shadow-sm">
            <h3 className="font-sans font-bold text-lg text-primary">Qui est concerné ?</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Toute personne en perte de cheveux liée à un traitement médical
              (chimiothérapie, pelade, alopécie cicatricielle…).
            </p>
          </Card>
          <Card className="p-6 border border-border shadow-sm">
            <h3 className="font-sans font-bold text-lg text-primary">L'ordonnance</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Demandez à votre médecin une prescription mentionnant
              « prothèse capillaire ». C'est la seule pièce nécessaire.
            </p>
          </Card>
          <Card className="p-6 border border-border shadow-sm">
            <h3 className="font-sans font-bold text-lg text-primary">Remboursement</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Classe I : 350 € pris en charge à 100%. Classe II : 250 €
              remboursés, complément possible par la mutuelle.
            </p>
          </Card>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-slate-50 py-16 md:py-20 border-y border-border">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="mb-8 max-w-2xl font-sans font-bold text-3xl text-primary md:text-4xl">
            Votre parcours en 5 étapes
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {patientSteps.map((s, i) => (
              <div key={s.title} className="rounded-lg border border-border bg-card p-6 shadow-sm">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-secondary font-sans font-bold text-secondary-foreground">
                  {i + 1}
                </span>
                <h3 className="mt-3 font-sans font-bold text-base text-primary">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-16 md:px-6 md:py-20">
        <h2 className="mb-6 max-w-2xl font-sans font-bold text-3xl text-primary md:text-4xl">
          Questions fréquentes
        </h2>
        <Accordion type="single" collapsible className="w-full max-w-3xl">
          {wigFaq.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-sans font-semibold text-base text-primary">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Form */}
      <section id="rdv-perruque" className="bg-slate-50 py-16 md:py-20 border-t border-border">
        <div className="container mx-auto grid gap-10 px-4 md:grid-cols-5 md:px-6">
          <div className="md:col-span-2">
            <h2 className="font-sans font-bold text-3xl text-primary md:text-4xl">Demander un rendez-vous</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Renseignez vos coordonnées et votre situation : nous vous recontactons
              sous 24h ouvrées pour fixer un essayage.
            </p>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 rounded-lg border border-border bg-card p-7 md:col-span-3 shadow-sm"
            noValidate
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-primary font-semibold">Nom complet *</Label>
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
              <Label htmlFor="oncologyCenter" className="text-primary font-semibold">Centre d'oncologie (optionnel)</Label>
              <Input id="oncologyCenter" {...register("oncologyCenter")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="preferredSlot" className="text-primary font-semibold">Créneau souhaité (optionnel)</Label>
              <Input id="preferredSlot" placeholder="Ex : mardi après-midi" {...register("preferredSlot")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="situation" className="text-primary font-semibold">Votre situation *</Label>
              <Textarea id="situation" rows={4} {...register("situation")} aria-invalid={!!errors.situation} />
              {errors.situation && <p className="text-xs text-destructive">{errors.situation.message}</p>}
            </div>
            <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-lg" disabled={isSubmitting}>
              {isSubmitting ? "Envoi..." : "Envoyer ma demande"}
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}
