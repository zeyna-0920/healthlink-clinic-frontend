import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Lock, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPatientAppointments, type Appointment } from "./api/-clinic";
import { toast } from "sonner";
import drAblaye from "@/assets/dr-ablaye.jpg";
import nurseMaissa from "@/assets/nurse-maissa.jpg";
import nurseMariama from "@/assets/nurse-mariama.jpg";
import nurseAdama from "@/assets/nurse-adama.jpg";
import midwifeMommy from "@/assets/midwife-mommy.jpg";
import treasurerImg from "@/assets/treasurer.jpg";
import cleanerWoman from "@/assets/cleaner-woman.jpg";
import guardMan from "@/assets/guard-man.jpg";

import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/personnel")({
  head: () => ({
    meta: [
      { title: "Notre Équipe — Clinique Moulaye Dabakh" },
      {
        name: "description",
        content:
          "Découvrez les médecins, infirmiers et sages-femmes de la Clinique Moulaye Dabakh.",
      },
    ],
  }),
  component: PersonnelPage,
});

const medicalTeam = [
  {
    name: "Dr Ablaye Diop",
    role: "Médecin",
    img: drAblaye,
    phone: "+221 77 123 45 67",
    email: "ablaye.diop@clinique.sn",
    age: 45,
    gradient: "from-blue-600 to-indigo-700",
    shadow: "shadow-blue-500/20",
  },
  {
    name: "Maïssa Gueye",
    role: "Infirmier d'État",
    img: nurseAdama,
    phone: "+221 77 234 56 78",
    email: "maissa.gueye@clinique.sn",
    age: 32,
    gradient: "from-emerald-500 to-teal-700",
    shadow: "shadow-emerald-500/20",
  },
  {
    name: "Mariama Junior Diarra",
    role: "Infirmière d'État",
    img: nurseMariama,
    phone: "+221 77 345 67 89",
    email: "mariama.diarra@clinique.sn",
    age: 30,
    gradient: "from-purple-500 to-indigo-700",
    shadow: "shadow-purple-500/20",
  },
  {
    name: "Adama Hanne",
    role: "Infirmière d'État",
    img: nurseMaissa,
    phone: "+221 77 456 78 90",
    email: "adama.hanne@clinique.sn",
    age: 28,
    gradient: "from-sky-500 to-blue-700",
    shadow: "shadow-sky-500/20",
  },
  {
    name: "Mommy Ndiaye",
    role: "Sage-femme",
    img: midwifeMommy,
    phone: "+221 77 567 89 01",
    email: "mommy.ndiaye@clinique.sn",
    age: 38,
    gradient: "from-rose-500 to-red-600",
    shadow: "shadow-rose-500/20",
  },
];

const supportTeam = [
  {
    name: "Trésorier",
    role: "Gestion des tickets & paiements",
    img: treasurerImg,
    phone: "+221 77 678 90 12",
    email: "tresorier@clinique.sn",
    age: 36,
    gradient: "from-orange-500 to-amber-600",
    shadow: "shadow-orange-500/20",
  },
  {
    name: "Aïssatou Sow",
    role: "Agente d'entretien",
    img: cleanerWoman,
    phone: "+221 77 789 01 23",
    email: "aissato.sow@clinique.sn",
    age: 34,
    gradient: "from-teal-500 to-emerald-700",
    shadow: "shadow-teal-500/20",
  },
  {
    name: "Modou Faye",
    role: "Agent de sécurité",
    img: guardMan,
    phone: "+221 77 890 12 34",
    email: "modou.faye@clinique.sn",
    age: 40,
    gradient: "from-slate-600 to-slate-800",
    shadow: "shadow-slate-500/20",
  },
];

function PersonnelPage() {
  const [canContact, setCanContact] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      setLoading(true);
      const patientStr = localStorage.getItem("patient");
      if (!patientStr) {
        setCanContact(false);
        setLoading(false);
        return;
      }

      try {
        const patient = JSON.parse(patientStr);
        const appointments = await getPatientAppointments(patient._id);
        // On vérifie si le patient a au moins un rendez-vous (peu importe le statut)
        setCanContact(appointments.length > 0);
      } catch (error) {
        console.error("Erreur lors de la vérification de l'accès:", error);
        setCanContact(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, []);

  const handleRestrictedClick = (e: React.MouseEvent) => {
    if (!canContact) {
      e.preventDefault();
      const patientStr = localStorage.getItem("patient");
      if (!patientStr) {
        toast.error("Veuillez vous inscrire et vous connecter pour contacter notre personnel.");
      } else {
        toast.error(
          "Vous devez avoir pris au moins un rendez-vous pour contacter notre personnel.",
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8 space-y-4">
          <Badge className="bg-primary/10 text-primary border-none px-4 py-1.5 rounded-full">Notre Équipe</Badge>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Des experts <span className="bg-gradient-to-r from-[#1D9E75] to-[#0F6E56] bg-clip-text text-transparent">à votre service</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Une équipe dévouée et expérimentée, engagée pour votre santé au quotidien.
          </p>
          {!loading && !canContact && (
            <div className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
              <Lock className="h-4 w-4" />
              <span className="font-bold">Accès restreint :</span> Le contact direct est réservé aux patients inscrits ayant déjà pris rendez-vous.
            </div>
          )}
        </div>

        {/* Personnel médical */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          {medicalTeam.map((m) => (
            <Card
              key={m.name}
              className="group relative overflow-hidden rounded-[2.5rem] border-none bg-white shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
            >
              <div className="aspect-[4/5] overflow-hidden relative">
                <img
                  src={m.img}
                  alt={m.name}
                  loading="lazy"
                  width={640}
                  height={640}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${m.gradient} opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
                
                {!canContact && !loading && (
                  <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 p-4 rounded-2xl shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-300">
                      <Lock className="h-6 w-6 text-slate-400" />
                    </div>
                  </div>
                )}

                <div className="absolute bottom-4 left-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Expérience</p>
                    <p className="text-sm font-bold text-slate-900">{m.age} ans d&apos;expertise</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">{m.name}</h3>
                  <div className="inline-block mt-2 px-3 py-1 rounded-lg bg-[#1D9E75] text-white text-xs font-bold uppercase tracking-widest">
                    {m.role}
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:border-slate-200 transition-colors">
                    <div className="h-10 w-10 rounded-xl bg-[#E1F5EE] flex items-center justify-center scale-90">
                      <Mail className="h-5 w-5 text-[#0F6E56]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email</p>
                      <p className="text-[11px] font-bold text-slate-600">{m.email}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <Button
                    variant={canContact ? "default" : "secondary"}
                    size="lg"
                    className={cn(
                      "rounded-[1.5rem] gap-2 h-14 font-bold shadow-lg transition-all active:scale-95",
                      canContact && `bg-gradient-to-r ${m.gradient} border-none hover:opacity-90 hover:${m.shadow}`
                    )}
                    disabled={!canContact && !loading}
                    asChild={canContact}
                    onClick={handleRestrictedClick}
                  >
                    {canContact ? (
                      <a href={`tel:${m.phone.replace(/\s/g, "")}`}>
                        <Phone className="h-5 w-5" />
                        Appeler
                      </a>
                    ) : (
                      <span>
                        <Phone className="h-5 w-5" />
                        Appeler
                      </span>
                    )}
                  </Button>
                  <Button
                    variant={canContact ? "outline" : "secondary"}
                    size="lg"
                    className={cn(
                      "rounded-[1.5rem] gap-2 h-14 font-bold transition-all active:scale-95",
                      canContact ? "border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50" : "bg-slate-100"
                    )}
                    disabled={!canContact && !loading}
                    asChild={canContact}
                    onClick={handleRestrictedClick}
                  >
                    {canContact ? (
                      <a
                        href={`https://wa.me/${m.phone.replace(/[^0-9]/g, "")}?text=Bonjour ${m.name}, je suis un patient de la Clinique Moulaye Dabakh.`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="h-5 w-5" />
                        WhatsApp
                      </a>
                    ) : (
                      <span>
                        <MessageCircle className="h-5 w-5" />
                        WhatsApp
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Personnel administratif & support */}
        <div className="text-center mb-10">
          <Badge className="bg-primary/10 text-primary border-none px-4 py-1.5 rounded-full">Personnel administratif &amp; support</Badge>
        </div>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {supportTeam.map((m) => (
            <Card
              key={m.name}
              className="group relative overflow-hidden rounded-[2.5rem] border-none bg-white shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
            >
              <div className="aspect-[4/5] overflow-hidden relative">
                <img
                  src={m.img}
                  alt={m.name}
                  loading="lazy"
                  width={640}
                  height={640}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${m.gradient} opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
                
                {!canContact && !loading && (
                  <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 p-4 rounded-2xl shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-300">
                      <Lock className="h-6 w-6 text-slate-400" />
                    </div>
                  </div>
                )}

                <div className="absolute bottom-4 left-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Expérience</p>
                    <p className="text-sm font-bold text-slate-900">{m.age} ans d&apos;expertise</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">{m.name}</h3>
                  <div className={`inline-block mt-2 px-3 py-1 rounded-lg ${m.role === "Gestion des tickets & paiements" ? "bg-[#0F6E56]" : "bg-[#1D9E75]"} text-white text-xs font-bold uppercase tracking-widest`}>
                    {m.role}
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:border-slate-200 transition-colors">
                    <div className="h-10 w-10 rounded-xl bg-[#E1F5EE] flex items-center justify-center scale-90">
                      <Mail className="h-5 w-5 text-[#0F6E56]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email</p>
                      <p className="text-[11px] font-bold text-slate-600">{m.email}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <Button
                    variant={canContact ? "default" : "secondary"}
                    size="lg"
                    className={cn(
                      "rounded-[1.5rem] gap-2 h-14 font-bold shadow-lg transition-all active:scale-95",
                      canContact && `bg-gradient-to-r ${m.gradient} border-none hover:opacity-90 hover:${m.shadow}`
                    )}
                    disabled={!canContact && !loading}
                    asChild={canContact}
                    onClick={handleRestrictedClick}
                  >
                    {canContact ? (
                      <a href={`tel:${m.phone.replace(/\s/g, "")}`}>
                        <Phone className="h-5 w-5" />
                        Appeler
                      </a>
                    ) : (
                      <span>
                        <Phone className="h-5 w-5" />
                        Appeler
                      </span>
                    )}
                  </Button>
                  <Button
                    variant={canContact ? "outline" : "secondary"}
                    size="lg"
                    className={cn(
                      "rounded-[1.5rem] gap-2 h-14 font-bold transition-all active:scale-95",
                      canContact ? "border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50" : "bg-slate-100"
                    )}
                    disabled={!canContact && !loading}
                    asChild={canContact}
                    onClick={handleRestrictedClick}
                  >
                    {canContact ? (
                      <a
                        href={`https://wa.me/${m.phone.replace(/[^0-9]/g, "")}?text=Bonjour ${m.name}, je suis un patient de la Clinique Moulaye Dabakh.`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="h-5 w-5" />
                        WhatsApp
                      </a>
                    ) : (
                      <span>
                        <MessageCircle className="h-5 w-5" />
                        WhatsApp
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
