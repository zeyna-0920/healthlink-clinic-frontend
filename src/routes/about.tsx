import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Target, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import heroClinic from "@/assets/hero-clinic.jpg";
import drAblaye from "@/assets/dr-ablaye.jpg";
import midwifeMommy from "@/assets/midwife-mommy.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "À Propos — Clinique Moulaye Dabakh" },
      {
        name: "description",
        content: "Découvrez la mission, la vision et les valeurs de la Clinique Moulaye Dabakh.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="space-y-6">
            <p className="inline-flex rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
              Clinique digitale & humaine
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
              Une clinique moderne, chaleureuse et accessible pour toute la famille
            </h1>
            <p className="max-w-2xl text-lg text-slate-300 leading-relaxed">
              À la Clinique Moulaye Dabakh, nous allions expertise médicale, technologies de contact et
              accompagnement humain pour garantir un parcours de soins simple, rapide et serein.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
                <p className="text-4xl font-semibold text-white">24/7</p>
                <p className="mt-2 text-sm text-slate-400">Urgences et assistance patients</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
                <p className="text-4xl font-semibold text-white">15+</p>
                <p className="mt-2 text-sm text-slate-400">spécialités médicales disponibles</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/services">Voir nos services</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Nous contacter</Link>
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl shadow-slate-900/50">
            <img src={heroClinic} alt="Clinique moderne" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
          </div>
        </div>

        <section className="mt-16 grid gap-10 lg:grid-cols-3">
          <Card className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
              <Target className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">Notre mission</h2>
            <p className="text-slate-300 leading-relaxed">
              Faciliter l'accès aux soins par la prise de rendez-vous en ligne, la consultation à
              distance et la coordination proactive entre patients et équipes médicales.
            </p>
          </Card>
          <Card className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 mb-4">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">Notre vision</h2>
            <p className="text-slate-300 leading-relaxed">
              Être un modèle de soin moderne au Sénégal, centré sur la qualité, la sécurité et le
              confort de chaque patient.
            </p>
          </Card>
          <Card className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 mb-4">
              <Heart className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">Nos valeurs</h2>
            <p className="text-slate-300 leading-relaxed">
              Bienveillance, transparence et innovation guident notre accompagnement médical à
              chaque étape de votre parcours de soins.
            </p>
          </Card>
        </section>

        <section className="mt-16">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400 font-semibold mb-3">
                Équipe spécialisée
              </p>
              <h2 className="text-3xl font-bold">Une équipe de confiance pour vos soins</h2>
              <p className="mt-4 text-slate-300 leading-relaxed">
                Nos médecins, sages-femmes et infirmiers sont formés pour offrir des prises en charge
                attentives, modernes et adaptées à toute la famille.</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
                  <p className="text-4xl font-semibold text-white">120+</p>
                  <p className="mt-2 text-sm text-slate-400">personnel médical qualifié</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
                  <p className="text-4xl font-semibold text-white">98%</p>
                  <p className="mt-2 text-sm text-slate-400">satisfaction patient</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-0 shadow-xl">
                <img src={drAblaye} alt="Dr Ablaye" className="h-56 w-full object-cover" />
                <div className="p-5">
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Cardiologue</p>
                  <h3 className="mt-3 text-xl font-semibold">Dr. Ablaye</h3>
                </div>
              </Card>
              <Card className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-0 shadow-xl">
                <img src={midwifeMommy} alt="Sage-femme avec une maman" className="h-56 w-full object-cover" />
                <div className="p-5">
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Maternité</p>
                  <h3 className="mt-3 text-xl font-semibold">Accompagnement maternel</h3>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
