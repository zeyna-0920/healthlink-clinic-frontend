import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Stethoscope,
  Video,
  BedDouble,
  Syringe,
  ClipboardList,
  HeartPulse,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import heroClinic from "@/assets/teleconsult.jpg";
import nurseMaissa from "@/assets/nurse-maissa.jpg";

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
    title: "Consultations spécialisées",
    desc: "Médecins généralistes et spécialistes pour un diagnostic complet et personnalisé.",
    color: "text-primary",
    badge: "Consultations sur place",
  },
  {
    icon: Video,
    title: "Téléconsultation sécurisée",
    desc: "Consultations vidéo rapides et confidentielles, pour gagner du temps sans vous déplacer.",
    color: "text-medical",
    badge: "Disponible 7j/7",
  },
  {
    icon: BedDouble,
    title: "Hospitalisation premium",
    desc: "Chambres modernes, suivi 24h/24 et coordination totale avec nos équipes soignantes.",
    color: "text-success",
    badge: "Lits disponibles en temps réel",
  },
  {
    icon: Syringe,
    title: "Soins infirmiers",
    desc: "Pansements, perfusions et soins post-opératoires réalisés par une équipe dédiée.",
    color: "text-primary",
    badge: "Soins personnalisés",
  },
  {
    icon: ClipboardList,
    title: "Suivi médical",
    desc: "Dossier patient digital, rappels de rendez-vous et historique de soins centralisés.",
    color: "text-medical",
    badge: "Piloté par la technologie",
  },
  {
    icon: HeartPulse,
    title: "Urgences 24h/24",
    desc: "Service d'urgence rapide et bien organisé, avec prise en charge prioritaire.",
    color: "text-destructive",
    badge: "Intervention immédiate",
  },
];

function ServicesPage() {
  return (
    <div className="bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] items-center">
          <div className="space-y-6">
            <p className="inline-flex rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
              Soins complets pour toute la famille
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
              Des services médicaux modernes, fiables et faciles d'accès
            </h1>
            <p className="max-w-2xl text-lg text-slate-300 leading-relaxed">
              De la consultation à l'hospitalisation en passant par la téléconsultation, notre
              clinique propose une prise en charge complète avec des technologies de suivi et une
              équipe dédiée.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                <p className="text-4xl font-semibold text-white">6</p>
                <p className="mt-2 text-sm text-slate-400">services phares</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
                <p className="text-4xl font-semibold text-white">24/7</p>
                <p className="mt-2 text-sm text-slate-400">urgence et assistance</p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl shadow-slate-900/50">
            <img src={heroClinic} alt="Téléconsultation à la clinique" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-transparent" />
            <div className="absolute bottom-6 left-6 rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-lg backdrop-blur">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Nos services</p>
              <p className="mt-2 text-xl font-semibold">Téléconsultation & suivi digital</p>
            </div>
          </div>
        </div>

        <section className="mt-16 grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <Card key={service.title} className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-6 transition hover:-translate-y-1 hover:shadow-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-white shadow-sm mb-5">
                <service.icon className={`h-7 w-7 ${service.color}`} />
              </div>
              <h2 className="text-2xl font-semibold mb-3 text-white">{service.title}</h2>
              <p className="text-slate-300 leading-relaxed mb-4">{service.desc}</p>
              <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                {service.badge}
              </span>
            </Card>
          ))}
        </section>

        <section className="mt-16 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] items-center">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-400 font-semibold">Pourquoi nous choisir</p>
            <h2 className="text-3xl font-bold">Un accompagnement de qualité à chaque étape</h2>
            <p className="text-slate-300 leading-relaxed">
              Nous nous engageons à fournir un suivi professionnel, des infrastructures modernes et
              une organisation fluide pour réduire l’attente et améliorer l’expérience patient.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
                <p className="text-2xl font-semibold text-white">98%</p>
                <p className="mt-2 text-sm text-slate-400">taux de satisfaction patient</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
                <p className="text-2xl font-semibold text-white">15+</p>
                <p className="mt-2 text-sm text-slate-400">spécialités médicales</p>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Button asChild size="lg">
                <Link to="/rendez-vous">Prendre un rendez-vous</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Contacter un conseiller</Link>
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl shadow-slate-900/50">
            <img src={nurseMaissa} alt="Infirmière en soins actifs" className="h-full w-full object-cover" />
          </div>
        </section>
      </div>
    </div>
  );
}
