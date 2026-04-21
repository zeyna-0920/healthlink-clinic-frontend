import { Link } from "@tanstack/react-router";
import { Stethoscope, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/", label: "Accueil" },
  { to: "/about", label: "À Propos" },
  { to: "/services", label: "Services" },
  { to: "/personnel", label: "Personnel" },
  { to: "/rendez-vous", label: "Rendez-vous" },
  { to: "/tarifs", label: "Tarifs" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[image:var(--gradient-hero)] shadow-[var(--shadow-soft)] group-hover:scale-105 transition-transform">
            <Stethoscope className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="hidden sm:block leading-tight">
            <div className="font-display font-bold text-foreground">Clinique</div>
            <div className="text-xs text-muted-foreground -mt-0.5">Moulaye Dabakh</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="px-3 py-2 text-sm font-medium text-muted-foreground rounded-md hover:text-primary hover:bg-accent transition-colors"
              activeProps={{ className: "px-3 py-2 text-sm font-medium rounded-md text-primary bg-accent" }}
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
          <Button asChild size="sm">
            <Link to="/rendez-vous">Prendre RDV</Link>
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
                activeProps={{ className: "px-3 py-2 text-sm font-medium rounded-md text-primary bg-accent" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link to="/auth" onClick={() => setOpen(false)}>Connexion</Link>
              </Button>
              <Button asChild size="sm" className="flex-1">
                <Link to="/rendez-vous" onClick={() => setOpen(false)}>RDV</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
