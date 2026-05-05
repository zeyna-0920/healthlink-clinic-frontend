import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Connexion / Inscription — Clinique Moulaye Dabakh" },
      {
        name: "description",
        content: "Créez votre compte patient ou connectez-vous pour gérer vos rendez-vous.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [tab, setTab] = useState("login");

  return (
    <div className="bg-[image:var(--gradient-soft)]">
    <div className="mx-auto max-w-md px-4 sm:px-6 py-16">
      <div className="text-center mb-8">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[image:var(--gradient-hero)] mb-4">
          <ShieldCheck className="h-7 w-7 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold">Espace patient</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Gérez vos rendez-vous et votre dossier médical.
        </p>
      </div>

      <Card className="p-6">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="signup">Inscription</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.info("Connectez Lovable Cloud pour activer l'authentification.");
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="vous@email.com" />
              </div>
              <div className="space-y-2">
                <Label>Mot de passe</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <Button type="submit" className="w-full">
                Se connecter
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.info("Connectez Lovable Cloud pour activer l'authentification.");
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label>Nom complet</Label>
                <Input placeholder="Votre nom" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="vous@email.com" />
              </div>
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input placeholder="+221 ..." />
              </div>
              <div className="space-y-2">
                <Label>Mot de passe</Label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <Button type="submit" className="w-full">
                Créer mon compte
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </Card>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Connexion sécurisée. Vos données médicales restent confidentielles.
      </p>
    </div>
    </div>
  );
}
