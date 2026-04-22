import { Link } from "@tanstack/react-router";
import { Stethoscope, Phone, MapPin, Mail } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-[image:var(--gradient-soft)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[image:var(--gradient-hero)]">
                <Stethoscope className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
              </div>
              <div className="font-display font-bold">Moulaye Dabakh</div>
            </div>
            <p className="text-sm text-muted-foreground">
              Votre santé, notre priorité. Soins médicaux modernes et accessibles.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm">Navigation</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/services" className="hover:text-primary">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/personnel" className="hover:text-primary">
                  Équipe
                </Link>
              </li>
              <li>
                <Link to="/tarifs" className="hover:text-primary">
                  Tarifs
                </Link>
              </li>
              <li>
                <Link to="/rendez-vous" className="hover:text-primary">
                  Rendez-vous
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm">Horaires</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                Consultations : <span className="text-foreground font-medium">08h – 00h</span>
              </li>
              <li>
                Urgences : <span className="text-success font-medium">24h/24 – 7j/7</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                Rue de la Santé, Ville
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                +221 33 123 45 67
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                contact@moulaye-dabakh.sn
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Clinique Moulaye Dabakh. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
