import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import drAblaye from "@/assets/dr-ablaye.jpg";
import nurseMaissa from "@/assets/nurse-maissa.jpg";
import nurseMariama from "@/assets/nurse-mariama.jpg";
import nurseAdama from "@/assets/nurse-adama.jpg";
import midwifeMommy from "@/assets/midwife-mommy.jpg";
import { Wallet } from "lucide-react";

export const Route = createFileRoute("/personnel")({
  head: () => ({
    meta: [
      { title: "Notre Équipe — Clinique Moulaye Dabakh" },
      { name: "description", content: "Découvrez les médecins, infirmiers et sages-femmes de la Clinique Moulaye Dabakh." },
    ],
  }),
  component: PersonnelPage,
});

const team = [
  { name: "Dr Ablaye Diop", role: "Médecin", img: drAblaye },
  { name: "Maïssa Gueye", role: "Infirmière d'État", img: nurseMaissa },
  { name: "Mariama Junior Diarra", role: "Infirmière d'État", img: nurseMariama },
  { name: "Adama Hanne", role: "Infirmier d'État", img: nurseAdama },
  { name: "Mommy Ndiaye", role: "Sage-femme", img: midwifeMommy },
];

function PersonnelPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Notre équipe médicale</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Une équipe dévouée et expérimentée à votre service.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {team.map((m) => (
          <Card key={m.name} className="overflow-hidden hover:shadow-[var(--shadow-card)] transition-shadow">
            <div className="aspect-square overflow-hidden">
              <img src={m.img} alt={m.name} loading="lazy" width={640} height={640} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold">{m.name}</h3>
              <p className="text-sm text-muted-foreground">{m.role}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-12 p-6 flex items-start gap-4 bg-[image:var(--gradient-soft)] border-primary/20">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
          <Wallet className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="font-bold mb-1">Trésorier</h3>
          <p className="text-sm text-muted-foreground">Notre trésorier assure la gestion transparente des tickets et des paiements de la clinique.</p>
        </div>
      </Card>
    </div>
  );
}
