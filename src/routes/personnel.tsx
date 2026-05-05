import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
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
  { name: "Dr Ablaye Diop", role: "Médecin", img: drAblaye },
  { name: "Maïssa Gueye", role: "Infirmier d'État", img: nurseAdama },
  { name: "Mariama Junior Diarra", role: "Infirmière d'État", img: nurseMariama },
  { name: "Adama Hanne", role: "Infirmière d'État", img: nurseMaissa },
  { name: "Mommy Ndiaye", role: "Sage-femme", img: midwifeMommy },
  { name: "Trésorier", role: "Gestion des tickets & paiements", img: treasurerImg },
  { name: "Aïssatou Sow", role: "Agente d'entretien", img: cleanerWoman },
  { name: "Modou Faye", role: "Agent de sécurité", img: guardMan },
];

function PersonnelPage() {
  return (
    <div className="bg-[image:var(--gradient-soft)]">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Notre équipe médicale</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Une équipe dévouée et expérimentée à votre service.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {team.map((m) => (
          <Card
            key={m.name}
            className="overflow-hidden hover:shadow-[var(--shadow-card)] transition-shadow"
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={m.img}
                alt={m.name}
                loading="lazy"
                width={640}
                height={640}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold">{m.name}</h3>
              <p className="text-sm text-muted-foreground">{m.role}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
    </div>
  );
}
