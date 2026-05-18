import { Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Baby, User } from "lucide-react";
import { TARIFFS } from "@/lib/pricing";

const tarifsGrid = [
  {
    period: "jour",
    label: "Consultation de jour",
    icon: Sun,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    ring: "ring-amber-500/20",
    gradient: "from-amber-500/10 to-orange-400/5",
    child: TARIFFS.jour.child,
    adult: TARIFFS.jour.adult,
    hours: TARIFFS.jour.hours,
  },
  {
    period: "nuit",
    label: "Consultation de nuit",
    icon: Moon,
    color: "text-medical",
    bg: "bg-medical/10",
    ring: "ring-medical/20",
    gradient: "from-medical/10 to-primary/5",
    child: TARIFFS.nuit.child,
    adult: TARIFFS.nuit.adult,
    hours: TARIFFS.nuit.hours,
  },
] as const;

type Props = { showCta?: boolean };

export function TarifsGrid({ showCta = true }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-2">Grille tarifaire</h2>
      <p className="text-center text-muted-foreground mb-8 max-w-xl mx-auto">
        Consultation standard : tarif jour (08h–19h) ou tarif nuit (à partir de 20h).
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        {tarifsGrid.map((t) => (
          <Card
            key={t.period}
            className={`overflow-hidden ring-1 ${t.ring} hover:shadow-lg transition-shadow`}
          >
            <div className={`bg-gradient-to-br ${t.gradient} p-6`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${t.bg}`}>
                  <t.icon className={`h-6 w-6 ${t.color}`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{t.label}</h3>
                  <p className="text-sm text-muted-foreground">{t.hours}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-card/80">
                  <span className="flex items-center gap-2 font-medium">
                    <Baby className="h-4 w-4 text-primary" /> Enfant
                  </span>
                  <span className="text-lg font-bold text-primary">
                    {t.child.toLocaleString("fr-FR")}{" "}
                    <span className="text-xs font-normal">FCFA</span>
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-card/80">
                  <span className="flex items-center gap-2 font-medium">
                    <User className="h-4 w-4 text-primary" /> Adulte
                  </span>
                  <span className="text-lg font-bold text-primary">
                    {t.adult.toLocaleString("fr-FR")}{" "}
                    <span className="text-xs font-normal">FCFA</span>
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {showCta && (
        <Card className="mt-8 p-6 text-center border-dashed">
          <p className="text-muted-foreground mb-4">
            Prenez d&apos;abord un rendez-vous pour accéder au paiement en ligne.
          </p>
          <Button asChild>
            <Link to="/rendez-vous">Prendre rendez-vous</Link>
          </Button>
        </Card>
      )}
    </div>
  );
}
