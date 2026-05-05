import { createFileRoute, Link } from "@tanstack/react-router";
import { Stethoscope, Video, BedDouble, Syringe, ClipboardList, HeartPulse } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Clinique Moulaye Dabakh" },
      {
        name: "description",
        content:
          "Consultations, téléconsultations, hospitalisation, soins infirmiers et suivi des patients.",
      },
    ],
  }),
  component: ServicesPage,
});

const services = [
  {
    icon: Stethoscope,
    title: "Consultation médicale",
    desc: "Examens complets par nos médecins généralistes et spécialistes.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Video,
    title: "Téléconsultation",
    desc: "Consultez à distance par vidéo sécurisée, où que vous soyez.",
    color: "text-medical",
    bg: "bg-medical/10",
  },
  {
    icon: BedDouble,
    title: "Hospitalisation",
    desc: "Chambres confortables et équipées, gestion en temps réel des lits.",
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    icon: Syringe,
    title: "Soins infirmiers",
    desc: "Pansements, injections, perfusions et soins post-opératoires.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: ClipboardList,
    title: "Suivi des patients",
    desc: "Dossier médical numérique et suivi personnalisé sur le long terme.",
    color: "text-medical",
    bg: "bg-medical/10",
  },
  {
    icon: HeartPulse,
    title: "Urgences 24h/24",
    desc: "Service d'urgence toujours ouvert, prise en charge prioritaire.",
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
];

function ServicesPage() {
  return (
    <div className="bg-[image:var(--gradient-soft)]">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Nos services</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Un éventail complet de soins pour répondre à tous vos besoins de santé.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <Card
            key={s.title}
            className="p-6 hover:shadow-[var(--shadow-card)] hover:-translate-y-1 transition-all"
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.bg} mb-4`}>
              <s.icon className={`h-6 w-6 ${s.color}`} />
            </div>
            <h3 className="text-lg font-bold mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground">{s.desc}</p>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button asChild size="lg">
          <Link to="/rendez-vous">Prendre rendez-vous</Link>
        </Button>
      </div>
    </div>
  );
}
