import * as React from "react";
import { Sparkles, Heart, HelpCircle, ArrowLeftRight } from "lucide-react";

interface BeforeAfterItem {
  id: string;
  category: string;
  title: string;
  description: string;
  beforeImg: string;
  afterImg: string;
  beforeLabel?: string;
  afterLabel?: string;
}

const GALLERY_ITEMS: BeforeAfterItem[] = [
  {
    id: "medical-wig",
    category: "Prothèse Capillaire Médicale",
    title: "Solution d'accompagnement capillaire",
    description: "Perruque de classe I en fibre synthétique de haute qualité, ajustée et personnalisée sur-mesure pour recréer une implantation ultra-naturelle suite à une alopécie.",
    beforeImg: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=600&auto=format&fit=crop",
    afterImg: "https://images.unsplash.com/photo-1595959183075-c1d09e519826?q=80&w=600&auto=format&fit=crop",
    beforeLabel: "Avant (Perte de volume)",
    afterLabel: "Après (Perruque Médicale)"
  },
  {
    id: "afro-braids",
    category: "Coiffure Afro & Tresses",
    title: "Tissage Protecteur & Tresses",
    description: "Transformation capillaire protectrice. Hydratation en profondeur du cheveu naturel, suivie de tresses d'une grande finesse avec extensions de qualité supérieure.",
    beforeImg: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop",
    afterImg: "https://images.unsplash.com/photo-1605497746444-ac9dbd324ce8?q=80&w=600&auto=format&fit=crop",
    beforeLabel: "Avant (Cheveux naturels)",
    afterLabel: "Après (Tresses Protectrices)"
  },
  {
    id: "hair-extensions",
    category: "Extensions Premium",
    title: "Volume & Longueur sur-mesure",
    description: "Pose d'extensions de cheveux 100% naturels pour redonner de la densité et de la longueur à des cheveux courts ou affaiblis.",
    beforeImg: "https://images.unsplash.com/photo-1516684732162-798a0062be99?q=80&w=600&auto=format&fit=crop",
    afterImg: "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?q=80&w=600&auto=format&fit=crop",
    beforeLabel: "Avant (Courts & Fins)",
    afterLabel: "Après (Longueur & Volume)"
  }
];

export function BeforeAfterGallery() {
  const [activeItem, setActiveItem] = React.useState<BeforeAfterItem>(GALLERY_ITEMS[0]);
  const [sliderPosition, setSliderPosition] = React.useState<number>(50);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  // Drag logic for standard mouse/touch events or the visual representation
  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1 || isDragging) {
      handleMove(e.clientX);
    }
  };

  return (
    <section id="galerie-transformations" className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5 text-xs text-secondary font-bold">
            <Sparkles className="h-4 w-4" /> Résultats de nos clientes
          </span>
          <h2 className="mt-4 font-sans font-bold text-3xl text-primary md:text-4xl">
            Galerie Avant / Après Interactive
          </h2>
          <p className="mt-3 text-muted-foreground">
            Faites glisser la barre centrale de gauche à droite pour révéler la transformation et apprécier la qualité du rendu naturel de nos poses.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {GALLERY_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveItem(item);
                setSliderPosition(50);
              }}
              className={`px-4 py-2.5 text-xs font-bold rounded-full border transition-all ${
                activeItem.id === item.id
                  ? "bg-primary border-primary text-white shadow-sm"
                  : "bg-slate-50 border-border text-slate-700 hover:bg-slate-100 hover:border-slate-400"
              }`}
            >
              {item.category}
            </button>
          ))}
        </div>

        {/* Interactive Comparison & Description Grid */}
        <div className="grid gap-10 lg:grid-cols-12 max-w-5xl mx-auto items-center">
          
          {/* Comparison Slider (Left 7 Columns) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            
            <div 
              ref={containerRef}
              className="relative w-full aspect-[4/3] max-w-lg rounded-2xl overflow-hidden border border-border bg-slate-100 shadow-md select-none touch-none"
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
            >
              {/* BEFORE IMAGE (Full-size, underneath) */}
              <img
                src={activeItem.beforeImg}
                alt="Avant la transformation"
                className="absolute inset-0 w-full h-full object-cover"
                draggable={false}
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-sm text-white px-2.5 py-1 rounded text-[10px] font-extrabold uppercase tracking-wider z-20">
                {activeItem.beforeLabel || "Avant"}
              </div>

              {/* AFTER IMAGE (Clipped on top) */}
              <div 
                className="absolute inset-0 w-full h-full overflow-hidden z-10"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
              >
                <img
                  src={activeItem.afterImg}
                  alt="Après la transformation"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ width: "100%", height: "100%" }}
                  draggable={false}
                  referrerPolicy="no-referrer"
                />
              </div>
              <div 
                className="absolute top-4 right-4 bg-secondary text-secondary-foreground px-2.5 py-1 rounded text-[10px] font-extrabold uppercase tracking-wider z-20 transition-opacity duration-300"
                style={{ opacity: sliderPosition < 15 ? 0.2 : 1 }}
              >
                {activeItem.afterLabel || "Après"}
              </div>

              {/* SLIDER LINE & HANDLE */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-30"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-xl flex items-center justify-center border border-slate-200">
                  <ArrowLeftRight className="h-4 w-4 text-primary animate-pulse" />
                </div>
              </div>

              {/* Instructions on overlay */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[10px] font-medium tracking-wide flex items-center gap-1.5 z-20">
                <ArrowLeftRight className="h-3 w-3" /> Faire glisser le curseur
              </div>
            </div>

            {/* Accessible Native Range Slider for touch and keyboards */}
            <div className="w-full max-w-lg mt-4 px-2">
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                aria-label="Contrôle du curseur avant-après"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground font-semibold mt-1">
                <span>Révéler Avant</span>
                <span>Révéler Après</span>
              </div>
            </div>

          </div>

          {/* Description Card (Right 5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50 border border-border rounded-2xl p-6 shadow-sm">
              <span className="text-[11px] uppercase font-bold text-secondary tracking-widest block mb-1">
                {activeItem.category}
              </span>
              <h3 className="font-sans font-bold text-2xl text-primary mb-3">
                {activeItem.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {activeItem.description}
              </p>

              <div className="space-y-4 border-t border-border pt-6">
                <div className="flex items-start gap-2.5">
                  <div className="bg-emerald-100 text-emerald-800 p-1.5 rounded-lg mt-0.5">
                    <Heart className="h-4 w-4 fill-current" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-primary">Prestation Respectueuse</h4>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      Aucune tension sur le cuir chevelu. Produits testés sous contrôle dermatologique.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="bg-primary/10 text-primary p-1.5 rounded-lg mt-0.5">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-primary">Coupe & Ajustement Inclus</h4>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      Toutes nos perruques sont retaillées et sculptées directement sur vous pour épouser vos traits.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center lg:text-left">
              <p className="text-xs text-muted-foreground italic mb-3">
                « EXEMPLE — à vérifier : transformations réelles de notre salon de Perpignan »
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
