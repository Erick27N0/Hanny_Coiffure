import { Link } from "@tanstack/react-router";
import { Facebook, MapPin, Phone, Mail, Clock } from "lucide-react";
import { salonInfo } from "@/data/salonInfo";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-white">
      <div className="container mx-auto grid gap-10 px-4 py-14 md:grid-cols-4 md:px-6">
        <div>
          <p className="font-sans font-bold text-xl text-primary">Hanny Tresse</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Coiffure afro & perruques médicalisées à Perpignan. Expertise, écoute et qualité.
          </p>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-primary uppercase tracking-wider">Navigation</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/coiffure-afro" className="hover:text-secondary">Coiffure afro</Link></li>
            <li><Link to="/perruques-medicalisees" className="hover:text-secondary">Perruques médicalisées</Link></li>
            <li><Link to="/boutique" className="hover:text-secondary">Boutique</Link></li>
            <li><Link to="/a-propos" className="hover:text-secondary">À propos</Link></li>
            <li><Link to="/contact" className="hover:text-secondary">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-primary uppercase tracking-wider">Contact</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
              <span>{salonInfo.address.street}<br />{salonInfo.address.city}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-secondary" />
              <a href={`tel:${salonInfo.phone}`} className="hover:text-secondary">{salonInfo.phoneDisplay}</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-secondary" />
              <a href={`mailto:${salonInfo.email}`} className="hover:text-secondary">{salonInfo.email}</a>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-primary uppercase tracking-wider">Horaires</p>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {salonInfo.hours.map((h) => (
              <li key={h.day} className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                <span><span className="text-foreground/80 font-medium">{h.day}</span> — {h.value}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex gap-3">
            <a
              href={salonInfo.social.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="text-muted-foreground hover:text-secondary"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href={salonInfo.social.instagram}
              target="_blank"
              rel="noreferrer"
              className="text-xs uppercase tracking-wider text-muted-foreground hover:text-secondary font-medium"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border bg-slate-50">
        <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground md:flex-row md:px-6">
          <p>© {new Date().getFullYear()} Hanny Tresse — Tous droits réservés.</p>
          <p>Site MVP — Coiffure afro & perruques médicalisées Perpignan</p>
        </div>
      </div>
    </footer>
  );
}
