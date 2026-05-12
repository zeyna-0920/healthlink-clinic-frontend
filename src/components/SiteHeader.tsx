import { Link } from "@tanstack/react-router";
import { HeartPulse, Menu, X, Phone, Clock, MapPin, CalendarCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/", label: "Accueil" },
  { to: "/about", label: "À Propos" },
  { to: "/services", label: "Services" },
  { to: "/personnel", label: "Personnel" },
  { to: "/medicaments", label: "Médicaments" },
  { to: "/rendez-vous", label: "Rendez-vous" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/tarifs", label: "Tarifs" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* Top utility bar */}
      <div className="hidden md:block bg-[image:var(--gradient-hero)] text-primary-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-xs sm:px-6 lg:px-8">
          <div className="flex items-center gap-5 opacity-95">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> Rue de la Santé, Ville
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> Consultations 08h – 00h
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
              Urgences 24h/24
            </span>
            <a
              href="tel:+221331234567"
              className="flex items-center gap-1.5 hover:underline underline-offset-4"
            >
              <Phone className="h-3.5 w-3.5" /> +221 33 123 45 67
            </a>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div
        className={`border-b transition-all ${
          scrolled
            ? "border-border/60 bg-background/85 backdrop-blur-xl shadow-[var(--shadow-soft)]"
            : "border-transparent bg-background/60 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[image:var(--gradient-hero)] shadow-[var(--shadow-card)] group-hover:scale-105 group-hover:rotate-3 transition-transform">
                <HeartPulse className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-success ring-2 ring-background">
                <span className="h-1.5 w-1.5 rounded-full bg-success-foreground" />
              </span>
            </div>
            <div className="leading-tight">
              <div className="font-display font-extrabold text-foreground tracking-tight text-[15px]">
                Clinique Moulaye Dabakh
              </div>
              <div className="text-[11px] font-medium text-primary -mt-0.5 uppercase tracking-wider">
                Allo Docteur · Santé
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5 rounded-full border border-border/60 bg-card/60 backdrop-blur px-1.5 py-1.5 shadow-[var(--shadow-soft)]">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="px-3 py-1.5 text-[13px] font-medium text-muted-foreground rounded-full hover:text-primary hover:bg-accent/60 transition-colors"
                activeProps={{
                  className:
                    "px-3 py-1.5 text-[13px] font-semibold rounded-full text-primary-foreground bg-[image:var(--gradient-hero)] shadow-[var(--shadow-soft)]",
                }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/auth">Connexion</Link>
            </Button>
            <Button asChild size="sm" className="rounded-full shadow-[var(--shadow-soft)]">
              <Link to="/rendez-vous">
                <CalendarCheck className="h-4 w-4" />
                Prendre RDV
              </Link>
            </Button>
          </div>

          <button
            className="lg:hidden p-2 rounded-md hover:bg-accent"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden border-t border-border bg-background">
            <nav className="flex flex-col p-4 gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-muted-foreground rounded-md hover:bg-accent"
                  activeProps={{
                    className: "px-3 py-2 text-sm font-medium rounded-md text-primary bg-accent",
                  }}
                  activeOptions={{ exact: item.to === "/" }}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex gap-2 pt-2">
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link to="/auth" onClick={() => setOpen(false)}>
                    Connexion
                  </Link>
                </Button>
                <Button asChild size="sm" className="flex-1">
                  <Link to="/rendez-vous" onClick={() => setOpen(false)}>
                    RDV
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
