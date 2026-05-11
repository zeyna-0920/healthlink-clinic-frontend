import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Sun, Moon, Baby, User } from "lucide-react";

export const Route = createFileRoute("/tarifs")({
  head: () => ({
    meta: [
      { title: "Tarifs — Clinique Moulaye Dabakh" },
      {
        name: "description",
        content: "Tarifs des consultations jour et nuit, enfants et adultes.",
      },
    ],
  }),
  component: TarifsPage,
});

const tarifs = [
  {
    period: "Jour",
    icon: Sun,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    child: 500,
    adult: 1000,
  },
  {
    period: "Nuit",
    icon: Moon,
    color: "text-medical",
    bg: "bg-medical/10",
    child: 1000,
    adult: 2000,
  },
];

function TarifsPage() {
  return (
    <div className="bg-[image:var(--gradient-soft)]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Nos tarifs</h1>
          <p className="text-lg text-muted-foreground">
            Des prix transparents et accessibles à tous.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {tarifs.map((t) => (
            <Card
              key={t.period}
              className="p-8 hover:shadow-[var(--shadow-card)] transition-shadow"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${t.bg}`}>
                  <t.icon className={`h-6 w-6 ${t.color}`} />
                </div>
                <h2 className="text-2xl font-bold">{t.period}</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                  <div className="flex items-center gap-3">
                    <Baby className="h-5 w-5 text-primary" />
                    <span className="font-medium">Enfant</span>
                  </div>
                  <span className="text-xl font-bold text-primary">
                    {t.child} <span className="text-sm font-normal">FCFA</span>
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-primary" />
                    <span className="font-medium">Adulte</span>
                  </div>
                  <span className="text-xl font-bold text-primary">
                    {t.adult} <span className="text-sm font-normal">FCFA</span>
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="mt-8 p-6 bg-[image:var(--gradient-soft)] border-primary/20">
          <p className="text-sm text-muted-foreground text-center">
            Les tarifs s'appliquent pour les consultations standard. Les actes spécifiques
            (hospitalisation, soins, examens) sont facturés séparément. Le trésorier de la clinique
            reste à votre disposition pour toute information.
          </p>
        </Card>
      </div>
    </div>
  );
}
