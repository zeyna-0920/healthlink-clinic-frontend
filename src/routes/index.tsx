import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, Video, BedDouble, Stethoscope, ShieldCheck, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import heroImg from "@/assets/hero-clinic.jpg";
import teleImg from "@/assets/teleconsult.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Allo Docteur — Clinique Moulaye Dabakh" },
      { name: "description", content: "Prenez rendez-vous en ligne, consultez à distance et évitez les déplacements inutiles." },
    ],
  }),
  component: HomePage,
});

const TOTAL_BEDS = 20;
const OCCUPIED = 18;
const AVAILABLE = TOTAL_BEDS - OCCUPIED;

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[image:var(--gradient-soft)]" />
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-medical/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-success/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary mb-6">
                <ShieldCheck className="h-3.5 w-3.5" />
                Soins certifiés et accessibles
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight">
                Allo <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">Docteur</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl">
                La <strong className="text-foreground">Clinique Moulaye Dabakh</strong> facilite l'accès aux soins grâce à la digitalisation. Prenez rendez-vous en ligne, consultez à distance et évitez les déplacements inutiles.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="shadow-[var(--shadow-card)]">
                  <Link to="/rendez-vous"><Calendar className="mr-2 h-4 w-4" />Prendre rendez-vous</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/services"><Video className="mr-2 h-4 w-4" />Consulter en ligne</Link>
                </Button>
              </div>

              <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" />+5000 patients</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" />Équipe expérimentée</div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-[var(--shadow-card)] ring-1 ring-border">
                <img src={heroImg} alt="Médecin de la Clinique Moulaye Dabakh" width={1280} height={896} className="w-full h-auto" />
              </div>
              <Card className="absolute -bottom-4 -left-4 sm:-left-8 p-4 max-w-[200px] hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/15">
                    <BedDouble className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Lits disponibles</div>
                    <div className="font-bold text-foreground">{AVAILABLE} / {TOTAL_BEDS}</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK ACCESS CARDS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-5 md:grid-cols-3">
          <Card className="p-6 hover:shadow-[var(--shadow-card)] transition-shadow border-l-4 border-l-primary">
            <Calendar className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold mb-1">Rendez-vous en ligne</h3>
            <p className="text-sm text-muted-foreground mb-4">Réservez votre consultation en quelques clics.</p>
            <Link to="/rendez-vous" className="text-sm font-medium text-primary inline-flex items-center gap-1">Réserver <ArrowRight className="h-3.5 w-3.5" /></Link>
          </Card>
          <Card className="p-6 hover:shadow-[var(--shadow-card)] transition-shadow border-l-4 border-l-success">
            <BedDouble className="h-8 w-8 text-success mb-3" />
            <h3 className="font-semibold mb-1">Disponibilité des lits</h3>
            <p className="text-sm text-muted-foreground mb-4">Suivi en temps réel de notre capacité.</p>
            <div className="inline-flex items-center gap-2 rounded-md bg-success/10 px-3 py-1.5 text-sm font-semibold text-success">
              <BedDouble className="h-4 w-4" />Lits : {AVAILABLE} / {TOTAL_BEDS}
            </div>
          </Card>
          <Card className="p-6 hover:shadow-[var(--shadow-card)] transition-shadow border-l-4 border-l-medical">
            <Clock className="h-8 w-8 text-medical mb-3" />
            <h3 className="font-semibold mb-1">Tarifs accessibles</h3>
            <p className="text-sm text-muted-foreground mb-4">Enfant : 500 FCFA · Adulte : 1000 FCFA</p>
            <Link to="/tarifs" className="text-sm font-medium text-medical inline-flex items-center gap-1">Voir les tarifs <ArrowRight className="h-3.5 w-3.5" /></Link>
          </Card>
        </div>
      </section>

      {/* TELECONSULT */}
      <section className="bg-[image:var(--gradient-soft)] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <img src={teleImg} alt="Téléconsultation" loading="lazy" width={1024} height={768} className="rounded-3xl shadow-[var(--shadow-card)]" />
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-medical/10 px-3 py-1 text-xs font-medium text-medical mb-4">
              <Video className="h-3.5 w-3.5" />Téléconsultation
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Consultez votre médecin depuis chez vous</h2>
            <p className="text-muted-foreground mb-6">
              Gagnez du temps grâce à nos consultations vidéo sécurisées. Idéal pour le suivi, les conseils médicaux ou les ordonnances simples.
            </p>
            <ul className="space-y-3 mb-6">
              {["Consultation vidéo HD", "Ordonnance numérique", "Dossier médical centralisé", "Disponible 7j/7"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />{f}
                </li>
              ))}
            </ul>
            <Button asChild><Link to="/rendez-vous">Démarrer une téléconsultation</Link></Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-3xl bg-[image:var(--gradient-hero)] p-10 sm:p-14 text-center text-primary-foreground relative overflow-hidden">
          <Stethoscope className="absolute -top-8 -right-8 h-48 w-48 opacity-10" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Votre santé n'attend pas</h2>
          <p className="opacity-90 mb-6 max-w-xl mx-auto">Réservez votre consultation maintenant et bénéficiez d'une prise en charge rapide par notre équipe médicale.</p>
          <Button asChild size="lg" variant="secondary">
            <Link to="/rendez-vous">Prendre rendez-vous maintenant</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
