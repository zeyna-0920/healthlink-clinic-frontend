import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Lock } from "lucide-react";
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

const team = [
  {
    name: "Dr Ablaye Diop",
    role: "Médecin",
    img: drAblaye,
    phone: "+221 77 123 45 67",
    email: "ablaye.diop@clinique.sn",
    age: 45,
  },
  {
    name: "Maïssa Gueye",
    role: "Infirmier d'État",
    img: nurseAdama,
    phone: "+221 77 234 56 78",
    email: "maissa.gueye@clinique.sn",
    age: 32,
  },
  {
    name: "Mariama Junior Diarra",
    role: "Infirmière d'État",
    img: nurseMariama,
    phone: "+221 77 345 67 89",
    email: "mariama.diarra@clinique.sn",
    age: 30,
  },
  {
    name: "Adama Hanne",
    role: "Infirmière d'État",
    img: nurseMaissa,
    phone: "+221 77 456 78 90",
    email: "adama.hanne@clinique.sn",
    age: 28,
  },
  {
    name: "Mommy Ndiaye",
    role: "Sage-femme",
    img: midwifeMommy,
    phone: "+221 77 567 89 01",
    email: "mommy.ndiaye@clinique.sn",
    age: 38,
  },
  {
    name: "Trésorier",
    role: "Gestion des tickets & paiements",
    img: treasurerImg,
    phone: "+221 77 678 90 12",
    email: "tresorier@clinique.sn",
    age: 36,
  },
  {
    name: "Aïssatou Sow",
    role: "Agente d'entretien",
    img: cleanerWoman,
    phone: "+221 77 789 01 23",
    email: "aissato.sow@clinique.sn",
    age: 34,
  },
  {
    name: "Modou Faye",
    role: "Agent de sécurité",
    img: guardMan,
    phone: "+221 77 890 12 34",
    email: "modou.faye@clinique.sn",
    age: 40,
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
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Notre équipe médicale</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Une équipe dévouée et expérimentée à votre service.
          </p>
          {!loading && !canContact && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium">
              <Lock className="h-4 w-4" />
              Le contact direct est réservé aux patients inscrits ayant déjà pris rendez-vous.
            </div>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m) => (
            <Card
              key={m.name}
              className="overflow-hidden hover:shadow-[var(--shadow-card)] transition-shadow border-border/40 group bg-white/60 backdrop-blur"
            >
              <div className="aspect-square overflow-hidden relative">
                <img
                  src={m.img}
                  alt={m.name}
                  loading="lazy"
                  width={640}
                  height={640}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {!canContact && !loading && (
                  <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/90 p-2 rounded-xl shadow-lg">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 leading-tight">{m.name}</h3>
                  <p className="text-sm font-medium text-primary mt-0.5">{m.role}</p>
                </div>

                <div className="text-[13px] space-y-2 text-slate-500">
                  <p className="flex justify-between">
                    <span className="font-medium">Âge :</span> <span>{m.age} ans</span>
                  </p>
                  <p className="flex justify-between truncate">
                    <span className="font-medium">Email :</span>{" "}
                    <span className="truncate ml-2">{m.email}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40">
                  <Button
                    variant={canContact ? "default" : "secondary"}
                    size="sm"
                    className="rounded-xl gap-2 h-10"
                    disabled={!canContact && !loading}
                    asChild={canContact}
                    onClick={handleRestrictedClick}
                  >
                    {canContact ? (
                      <a href={`tel:${m.phone.replace(/\s/g, "")}`}>
                        <Phone className="h-4 w-4" />
                        Appeler
                      </a>
                    ) : (
                      <span>
                        <Phone className="h-4 w-4" />
                        Appeler
                      </span>
                    )}
                  </Button>
                  <Button
                    variant={canContact ? "outline" : "secondary"}
                    size="sm"
                    className="rounded-xl gap-2 h-10 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
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
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp
                      </a>
                    ) : (
                      <span>
                        <MessageCircle className="h-4 w-4" />
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
