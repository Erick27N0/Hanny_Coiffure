import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Phone, MessageCircle, Mail, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { salonInfo, whatsappLink } from "@/data/salonInfo";
import { submitContact } from "@/lib/submissions.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & rendez-vous — Hanny Tresse Perpignan" },
      {
        name: "description",
        content:
          "Contactez le salon Hanny Tresse à Perpignan : formulaire de rendez-vous, téléphone et WhatsApp.",
      },
      { property: "og:title", content: "Contact — Hanny Tresse" },
      {
        property: "og:description",
        content: "Prenez rendez-vous au salon Hanny Tresse à Perpignan.",
      },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  fullName: z.string().trim().min(2, "Nom requis").max(100),
  email: z.string().trim().email("Email invalide").max(255),
  phone: z.string().trim().max(30).optional(),
  subject: z.string().trim().max(120).optional(),
  message: z.string().trim().min(5, "Merci de préciser votre demande").max(1000),
});
type Values = z.infer<typeof schema>;

function ContactPage() {
  const submit = useServerFn(submitContact);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: Values) => {
    try {
      await submit({ data: values });
      toast.success("Message envoyé", {
        description: "Nous vous répondons rapidement.",
      });
      reset();
    } catch (err) {
      toast.error("Envoi impossible", {
        description: err instanceof Error ? err.message : "Réessayez plus tard.",
      });
    }
  };

  return (
    <section className="container mx-auto px-4 py-14 md:px-6 md:py-20">
      <p className="text-xs uppercase tracking-[0.2em] text-secondary font-bold">Contact</p>
      <h1 className="mt-3 max-w-2xl font-sans font-bold text-4xl text-primary md:text-5xl">
        Prenons rendez-vous.
      </h1>
      <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
        Téléphone, WhatsApp ou formulaire : choisissez votre canal préféré.
      </p>

      <div className="mt-10 grid gap-8 md:grid-cols-5">
        <aside className="space-y-3 md:col-span-2">
          <a
            href={`tel:${salonInfo.phone}`}
            className="flex items-center gap-3 rounded-lg border border-border bg-card p-5 transition hover:border-secondary shadow-sm"
          >
            <Phone className="h-5 w-5 text-secondary" />
            <div>
              <p className="text-sm text-muted-foreground font-medium">Téléphone</p>
              <p className="font-bold text-primary">{salonInfo.phoneDisplay}</p>
            </div>
          </a>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-lg border border-border bg-card p-5 transition hover:border-secondary shadow-sm"
          >
            <MessageCircle className="h-5 w-5 text-secondary" />
            <div>
              <p className="text-sm text-muted-foreground font-medium">WhatsApp</p>
              <p className="font-bold text-primary">Discuter maintenant</p>
            </div>
          </a>
          <a
            href={`mailto:${salonInfo.email}`}
            className="flex items-center gap-3 rounded-lg border border-border bg-card p-5 transition hover:border-secondary shadow-sm"
          >
            <Mail className="h-5 w-5 text-secondary" />
            <div>
              <p className="text-sm text-muted-foreground font-medium">Email</p>
              <p className="font-bold text-primary">{salonInfo.email}</p>
            </div>
          </a>
          <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-5 shadow-sm">
            <MapPin className="mt-0.5 h-5 w-5 text-secondary" />
            <div className="text-sm">
              <p className="text-muted-foreground font-medium">Adresse</p>
              <p className="font-bold text-primary">{salonInfo.address.street}</p>
              <p className="font-bold text-primary">{salonInfo.address.city}</p>
            </div>
          </div>
        </aside>

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
              <Label htmlFor="phone" className="text-primary font-semibold">Téléphone</Label>
              <Input id="phone" type="tel" {...register("phone")} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-primary font-semibold">Email *</Label>
            <Input id="email" type="email" {...register("email")} aria-invalid={!!errors.email} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="subject" className="text-primary font-semibold">Sujet</Label>
            <Input id="subject" placeholder="Ex : demande de RDV box braids" {...register("subject")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="message" className="text-primary font-semibold">Message *</Label>
            <Textarea id="message" rows={5} {...register("message")} aria-invalid={!!errors.message} />
            {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
          </div>
          <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-lg" disabled={isSubmitting}>
            {isSubmitting ? "Envoi..." : "Envoyer le message"}
          </Button>
        </form>
      </div>
    </section>
  );
}
