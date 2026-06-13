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
    gradient: "from-[#1D9E75] to-[#1D9E75]",
    shadow: "shadow-[#1D9E75]/20",
    hours: TARIFFS.jour.hours,
    child: TARIFFS.jour.child,
    adult: TARIFFS.jour.adult,
  },
  {
    period: "nuit",
    label: "Consultation de nuit",
    icon: Moon,
    gradient: "from-[#085041] to-[#085041]",
    shadow: "shadow-[#085041]/20",
    hours: TARIFFS.nuit.hours,
    child: TARIFFS.nuit.child,
    adult: TARIFFS.nuit.adult,
  },
] as const;

type Props = { showCta?: boolean };

export function TarifsGrid({ showCta = true }: Props) {
  return (
    <div className="space-y-10">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-extrabold tracking-tight">Grille tarifaire</h2>
        <p className="text-muted-foreground max-w-xl mx-auto text-lg">
          Consultation standard : tarif jour (08h–19h) ou tarif nuit (à partir de 20h).
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {tarifsGrid.map((t) => (
          <Card
            key={t.period}
            className={`group relative overflow-hidden border-none text-white shadow-xl transition-all duration-500 hover:shadow-2xl hover:${t.shadow} hover:-translate-y-2 bg-gradient-to-br ${t.gradient}`}
          >
            <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-2xl transition-all group-hover:bg-white/20" />

            <div className="p-8 relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                  <t.icon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight">{t.label}</h3>
                  <p className="text-white/80 font-bold uppercase tracking-widest text-xs">
                    {t.hours}
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="flex items-center justify-between p-5 rounded-[1.5rem] bg-white/15 backdrop-blur-sm border border-white/10 transition-colors group-hover:bg-white/20">
                  <span className="flex items-center gap-3 font-bold text-lg">
                    <Baby className="h-6 w-6" /> Enfant
                  </span>
                  <div className="text-right">
                    <span className="text-3xl font-black">
                      {t.child.toLocaleString("fr-FR")}
                    </span>
                    <span className="ml-1.5 text-xs font-bold opacity-70">FCFA</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-5 rounded-[1.5rem] bg-white/15 backdrop-blur-sm border border-white/10 transition-colors group-hover:bg-white/20">
                  <span className="flex items-center gap-3 font-bold text-lg">
                    <User className="h-6 w-6" /> Adulte
                  </span>
                  <div className="text-right">
                    <span className="text-3xl font-black">
                      {t.adult.toLocaleString("fr-FR")}
                    </span>
                    <span className="ml-1.5 text-xs font-bold opacity-70">FCFA</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {showCta && (
        <Card className="p-10 text-center border-none bg-[#f0faf6] rounded-[12px] shadow-inner relative overflow-hidden group">
          <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl transition-all group-hover:bg-primary/10" />
          <p className="text-slate-500 mb-6 text-lg font-medium relative z-10">
            Prenez d&apos;abord un rendez-vous pour accéder au paiement en ligne.
          </p>
          <Button asChild size="lg" className="rounded-2xl px-10 h-14 font-bold relative z-10">
            <Link to="/rendez-vous">Prendre rendez-vous</Link>
          </Button>
        </Card>
      )}
    </div>
  );
}
