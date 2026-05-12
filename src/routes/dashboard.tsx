import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Users, BedDouble, CreditCard, Bell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Tableau de bord — Clinique Moulaye Dabakh" },
      {
        name: "description",
        content: "Accédez aux interfaces patients, lits, paiements et notifications.",
      },
    ],
  }),
  component: DashboardPage,
});

const items = [
  {
    icon: Users,
    title: "Patients",
    description: "Consultez et recherchez les dossiers patients.",
    to: "/patients",
    color: "text-primary",
  },
  {
    icon: BedDouble,
    title: "Lits",
    description: "Suivez la disponibilité et l'état des lits.",
    to: "/beds",
    color: "text-success",
  },
  {
    icon: CreditCard,
    title: "Paiements",
    description: "Affichez l'historique des transactions et des statuts.",
    to: "/payments",
    color: "text-medical",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Vérifiez les notifications des patients et les rappels.",
    to: "/notifications",
    color: "text-destructive",
  },
];

function DashboardPage() {
  return (
    <div className="bg-[image:var(--gradient-soft)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-medical font-semibold mb-3">
            Tableau de bord clinique
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Pilotez votre activité</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Accédez rapidement aux ressources patients, lits, paiements et notifications pour votre clinique.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {items.map((item) => (
            <Card key={item.title} className="p-8 border border-border/60 shadow-[var(--shadow-soft)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted mb-5 text-xl">
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <h2 className="text-2xl font-semibold mb-3">{item.title}</h2>
              <p className="text-sm text-muted-foreground mb-6">{item.description}</p>
              <Button asChild variant="outline">
                <Link to={item.to}>Voir</Link>
              </Button>
            </Card>
          ))}
        </div>

        <Card className="mt-12 p-6 bg-[image:var(--gradient-soft)] border-primary/20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Cette section est la porte d'entrée des interfaces back-office liées au serveur.</p>
            </div>
            <Button asChild>
              <Link to="/rendez-vous">Prendre un rendez-vous</Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
