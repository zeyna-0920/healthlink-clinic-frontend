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
  },
  {
    name: "Pédiatrie",
    icon: Baby,
  },
  {
    name: "Cardiologie",
    icon: HeartPulse,
  },
  {
    name: "Laboratoire",
    icon: Microscope,
  },
  {
    name: "Urgences",
    icon: Activity,
  },
  {
    name: "Maternité",
    icon: HeartPulse,
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
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#f0faf6]">
        {/* Decorative Medical Icon on Left */}
        <div className="absolute left-8 top-1/4 h-32 w-32 opacity-5 text-[#1D9E75]">
          <Stethoscope className="w-full h-full" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge
                variant="secondary"
                className="px-4 py-1.5 rounded-full bg-[#1D9E75]/10 text-[#0F6E56] border-none text-sm font-medium"
              >
                <ShieldCheck className="mr-2 h-4 w-4" />
                Clinique Moulaye Dabakh : Votre santé, notre priorité
              </Badge>

              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900">
                  Allo <br />
                  <span className="text-[#1D9E75]">
                    Docteur
                  </span>
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed max-w-xl">
                  Accédez à une expertise médicale d'excellence alliée à une technologie de pointe.
                  Simplifiez votre parcours de soins avec nos services digitaux.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  className="h-14 px-8 rounded-2xl bg-[#1D9E75] hover:bg-[#0F6E56] shadow-xl shadow-[#1D9E75]/20 transition-all"
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
                  className="h-14 px-8 rounded-2xl border-[#1D9E75] text-[#1D9E75] hover:bg-[#1D9E75]/5"
                >
                  <Link to="/services">
                    <Video className="mr-2 h-5 w-5" />
                    Téléconsultation
                  </Link>
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-slate-900">5k+</span>
                  <span className="text-sm text-slate-600">Patients satisfaits</span>
                </div>
                <div className="h-10 w-px bg-slate-200" />
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-slate-900">15+</span>
                  <span className="text-sm text-slate-600">Spécialistes</span>
                </div>
                <div className="h-10 w-px bg-slate-200" />
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-slate-900">24/7</span>
                  <span className="text-sm text-slate-600">Assistance</span>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-[#1D9E75]/10 rounded-[3rem] blur-2xl group-hover:bg-[#1D9E75]/20 transition-colors duration-500" />
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white group-hover:scale-[1.02] transition-transform duration-500">
                <img
                  src={heroImg}
                  alt="Médecin de la Clinique Moulaye Dabakh"
                  className="w-full h-auto object-cover aspect-[4/5]"
                />
              </div>

              {/* Floating Cards */}
              <Card className="absolute -bottom-6 -left-8 p-5 rounded-3xl shadow-xl border border-[#1D9E75]/10 bg-white/95 backdrop-blur">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-[#1D9E75] flex items-center justify-center shadow-lg shadow-[#1D9E75]/20">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                      Lits Disponibles
                    </p>
                    <p className="text-xl font-bold text-slate-900">
                      {AVAILABLE} / {TOTAL_BEDS}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="absolute top-1/4 -right-12 p-5 rounded-3xl shadow-xl border border-[#1D9E75]/10 bg-white/95 backdrop-blur">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-[#1D9E75]/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-[#1D9E75]" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                      Patients en attente
                    </p>
                    <p className="text-xl font-bold text-slate-900">3</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS SECTION */}
      <section className="relative py-16 pb-8 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="group relative overflow-hidden rounded-[2.5rem] border border-[#1D9E75]/10 bg-[#1D9E75] p-8 text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#1D9E75]/10">
              <div className="relative z-10 space-y-5">
                <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">Rendez-vous Facile</h3>
                <p className="text-white/90 leading-relaxed text-lg">
                  Réservez votre consultation en quelques secondes. Choisissez votre médecin et
                  votre créneau.
                </p>
                <Button
                  asChild
                  className="bg-white text-[#1D9E75] hover:bg-slate-100 rounded-xl font-bold px-6"
                >
                  <Link to="/rendez-vous" className="flex items-center gap-2">
                    Prendre RDV <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>

            <Card className="group relative overflow-hidden rounded-[2.5rem] border border-[#0F6E56]/10 bg-[#0F6E56] p-8 text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#0F6E56]/10">
              <div className="relative z-10 space-y-5">
                <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Video className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">Téléconsultation</h3>
                <p className="text-white/90 leading-relaxed text-lg">
                  Consultez depuis votre domicile. Simple, sécurisé et rapide pour vos suivis
                  médicaux.
                </p>
                <Button
                  variant="secondary"
                  asChild
                  className="bg-white text-[#0F6E56] hover:bg-slate-100 rounded-xl font-bold px-6"
                >
                  <Link to="/services" className="flex items-center gap-2">
                    En savoir plus <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>

            <Card className="group relative overflow-hidden rounded-[2.5rem] border border-[#085041]/10 bg-[#085041] p-8 text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#085041]/10">
              <div className="relative z-10 space-y-5">
                <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center">
                  <ClipboardList className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">Tarifs Transparents</h3>
                <p className="text-white/90 leading-relaxed text-lg">
                  Des tarifs fixes et accessibles pour tous. Enfant : 500 FCFA · Adulte : 1000 FCFA.
                </p>
                <Button
                  asChild
                  className="bg-white text-[#085041] hover:bg-slate-100 rounded-xl font-bold px-6"
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
      <section className="py-16 pt-8 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <Badge className="bg-[#1D9E75]/10 text-[#0F6E56] border-none">Nos Spécialités</Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900">Une Expertise Médicale Complète</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Nous couvrons un large éventail de besoins médicaux pour assurer votre bien-être
              total.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {SPECIALTIES.map((spec) => (
              <div
                key={spec.name}
                className="group relative p-8 rounded-[2.5rem] border border-[#1D9E75]/30 bg-white shadow-md transition-all duration-500 hover:shadow-xl hover:shadow-[#1D9E75]/10 hover:-translate-y-1"
              >
                <div className="relative z-10">
                  <div
                    className="h-20 w-20 rounded-full bg-[#E1F5EE] flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500"
                  >
                    <spec.icon className="h-10 w-10 text-[#0F6E56]" />
                  </div>
                  <h3 className="text-xl font-extrabold mb-3 tracking-tight text-black">{spec.name}</h3>
                  <p className="text-gray-600 leading-relaxed font-medium mb-6">
                    Prise en charge spécialisée avec nos experts en {spec.name.toLowerCase()}.
                  </p>
                  <Link 
                    to="/services" 
                    className="inline-flex items-center gap-1 text-[#0F6E56] font-semibold hover:text-[#1D9E75] transition-colors"
                  >
                    En savoir plus <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              asChild
              className="bg-[#1D9E75] hover:bg-[#0F6E56] rounded-xl font-bold px-8 py-6 text-white"
            >
              <Link to="/services">
                Voir toutes nos spécialités
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-4">
            <Badge className="bg-[#1D9E75]/10 text-[#0F6E56] border-none px-4 py-1.5 rounded-full">Témoignages</Badge>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">Ce que disent nos patients</h2>
            <p className="text-xl text-slate-600 max-w-xl mx-auto">
              La satisfaction de nos patients est notre plus belle récompense.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <Card
                key={i}
                className="group relative p-10 rounded-[3rem] border-l-4 border-l-[#1D9E75] border border-slate-100 bg-white shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#1D9E75]/10"
              >
                <Quote className="absolute top-10 right-10 h-12 w-12 text-[#1D9E75] opacity-[0.08]" />
                
                <div className="relative z-10">
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, starIdx) => (
                      <Star
                        key={starIdx}
                        className={`h-5 w-5 ${starIdx < t.rating ? "fill-[#1D9E75] text-[#1D9E75]" : "text-slate-200"}`}
                      />
                    ))}
                  </div>

                  <p className="text-2xl mb-8 leading-relaxed text-black font-medium not-italic">"{t.content}"</p>
                  
                  <div className="flex items-center gap-5 border-t border-slate-100 pt-6">
                    <div className="h-16 w-16 rounded-2xl bg-[#1D9E75]/10 flex items-center justify-center font-bold text-2xl text-[#1D9E75]">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="font-extrabold text-black text-xl">{t.name}</p>
                      <p className="font-bold text-sm uppercase tracking-widest text-slate-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-4 sm:px-8 pb-16 pt-8">
        <div className="mx-auto max-w-7xl rounded-[3rem] bg-gradient-to-br from-[#1D9E75] to-[#0F6E56] p-12 sm:p-20 text-center text-white relative overflow-hidden shadow-xl shadow-[#1D9E75]/30">
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
                className="h-16 px-10 rounded-2xl text-lg font-bold shadow-xl bg-white text-[#0F6E56] hover:bg-slate-100"
              >
                <Link to="/rendez-vous">Prendre RDV Maintenant</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-16 px-10 rounded-2xl text-lg font-bold bg-white/10 border-white/30 text-white hover:bg-white/20"
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
