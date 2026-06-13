import { createFileRoute, Link } from "@tanstack/react-router";
import { Stethoscope, Video, BedDouble, Syringe, ClipboardList, HeartPulse } from "lucide-react";
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
    gradient: "from-[#1D9E75] to-[#0F6E56]",
    shadow: "shadow-[#1D9E75]/20",
    badge: "Consultations sur place",
  },
  {
    icon: Video,
    title: "Téléconsultation sécurisée",
    desc: "Consultations vidéo rapides et confidentielles, pour gagner du temps sans vous déplacer.",
    gradient: "from-[#0F6E56] to-[#085041]",
    shadow: "shadow-[#0F6E56]/20",
    badge: "Disponible 7j/7",
  },
  {
    icon: BedDouble,
    title: "Hospitalisation premium",
    desc: "Chambres modernes, suivi 24h/24 et coordination totale avec nos équipes soignantes.",
    gradient: "from-[#085041] to-[#063D31]",
    shadow: "shadow-[#085041]/20",
    badge: "Lits disponibles en temps réel",
  },
  {
    icon: Syringe,
    title: "Soins infirmiers",
    desc: "Pansements, perfusions et soins post-opératoires réalisés par une équipe dédiée.",
    gradient: "from-[#1D9E75] to-[#0F6E56]",
    shadow: "shadow-[#1D9E75]/20",
    badge: "Soins personnalisés",
  },
  {
    icon: ClipboardList,
    title: "Suivi médical",
    desc: "Dossier patient digital, rappels de rendez-vous et historique de soins centralisés.",
    gradient: "from-[#0F6E56] to-[#085041]",
    shadow: "shadow-[#0F6E56]/20",
    badge: "Piloté par la technologie",
  },
  {
    icon: HeartPulse,
    title: "Urgences 24h/24",
    desc: "Service d'urgence rapide et bien organisé, avec prise en charge prioritaire.",
    gradient: "from-[#085041] to-[#063D31]",
    shadow: "shadow-[#085041]/20",
    badge: "Intervention immédiate",
  },
];

function ServicesPage() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] items-center">
          <div className="space-y-6">
            <p className="inline-flex rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
              Soins complets pour toute la famille
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
              Des services médicaux modernes, fiables et faciles d'accès
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed">
              De la consultation à l'hospitalisation en passant par la téléconsultation, notre
              clinique propose une prise en charge complète avec des technologies de suivi et une
              équipe dédiée.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="group relative overflow-hidden rounded-3xl border-none bg-gradient-to-br from-[#0F6E56] to-[#085041] p-6 text-white shadow-lg transition-all duration-300 hover:shadow-[#0F6E56]/20 hover:-translate-y-1">
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-xl transition-all group-hover:bg-white/20" />
                <p className="relative z-10 text-4xl font-black tracking-tighter">6</p>
                <p className="relative z-10 mt-2 text-sm font-bold uppercase tracking-wider text-white">
                  services phares
                </p>
              </div>
              <div className="group relative overflow-hidden rounded-3xl border-none bg-gradient-to-br from-[#1D9E75] to-[#0F6E56] p-6 text-white shadow-lg transition-all duration-300 hover:shadow-[#1D9E75]/20 hover:-translate-y-1">
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-xl transition-all group-hover:bg-white/20" />
                <p className="relative z-10 text-4xl font-black tracking-tighter">24/7</p>
                <p className="relative z-10 mt-2 text-sm font-bold uppercase tracking-wider text-white">
                  urgence et assistance
                </p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-border/40 shadow-2xl">
            <img
              src={heroClinic}
              alt="Téléconsultation à la clinique"
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 rounded-[2rem] border-none bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center shadow-inner">
                  <Video className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/90 font-bold">
                    Nos services
                  </p>
                  <p className="text-xl font-bold text-white">Téléconsultation & suivi digital</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card
              key={service.title}
              className={`group relative overflow-hidden rounded-[2.5rem] border-none bg-gradient-to-br ${service.gradient} p-8 text-white shadow-xl transition-all duration-500 hover:shadow-2xl hover:${service.shadow} hover:-translate-y-2`}
            >
              <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-2xl transition-all group-hover:bg-white/20" />

              <div className="relative z-10 space-y-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <service.icon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2 tracking-tight">{service.title}</h2>
                  <p className="text-white leading-relaxed font-medium">
                    {service.desc}
                  </p>
                </div>
                <div className="pt-2">
                  <span className="inline-flex rounded-xl bg-white/20 backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                    {service.badge}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </section>

        <section className="mt-12 grid gap-16 lg:grid-cols-[0.95fr_1.05fr] items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="inline-flex rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
                Pourquoi nous choisir
              </p>
              <h2 className="text-4xl font-bold tracking-tight">
                Un accompagnement de qualité à chaque étape
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Nous nous engageons à fournir un suivi professionnel, des infrastructures modernes
                et une organisation fluide pour réduire l’attente et améliorer l’expérience patient.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="group relative overflow-hidden rounded-3xl border-none bg-gradient-to-br from-[#1D9E75] to-[#0F6E56] p-6 text-white shadow-lg transition-all duration-300 hover:shadow-[#1D9E75]/20 hover:-translate-y-1">
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-xl transition-all group-hover:bg-white/20" />
                <p className="relative z-10 text-4xl font-black tracking-tighter">98%</p>
                <p className="relative z-10 mt-2 text-sm font-bold uppercase tracking-wider text-white">
                  taux de satisfaction patient
                </p>
              </div>
              <div className="group relative overflow-hidden rounded-3xl border-none bg-gradient-to-br from-[#0F6E56] to-[#085041] p-6 text-white shadow-lg transition-all duration-300 hover:shadow-[#0F6E56]/20 hover:-translate-y-1">
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-xl transition-all group-hover:bg-white/20" />
                <p className="relative z-10 text-4xl font-black tracking-tighter">15+</p>
                <p className="relative z-10 mt-2 text-sm font-bold uppercase tracking-wider text-white">
                  spécialités médicales
                </p>
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
          <div className="overflow-hidden rounded-[2rem] border border-border/40 shadow-2xl">
            <img
              src={nurseMaissa}
              alt="Infirmière en soins actifs"
              className="h-full w-full object-cover"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
