import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Target, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import heroAbout from "@/assets/nurse-mariama.jpg";
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
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="space-y-6">
            <p className="inline-flex rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
              Clinique digitale & humaine
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
              Une clinique moderne, chaleureuse et accessible pour toute la famille
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed">
              À la Clinique Moulaye Dabakh, nous allions expertise médicale, technologies de contact
              et accompagnement humain pour garantir un parcours de soins simple, rapide et serein.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="group relative overflow-hidden rounded-3xl border-none bg-gradient-to-br from-red-500 to-rose-600 p-6 text-white shadow-lg transition-all duration-300 hover:shadow-rose-500/20 hover:-translate-y-1">
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-xl transition-all group-hover:bg-white/20" />
                <p className="relative z-10 text-4xl font-black tracking-tighter">24/7</p>
                <p className="relative z-10 mt-2 text-sm font-bold uppercase tracking-wider text-rose-50/90">
                  Urgences et assistance patients
                </p>
              </div>
              <div className="group relative overflow-hidden rounded-3xl border-none bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white shadow-lg transition-all duration-300 hover:shadow-blue-500/20 hover:-translate-y-1">
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-xl transition-all group-hover:bg-white/20" />
                <p className="relative z-10 text-4xl font-black tracking-tighter">15+</p>
                <p className="relative z-10 mt-2 text-sm font-bold uppercase tracking-wider text-blue-50/90">
                  spécialités médicales disponibles
                </p>
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

          <div className="overflow-hidden rounded-[2rem] border border-border/40 shadow-2xl">
            <img
              src={heroAbout}
              alt="Clinique moderne"
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>

        <section className="mt-16 grid gap-10 lg:grid-cols-3">
          <Card className="group relative overflow-hidden rounded-[2.5rem] border-none bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20">
            <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-2xl transition-all group-hover:bg-white/20" />
            <div className="relative z-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md mb-6 shadow-inner">
                <Target className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4 tracking-tight">Notre mission</h2>
              <p className="text-blue-50/90 leading-relaxed text-lg">
                Faciliter l'accès aux soins par la prise de rendez-vous en ligne, la consultation à
                distance et la coordination proactive entre patients et équipes médicales.
              </p>
            </div>
          </Card>

          <Card className="group relative overflow-hidden rounded-[2.5rem] border-none bg-gradient-to-br from-emerald-500 to-teal-700 p-8 text-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/20">
            <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-2xl transition-all group-hover:bg-white/20" />
            <div className="relative z-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md mb-6 shadow-inner">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4 tracking-tight">Notre vision</h2>
              <p className="text-emerald-50/90 leading-relaxed text-lg">
                Être un modèle de soin moderne au Sénégal, centré sur la qualité, la sécurité et le
                confort de chaque patient.
              </p>
            </div>
          </Card>

          <Card className="group relative overflow-hidden rounded-[2.5rem] border-none bg-gradient-to-br from-rose-500 to-orange-600 p-8 text-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-rose-500/20">
            <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-2xl transition-all group-hover:bg-white/20" />
            <div className="relative z-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md mb-6 shadow-inner">
                <Heart className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4 tracking-tight">Nos valeurs</h2>
              <p className="text-rose-50/90 leading-relaxed text-lg">
                Bienveillance, transparence et innovation guident notre accompagnement médical à
                chaque étape de votre parcours de soins.
              </p>
            </div>
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
                Nos médecins, sages-femmes et infirmiers sont formés pour offrir des prises en
                charge attentives, modernes et adaptées à toute la famille.
              </p>
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
                <img
                  src={midwifeMommy}
                  alt="Sage-femme avec une maman"
                  className="h-56 w-full object-cover"
                />
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
