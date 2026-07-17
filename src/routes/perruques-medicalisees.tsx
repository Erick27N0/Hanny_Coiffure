import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { 
  ShieldCheck, 
  Heart, 
  Info, 
  Calculator, 
  Sparkles, 
  Check, 
  HelpCircle,
  TrendingUp,
  FileText
} from "lucide-react";

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
          "Accompagnement bienveillant et remboursement Sécu pour votre prothèse capillaire.",
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

type WigCategory = "classe1" | "classe2" | "accessoires" | "hors_classe";
type MutuelleType = "forfait" | "percent" | "none";

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

  // Simulator State
  const [selectedCategory, setSelectedCategory] = React.useState<WigCategory>("classe1");
  const [itemPrice, setItemPrice] = React.useState<number>(350);
  const [mutuelleType, setMutuelleType] = React.useState<MutuelleType>("forfait");
  const [mutuelleValue, setMutuelleValue] = React.useState<number>(150);

  // Auto-adjust price when category changes based on PLV (Prix Limite de Vente)
  React.useEffect(() => {
    if (selectedCategory === "classe1") {
      setItemPrice(350);
    } else if (selectedCategory === "classe2") {
      setItemPrice(500);
    } else if (selectedCategory === "accessoires") {
      setItemPrice(40);
    } else {
      setItemPrice(850);
    }
  }, [selectedCategory]);

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

  // Calculation Logic
  const getCalculation = () => {
    let plv = 350;
    let baseSecu = 350;
    let secuPart = 0;
    let maxPrice = 350;
    let minPrice = 0;
    let categoryName = "";
    let description = "";

    switch (selectedCategory) {
      case "classe1":
        plv = 350;
        baseSecu = 350;
        minPrice = 0;
        maxPrice = 350;
        secuPart = Math.min(itemPrice, 350);
        categoryName = "Classe I (Fibre synthétique)";
        description = "Prise en charge intégrale à hauteur de 350 € (le prix ne peut réglementairement pas dépasser 350 €).";
        break;
      case "classe2":
        plv = 700;
        baseSecu = 250;
        minPrice = 350.01;
        maxPrice = 700;
        secuPart = 250;
        categoryName = "Classe II (Fibre semi-naturelle ou naturelle)";
        description = "Base de remboursement Sécurité Sociale fixe de 250 €. Le reste à charge peut être couvert par votre mutuelle.";
        break;
      case "accessoires":
        plv = 40;
        baseSecu = 40;
        minPrice = 0;
        maxPrice = 40;
        secuPart = Math.min(itemPrice, 40);
        categoryName = "Prothèse partielle ou Accessoires";
        description = "Turbans, franges ou foulards. Prise en charge à hauteur de 40 € (jusqu'à 3 accessoires).";
        break;
      case "hors_classe":
        plv = Infinity;
        baseSecu = 0;
        minPrice = 700.01;
        maxPrice = 2500;
        secuPart = 0;
        categoryName = "Perruque Haut de Gamme (> 700 €)";
        description = "Pas de prise en charge par la Sécurité Sociale. Le remboursement dépend exclusivement de votre mutuelle.";
        break;
    }

    const price = Math.max(0, itemPrice);
    const remainderAfterSecu = Math.max(0, price - secuPart);

    let mutuellePart = 0;
    if (mutuelleType === "forfait") {
      mutuellePart = Math.min(remainderAfterSecu, mutuelleValue);
    } else if (mutuelleType === "percent") {
      if (baseSecu > 0) {
        // Total cap = Base Secu * (percent / 100)
        // Note: percent includes the Secu part. So mutuelle covers up to: (baseSecu * percent / 100) - secuPart
        const totalCap = baseSecu * (mutuelleValue / 100);
        const possibleMutuelle = Math.max(0, totalCap - secuPart);
        mutuellePart = Math.min(remainderAfterSecu, possibleMutuelle);
      } else {
        mutuellePart = 0;
      }
    }

    const finalRemainder = Math.max(0, price - secuPart - mutuellePart);

    return {
      price,
      secuPart,
      mutuellePart,
      finalRemainder,
      plv,
      baseSecu,
      minPrice,
      maxPrice,
      categoryName,
      description
    };
  };

  const calc = getCalculation();

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

      {/* SIMULATEUR DE REMBOURSEMENT */}
      <section id="simulateur" className="bg-slate-50 py-16 md:py-20 border-y border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs text-primary font-bold">
              <Calculator className="h-4 w-4" /> Outil d'estimation interactif
            </span>
            <h2 className="mt-4 font-sans font-bold text-3xl text-primary md:text-4xl">
              Simulateur de Remboursement Sécu & Mutuelle
            </h2>
            <p className="mt-3 text-muted-foreground">
              Estimez précisément votre reste à charge pour l'achat de votre perruque médicale ou de vos accessoires capillaires selon vos garanties de mutuelle.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 max-w-6xl mx-auto">
            
            {/* Colonne de gauche : Formulaire de simulation */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Étape 1 : Choix de la catégorie */}
              <div className="space-y-3">
                <Label className="text-sm font-bold text-primary flex items-center gap-1.5">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-[11px] font-bold">1</span>
                  Type de Prothèse Capillaire ou Accessoire
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Classe I */}
                  <div 
                    onClick={() => setSelectedCategory("classe1")}
                    className={`cursor-pointer rounded-xl border p-4 transition-all hover:shadow-sm ${
                      selectedCategory === "classe1" 
                        ? "border-primary bg-primary/5 ring-1 ring-primary" 
                        : "border-border bg-card hover:border-muted-foreground/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-sans font-bold text-sm text-primary">Classe I</span>
                      <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Pris à 100%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">Fibre synthétique. Prix max de 350 € réglementé.</p>
                  </div>

                  {/* Classe II */}
                  <div 
                    onClick={() => setSelectedCategory("classe2")}
                    className={`cursor-pointer rounded-xl border p-4 transition-all hover:shadow-sm ${
                      selectedCategory === "classe2" 
                        ? "border-primary bg-primary/5 ring-1 ring-primary" 
                        : "border-border bg-card hover:border-muted-foreground/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-sans font-bold text-sm text-primary">Classe II</span>
                      <span className="text-xs bg-slate-100 text-primary font-bold px-2 py-0.5 rounded-full">Sécu : 250 €</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">Semi-naturelle/naturelle. Prix max de 700 €.</p>
                  </div>

                  {/* Accessoires */}
                  <div 
                    onClick={() => setSelectedCategory("accessoires")}
                    className={`cursor-pointer rounded-xl border p-4 transition-all hover:shadow-sm ${
                      selectedCategory === "accessoires" 
                        ? "border-primary bg-primary/5 ring-1 ring-primary" 
                        : "border-border bg-card hover:border-muted-foreground/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-sans font-bold text-sm text-primary">Accessoires</span>
                      <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Sécu : 40 €</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">Turbans, foulards, franges. Prix max de 40 €.</p>
                  </div>

                  {/* Hors Classe */}
                  <div 
                    onClick={() => setSelectedCategory("hors_classe")}
                    className={`cursor-pointer rounded-xl border p-4 transition-all hover:shadow-sm ${
                      selectedCategory === "hors_classe" 
                        ? "border-primary bg-primary/5 ring-1 ring-primary" 
                        : "border-border bg-card hover:border-muted-foreground/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-sans font-bold text-sm text-primary">Haut de gamme</span>
                      <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">Sécu : 0 €</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">Cheveux 100% naturels ou de prix supérieur à 700 €.</p>
                  </div>
                </div>
              </div>

              {/* Étape 2 : Prix de vente */}
              <div className="space-y-3 bg-card border border-border p-5 rounded-xl shadow-sm">
                <div className="flex justify-between items-center">
                  <Label htmlFor="price-slider" className="text-sm font-bold text-primary flex items-center gap-1.5">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-[11px] font-bold">2</span>
                    Prix de la Prothèse Capillaire / de l'Accessoire
                  </Label>
                  <span className="font-mono font-bold text-lg text-primary">{itemPrice} €</span>
                </div>

                <input 
                  id="price-slider"
                  type="range"
                  min={selectedCategory === "classe2" ? 351 : selectedCategory === "hors_classe" ? 701 : 1}
                  max={selectedCategory === "classe1" ? 350 : selectedCategory === "classe2" ? 700 : selectedCategory === "accessoires" ? 40 : 2000}
                  step={selectedCategory === "accessoires" ? 1 : 10}
                  value={itemPrice}
                  onChange={(e) => setItemPrice(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />

                <div className="flex justify-between text-xs text-muted-foreground font-semibold">
                  <span>Min: {selectedCategory === "classe2" ? "351" : selectedCategory === "hors_classe" ? "701" : "0"} €</span>
                  {selectedCategory !== "hors_classe" && (
                    <span className="text-destructive">Prix réglementé limite (PLV) : {calc.plv} €</span>
                  )}
                  <span>Max: {selectedCategory === "classe1" ? "350" : selectedCategory === "classe2" ? "700" : selectedCategory === "accessoires" ? "40" : "2000+"} €</span>
                </div>

                {selectedCategory === "classe1" && itemPrice > 350 && (
                  <p className="text-xs text-destructive bg-destructive/5 p-2 rounded border border-destructive/20 mt-2">
                    Attention : en Classe I, le prix limite réglementaire est fixé à 350 €.
                  </p>
                )}
                {selectedCategory === "classe2" && itemPrice > 700 && (
                  <p className="text-xs text-destructive bg-destructive/5 p-2 rounded border border-destructive/20 mt-2">
                    Attention : en Classe II, le prix limite réglementaire est fixé à 700 €.
                  </p>
                )}
              </div>

              {/* Étape 3 : Prise en charge Mutuelle */}
              <div className="space-y-3 bg-card border border-border p-5 rounded-xl shadow-sm">
                <Label className="text-sm font-bold text-primary flex items-center gap-1.5">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-[11px] font-bold">3</span>
                  Garanties de votre Mutuelle (Complémentaire Santé)
                </Label>

                <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => { setMutuelleType("forfait"); setMutuelleValue(150); }}
                    className={`py-2 text-xs font-bold rounded-md transition-all ${
                      mutuelleType === "forfait" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    Forfait en Euros
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMutuelleType("percent"); setMutuelleValue(200); }}
                    className={`py-2 text-xs font-bold rounded-md transition-all ${
                      mutuelleType === "percent" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    % de la Base Sécu
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMutuelleType("none"); setMutuelleValue(0); }}
                    className={`py-2 text-xs font-bold rounded-md transition-all ${
                      mutuelleType === "none" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    Pas de mutuelle
                  </button>
                </div>

                {mutuelleType === "forfait" && (
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground font-semibold">Montant du forfait de votre mutuelle :</span>
                      <span className="font-mono font-bold text-sm text-primary">{mutuelleValue} €</span>
                    </div>
                    <input 
                      type="range"
                      min={0}
                      max={1000}
                      step={25}
                      value={mutuelleValue}
                      onChange={(e) => setMutuelleValue(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex gap-2 flex-wrap">
                      {[150, 250, 450, 600].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setMutuelleValue(preset)}
                          className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 font-bold rounded border border-border"
                        >
                          +{preset}€
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {mutuelleType === "percent" && (
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground font-semibold">Niveau de garantie en % (BRSS) :</span>
                      <span className="font-mono font-bold text-sm text-primary">{mutuelleValue}% BR</span>
                    </div>
                    <input 
                      type="range"
                      min={100}
                      max={500}
                      step={50}
                      value={mutuelleValue}
                      onChange={(e) => setMutuelleValue(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex gap-2">
                      {[100, 200, 300, 400].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setMutuelleValue(preset)}
                          className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 font-bold rounded border border-border"
                        >
                          {preset}% BR
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed italic bg-blue-50/50 p-2.5 rounded border border-blue-100 mt-2">
                      <Info className="h-3 w-3 text-secondary inline mr-1 mb-0.5" />
                      Le pourcentage inclut le remboursement de la Sécurité Sociale. Par exemple, un contrat à <strong>200% BR</strong> sur la Classe II (base de 250 €) garantit un remboursement global maximal de 500 € (Sécu de 250 € comprise).
                    </p>
                  </div>
                )}

                {mutuelleType === "none" && (
                  <p className="text-xs text-muted-foreground pt-2">
                    Sans complémentaire santé, vous ne serez remboursé que de la part de l'Assurance Maladie.
                  </p>
                )}
              </div>

            </div>

            {/* Colonne de droite : Résultats de la simulation */}
            <div className="lg:col-span-5">
              <div className="bg-card border border-border rounded-2xl shadow-md p-6 flex flex-col justify-between h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 bg-secondary/10 rounded-bl-xl">
                  <Sparkles className="h-4 w-4 text-secondary" />
                </div>

                <div>
                  <h3 className="font-sans font-bold text-lg text-primary mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" /> Estimation du Reste à Charge
                  </h3>
                  <p className="text-xs text-muted-foreground mb-6 font-semibold">
                    Basé sur les barèmes d'Assurance Maladie {new Date().getFullYear()} — EXEMPLE
                  </p>

                  {/* Jauge visuelle de répartition */}
                  <div className="space-y-1.5 mb-6">
                    <span className="text-xs text-muted-foreground font-bold">Répartition de la prise en charge :</span>
                    <div className="w-full h-6 rounded-full bg-slate-100 overflow-hidden flex font-sans font-bold text-[10px] text-white">
                      {calc.secuPart > 0 && (
                        <div 
                          style={{ width: `${(calc.secuPart / calc.price) * 100}%` }} 
                          className="bg-emerald-600 flex items-center justify-center transition-all"
                          title={`Sécu : ${calc.secuPart}€`}
                        >
                          {Math.round((calc.secuPart / calc.price) * 100) > 12 && `${calc.secuPart}€`}
                        </div>
                      )}
                      {calc.mutuellePart > 0 && (
                        <div 
                          style={{ width: `${(calc.mutuellePart / calc.price) * 100}%` }} 
                          className="bg-primary flex items-center justify-center transition-all border-l border-white/20"
                          title={`Mutuelle : ${calc.mutuellePart}€`}
                        >
                          {Math.round((calc.mutuellePart / calc.price) * 100) > 12 && `${calc.mutuellePart}€`}
                        </div>
                      )}
                      {calc.finalRemainder > 0 && (
                        <div 
                          style={{ width: `${(calc.finalRemainder / calc.price) * 100}%` }} 
                          className="bg-amber-500 flex items-center justify-center transition-all border-l border-white/20"
                          title={`À votre charge : ${calc.finalRemainder}€`}
                        >
                          {Math.round((calc.finalRemainder / calc.price) * 100) > 12 && `${calc.finalRemainder}€`}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Détails financiers */}
                  <div className="space-y-3.5 border-b border-border pb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground font-semibold flex items-center gap-1">
                        Prix total d'achat :
                      </span>
                      <span className="font-mono font-bold text-primary">{calc.price} €</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-emerald-600 inline-block"></span>
                        Prise en charge Sécurité Sociale :
                      </span>
                      <span className="font-mono font-bold text-emerald-600">-{calc.secuPart} €</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-primary font-bold flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-primary inline-block"></span>
                        Remboursement de votre Mutuelle :
                      </span>
                      <span className="font-mono font-bold text-primary">-{calc.mutuellePart} €</span>
                    </div>
                  </div>

                  {/* Reste à charge final */}
                  <div className="pt-6 text-center">
                    <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold block mb-1">Reste à charge patient</span>
                    <div className={`font-sans font-extrabold text-4xl ${calc.finalRemainder === 0 ? "text-emerald-600" : "text-amber-500"}`}>
                      {calc.finalRemainder === 0 ? "0,00 €" : `${calc.finalRemainder.toFixed(2).replace(".", ",")} €`}
                    </div>
                    {calc.finalRemainder === 0 ? (
                      <span className="text-xs text-emerald-600 font-bold mt-2 inline-flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                        <Check className="h-3 w-3" /> Remboursement 100% Intégral !
                      </span>
                    ) : (
                      <span className="text-xs text-amber-600 font-bold mt-2 inline-block">
                        Complété en partie par vos garanties mutuelle.
                      </span>
                    )}
                  </div>
                </div>

                {/* Badge d'engagement Hanny Tresse */}
                <div className="mt-8 pt-6 border-t border-border bg-slate-50/50 -mx-6 -mb-6 px-6 pb-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-emerald-100 p-2 rounded-lg text-emerald-700 mt-0.5">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-sans font-bold text-xs text-primary uppercase tracking-wider">Agrément & Tiers Payant</h4>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        Le salon Hanny Tresse est <strong>un centre agréé</strong>. Nous appliquons le tiers payant : vous n'avez pas à faire l'avance de la part remboursée par la Sécurité Sociale sur présentation de votre ordonnance.
                      </p>
                    </div>
                  </div>

                  <Button 
                    asChild 
                    className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-sm rounded-lg py-5 shadow-sm"
                  >
                    <a href="#rdv-perruque">
                      Prendre RDV pour un essayage privé
                    </a>
                  </Button>
                </div>

              </div>
            </div>

          </div>

          <div className="mt-10 max-w-3xl mx-auto text-center p-4 rounded-xl border border-blue-100 bg-blue-50/40">
            <p className="text-xs text-muted-foreground leading-relaxed flex items-center justify-center gap-1.5">
              <FileText className="h-4 w-4 text-blue-500 shrink-0" />
              <span><strong>À noter :</strong> Ces estimations sont indicatives (« EXEMPLE — à vérifier »). Munissez-vous de votre ordonnance de moins d'un an et de votre contrat de mutuelle lors de votre essai pour obtenir un devis réglementaire définitif.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-slate-50 py-16 md:py-20 border-b border-border">
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

