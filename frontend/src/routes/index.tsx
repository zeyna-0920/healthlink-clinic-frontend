import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Calendar,
  Video,
  BedDouble,
  Stethoscope,
  ShieldCheck,
  Clock,
  ArrowRight,
  CheckCircle,
  Users,
  Activity,
  HeartPulse,
  UserPlus,
  Microscope,
  Baby,
  Thermometer,
  ClipboardList,
  Star,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import heroImg from "@/assets/hero-clinic.jpg";
import teleImg from "@/assets/teleconsult.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Allo Docteur — Clinique Moulaye Dabakh" },
      {
        name: "description",
        content:
          "Prenez rendez-vous en ligne, consultez à distance et évitez les déplacements inutiles.",
      },
    ],
  }),
  component: HomePage,
});

const TOTAL_BEDS = 20;
const OCCUPIED = 18;
const AVAILABLE = TOTAL_BEDS - OCCUPIED;

const SPECIALTIES = [
  {
    name: "Médecine Générale",
    icon: Stethoscope,
    gradient: "from-blue-600 to-indigo-700",
    shadow: "shadow-blue-500/20",
  },
  {
    name: "Pédiatrie",
    icon: Baby,
    gradient: "from-pink-500 to-rose-600",
    shadow: "shadow-rose-500/20",
  },
  {
    name: "Cardiologie",
    icon: HeartPulse,
    gradient: "from-red-500 to-orange-600",
    shadow: "shadow-orange-500/20",
  },
  {
    name: "Laboratoire",
    icon: Microscope,
    gradient: "from-emerald-500 to-teal-700",
    shadow: "shadow-emerald-500/20",
  },
  {
    name: "Urgences",
    icon: Activity,
    gradient: "from-orange-500 to-amber-600",
    shadow: "shadow-amber-500/20",
  },
  {
    name: "Maternité",
    icon: HeartPulse,
    gradient: "from-purple-500 to-indigo-700",
    shadow: "shadow-indigo-500/20",
  },
];

const TESTIMONIALS = [
  {
    name: "Awa Diop",
    role: "Patiente",
    content:
      "Une prise en charge rapide et un personnel très accueillant. La téléconsultation m'a sauvé beaucoup de temps.",
    rating: 5,
  },
  {
    name: "Moussa Sarr",
    role: "Patient",
    content:
      "La propreté de la clinique et le professionnalisme des médecins sont remarquables. Je recommande vivement.",
    rating: 5,
  },
  {
    name: "Mme Fall",
    role: "Patiente",
    content:
      "Le suivi digital est excellent. On se sent vraiment accompagné même après la consultation.",
    rating: 4,
  },
];

function HomePage() {
  return (
    <div className="flex flex-col gap-0">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,oklch(0.5_0.16_245_/_0.05),transparent_50%)]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <Badge
                variant="secondary"
                className="px-4 py-1.5 rounded-full bg-primary/10 text-primary border-none text-sm font-medium animate-in fade-in slide-in-from-left-4 duration-500"
              >
                <ShieldCheck className="mr-2 h-4 w-4" />
                Clinique Moulaye Dabakh : Votre santé, notre priorité
              </Badge>

              <div className="space-y-4">
                <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.1]">
                  Allo <br />
                  <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">
                    Docteur
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                  Accédez à une expertise médicale d'excellence alliée à une technologie de pointe.
                  Simplifiez votre parcours de soins avec nos services digitaux.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  className="h-14 px-8 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all"
                >
                  <Link to="/rendez-vous">
                    <Calendar className="mr-2 h-5 w-5" />
                    Prendre rendez-vous
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 rounded-2xl bg-white/50 backdrop-blur"
                >
                  <Link to="/services">
                    <Video className="mr-2 h-5 w-5" />
                    Téléconsultation
                  </Link>
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold">5k+</span>
                  <span className="text-sm text-muted-foreground">Patients satisfaits</span>
                </div>
                <div className="h-10 w-px bg-border/60" />
                <div className="flex flex-col">
                  <span className="text-3xl font-bold">15+</span>
                  <span className="text-sm text-muted-foreground">Spécialistes</span>
                </div>
                <div className="h-10 w-px bg-border/60" />
                <div className="flex flex-col">
                  <span className="text-3xl font-bold">24/7</span>
                  <span className="text-sm text-muted-foreground">Assistance</span>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/10 rounded-[3rem] blur-2xl group-hover:bg-primary/20 transition-colors duration-500" />
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white group-hover:scale-[1.02] transition-transform duration-500">
                <img
                  src={heroImg}
                  alt="Médecin de la Clinique Moulaye Dabakh"
                  className="w-full h-auto object-cover aspect-[4/5]"
                />
              </div>

              {/* Floating Cards */}
              <Card className="absolute -bottom-6 -left-8 p-5 rounded-3xl shadow-2xl border-none bg-white/90 backdrop-blur animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      Lits Disponibles
                    </p>
                    <p className="text-xl font-bold">
                      {AVAILABLE} / {TOTAL_BEDS}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="absolute top-1/4 -right-12 p-5 rounded-3xl shadow-2xl border-none bg-white/90 backdrop-blur animate-in fade-in slide-in-from-right-8 duration-700 delay-500">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      Patients en attente
                    </p>
                    <p className="text-xl font-bold">3</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS SECTION */}
      <section className="relative py-24 bg-slate-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="group relative overflow-hidden rounded-[2.5rem] border-none bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20">
              <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-2xl transition-all group-hover:bg-white/20" />
              <div className="relative z-10 space-y-5">
                <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">Rendez-vous Facile</h3>
                <p className="text-blue-50/90 leading-relaxed text-lg">
                  Réservez votre consultation en quelques secondes. Choisissez votre médecin et
                  votre créneau.
                </p>
                <Button
                  variant="secondary"
                  asChild
                  className="bg-white text-blue-600 hover:bg-blue-50 rounded-xl font-bold px-6"
                >
                  <Link to="/rendez-vous" className="flex items-center gap-2">
                    Prendre RDV <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>

            <Card className="group relative overflow-hidden rounded-[2.5rem] border-none bg-gradient-to-br from-medical to-teal-700 p-8 text-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-medical/20">
              <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-2xl transition-all group-hover:bg-white/20" />
              <div className="relative z-10 space-y-5">
                <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                  <Video className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">Téléconsultation</h3>
                <p className="text-emerald-50/90 leading-relaxed text-lg">
                  Consultez depuis votre domicile. Simple, sécurisé et rapide pour vos suivis
                  médicaux.
                </p>
                <Button
                  variant="secondary"
                  asChild
                  className="bg-white text-medical hover:bg-emerald-50 rounded-xl font-bold px-6"
                >
                  <Link to="/services" className="flex items-center gap-2">
                    En savoir plus <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>

            <Card className="group relative overflow-hidden rounded-[2.5rem] border-none bg-gradient-to-br from-success to-emerald-800 p-8 text-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-success/20">
              <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-2xl transition-all group-hover:bg-white/20" />
              <div className="relative z-10 space-y-5">
                <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                  <ClipboardList className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">Tarifs Transparents</h3>
                <p className="text-emerald-50/90 leading-relaxed text-lg">
                  Des tarifs fixes et accessibles pour tous. Enfant : 500 FCFA · Adulte : 1000 FCFA.
                </p>
                <Button
                  variant="secondary"
                  asChild
                  className="bg-white text-success hover:bg-emerald-50 rounded-xl font-bold px-6"
                >
                  <Link to="/tarifs" className="flex items-center gap-2">
                    Voir la liste <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* SPECIALTIES SECTION */}
      <section className="py-24 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge className="bg-primary/10 text-primary border-none">Nos Spécialités</Badge>
            <h2 className="text-4xl sm:text-5xl font-bold">Une Expertise Médicale Complète</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Nous couvrons un large éventail de besoins médicaux pour assurer votre bien-être
              total.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
            {SPECIALTIES.map((spec) => (
              <div
                key={spec.name}
                className={`group relative p-8 rounded-[2.5rem] border-none bg-gradient-to-br ${spec.gradient} text-white shadow-xl transition-all duration-500 hover:shadow-2xl hover:${spec.shadow} hover:-translate-y-2`}
              >
                <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-2xl transition-all group-hover:bg-white/20" />
                
                <div className="relative z-10">
                  <div
                    className="h-20 w-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner"
                  >
                    <spec.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-extrabold mb-3 tracking-tight">{spec.name}</h3>
                  <p className="text-white/80 leading-relaxed font-medium">
                    Prise en charge spécialisée avec nos experts en {spec.name.toLowerCase()}.
                  </p>
                  <div className="mt-6 flex items-center text-white font-bold text-sm opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                    En savoir plus <ArrowRight className="h-4 w-4 ml-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-slate-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <Badge className="bg-primary/10 text-primary border-none px-4 py-1.5 rounded-full">Témoignages</Badge>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Ce que disent nos patients</h2>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto">
              La satisfaction de nos patients est notre plus belle récompense.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {TESTIMONIALS.map((t, i) => (
              <Card
                key={i}
                className={`group relative p-10 rounded-[3rem] border-none text-white shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
                  i === 0 ? "bg-gradient-to-br from-blue-600 to-indigo-700 shadow-blue-500/20" : 
                  i === 1 ? "bg-gradient-to-br from-emerald-600 to-teal-800 shadow-emerald-500/20" : 
                  "bg-gradient-to-br from-purple-600 to-indigo-800 shadow-purple-500/20"
                }`}
              >
                <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/5 blur-3xl transition-all group-hover:bg-white/10" />
                
                <Quote className="absolute top-10 right-10 h-12 w-12 text-white opacity-20 group-hover:scale-110 transition-transform" />
                
                <div className="relative z-10">
                  <div className="flex gap-1 mb-8">
                    {[...Array(5)].map((_, starIdx) => (
                      <Star
                        key={starIdx}
                        className={`h-5 w-5 ${starIdx < t.rating ? "fill-amber-400 text-amber-400" : "text-white/20"}`}
                      />
                    ))}
                  </div>

                  <p className="text-xl italic mb-10 leading-relaxed text-white/90 font-medium">"{t.content}"</p>
                  
                  <div className="flex items-center gap-5 border-t border-white/10 pt-8">
                    <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-2xl shadow-inner">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="font-extrabold text-white text-xl">{t.name}</p>
                      <p className="font-bold text-sm uppercase tracking-widest text-white/70">{t.role}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-4 sm:px-8 pb-24 pt-12">
        <div className="mx-auto max-w-7xl rounded-[3rem] bg-[image:var(--gradient-hero)] p-12 sm:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/30">
          <Stethoscope className="absolute -top-12 -right-12 h-64 w-64 opacity-10 rotate-12" />
          <HeartPulse className="absolute -bottom-12 -left-12 h-64 w-64 opacity-10 -rotate-12" />

          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
              Prêt à prendre soin <br /> de votre santé ?
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed font-medium">
              Rejoignez des milliers de patients qui font confiance à la Clinique Moulaye Dabakh
              pour une prise en charge moderne et humaine.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="h-16 px-10 rounded-2xl text-lg font-bold shadow-xl bg-white text-primary hover:bg-slate-50"
              >
                <Link to="/rendez-vous">Prendre RDV Maintenant</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-16 px-10 rounded-2xl text-lg font-bold bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Link to="/contact">Nous Contacter</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
