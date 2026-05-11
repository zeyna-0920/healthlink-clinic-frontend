import { Link } from "@tanstack/react-router";
import {
  HeartPulse,
  Phone,
  MapPin,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Send,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SiteFooter() {
  return (
    <footer className="relative mt-16 text-foreground">
      {/* CTA strip */}
      <div className="relative -mb-16 z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[image:var(--gradient-hero)] p-6 sm:p-8 shadow-[var(--shadow-card)] flex flex-col md:flex-row items-center justify-between gap-5 text-primary-foreground">
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-bold">
              Besoin d'une consultation ?
            </h3>
            <p className="text-sm opacity-90 mt-1">
              Réservez en ligne en moins de 2 minutes — réponse rapide garantie.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild size="lg" variant="secondary" className="rounded-full">
              <Link to="/rendez-vous">
                Prendre RDV <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full bg-transparent border-white/40 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
            >
              <a href="tel:+221331234567">
                <Phone className="h-4 w-4" /> Appeler
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="bg-[image:var(--gradient-soft)] border-t border-border pt-24 pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-12">
            {/* Brand */}
            <div className="md:col-span-4">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[image:var(--gradient-hero)] shadow-[var(--shadow-soft)]">
                  <HeartPulse className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
                </div>
                <div className="leading-tight">
                  <div className="font-display font-extrabold tracking-tight">
                    Clinique Moulaye Dabakh
                  </div>
                  <div className="text-[11px] font-medium text-primary uppercase tracking-wider">
                    Allo Docteur · Santé
                  </div>
                </div>
              </Link>
              <p className="mt-4 text-sm text-muted-foreground max-w-sm">
                Votre santé, notre priorité. Soins médicaux modernes, équipe expérimentée et
                accessible 24h/24 pour les urgences.
              </p>
              <div className="mt-5 flex items-center gap-2">
                <a
                  href="https://www.facebook.com/?locale=fr_FR"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="https://www.instagram.com/"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="https://twitter.com/"
                  aria-label="Twitter"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Navigation */}
            <div className="md:col-span-2">
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-foreground">
                Navigation
              </h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {[
                  { to: "/services", label: "Services" },
                  { to: "/personnel", label: "Équipe" },
                  { to: "/medicaments", label: "Médicaments" },
                  { to: "/tarifs", label: "Tarifs" },
                  { to: "/rendez-vous", label: "Rendez-vous" },
                ].map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="inline-flex items-center gap-1.5 hover:text-primary transition-colors group"
                    >
                      <span className="h-1 w-1 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="md:col-span-3">
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-foreground">
                Contact
              </h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <MapPin className="h-3.5 w-3.5" />
                  </span>
                  Rue de la Santé, Ville
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Phone className="h-3.5 w-3.5" />
                  </span>
                  +221 33 123 45 67
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Mail className="h-3.5 w-3.5" />
                  </span>
                  contact@moulaye-dabakh.sn
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-success/15 text-success">
                    <Clock className="h-3.5 w-3.5" />
                  </span>
                  <span>
                    08h – 00h · <span className="text-success font-medium">Urgences 24/7</span>
                  </span>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="md:col-span-3">
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-foreground">
                Newsletter santé
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Conseils, prévention et actualités de la clinique.
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex items-center gap-2 rounded-full border border-border bg-card p-1 pl-4 shadow-[var(--shadow-soft)]"
              >
                <Input
                  type="email"
                  placeholder="Votre email"
                  className="border-0 bg-transparent shadow-none focus-visible:ring-0 px-0 h-9 text-sm"
                />
                <Button type="submit" size="icon" className="rounded-full h-9 w-9 shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-success" />
                Vos données restent privées.
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <div>© {new Date().getFullYear()} Clinique Moulaye Dabakh. Tous droits réservés.</div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-primary transition-colors">
                Mentions légales
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Confidentialité
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                CGU
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
