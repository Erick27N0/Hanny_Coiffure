import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { salonInfo } from "@/data/salonInfo";

const navItems = [
  { to: "/", label: "Accueil" },
  { to: "/coiffure-afro", label: "Coiffure afro" },
  { to: "/perruques-medicalisees", label: "Perruques médicalisées" },
  { to: "/boutique", label: "Boutique" },
  { to: "/a-propos", label: "À propos" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white/90 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex flex-col leading-tight">
          <span className="font-sans font-bold text-xl tracking-tight text-primary">
            Hanny Tresse
          </span>
          <span className="text-[10px] tracking-[0.18em] text-secondary font-medium">
            PERPIGNAN
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm text-foreground/80 transition-colors hover:text-secondary font-medium"
              activeProps={{ className: "text-secondary font-bold" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${salonInfo.phone}`}
            className="hidden items-center gap-2 text-sm text-muted-foreground hover:text-secondary md:flex"
            aria-label="Appeler le salon"
          >
            <Phone className="h-4 w-4" />
            {salonInfo.phoneDisplay}
          </a>
          <Button asChild size="sm" className="hidden md:inline-flex bg-primary hover:bg-primary/90 text-white rounded-lg">
            <Link to="/contact">Prendre RDV</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetTitle className="font-sans font-bold text-xl text-primary">Menu</SheetTitle>
              <nav className="mt-6 flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2 text-base text-foreground hover:bg-muted"
                    activeProps={{ className: "bg-muted text-secondary font-bold" }}
                    activeOptions={{ exact: item.to === "/" }}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <Button asChild className="mt-6 w-full bg-primary hover:bg-primary/90">
                <Link to="/contact" onClick={() => setOpen(false)}>
                  Prendre rendez-vous
                </Link>
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
