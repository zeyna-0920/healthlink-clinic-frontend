import { createFileRoute } from "@tanstack/react-router";
import { Heart, Target, Sparkles, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

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
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">À propos de la clinique</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Une clinique moderne au service de votre santé, fondée sur la confiance et la
          digitalisation des soins.
        </p>
      </div>

      <Card className="p-8 mb-8">
        <h2 className="text-2xl font-bold mb-3">Notre histoire</h2>
        <p className="text-muted-foreground leading-relaxed">
          La Clinique Moulaye Dabakh a été fondée avec la conviction que chaque personne mérite un
          accès rapide et digne à des soins de qualité. Située au cœur de la ville, notre
          établissement combine expertise médicale et innovation numérique pour mieux vous servir.
        </p>
      </Card>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <Target className="h-8 w-8 text-primary mb-3" />
          <h3 className="text-xl font-bold mb-2">Notre mission</h3>
          <p className="text-sm text-muted-foreground">
            Faciliter l'accès aux soins médicaux grâce à la digitalisation : prise de rendez-vous en
            ligne, téléconsultation et gestion intelligente des hospitalisations.
          </p>
        </Card>
        <Card className="p-6">
          <Sparkles className="h-8 w-8 text-success mb-3" />
          <h3 className="text-xl font-bold mb-2">Notre vision</h3>
          <p className="text-sm text-muted-foreground">
            Devenir la référence en matière de soins digitalisés au Sénégal, où chaque patient
            bénéficie d'un parcours fluide, humain et efficace.
          </p>
        </Card>
        <Card className="p-6">
          <Heart className="h-8 w-8 text-destructive mb-3" />
          <h3 className="text-xl font-bold mb-2">Nos valeurs</h3>
          <p className="text-sm text-muted-foreground">
            Bienveillance, excellence, transparence et innovation guident chacune de nos actions au
            quotidien.
          </p>
        </Card>
        <Card className="p-6">
          <Users className="h-8 w-8 text-medical mb-3" />
          <h3 className="text-xl font-bold mb-2">Notre équipe</h3>
          <p className="text-sm text-muted-foreground">
            Médecins, infirmiers et sages-femmes passionnés, à votre écoute 24h/24 pour les urgences
            et de 8h à minuit pour les consultations.
          </p>
        </Card>
      </div>

      <Card className="p-8 bg-[image:var(--gradient-soft)] border-primary/20">
        <h2 className="text-2xl font-bold mb-3">La digitalisation au service de la santé</h2>
        <p className="text-muted-foreground leading-relaxed">
          En réduisant les déplacements inutiles, en évitant la saturation des lits et en offrant
          des consultations à distance, nous contribuons à un système de santé plus efficace et plus
          humain. Notre plateforme vous permet de suivre vos rendez-vous, vos ordonnances et votre
          dossier médical en toute sécurité.
        </p>
      </Card>
    </div>
  );
}
