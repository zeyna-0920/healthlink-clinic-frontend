import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getApiBaseUrl } from "@/lib/api-base";

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

const API_URL = `${getApiBaseUrl()}/api/patients`;

function AuthPage() {
  const [tab, setTab] = useState("login");
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  // États du formulaire de connexion
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // États du formulaire d'inscription
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    dateOfBirth: "",
    gender: "",
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setLoginLoading(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Sauvegarder le token et les infos du patient
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("patient", JSON.stringify(data.patient));

        if (data.requiresPasswordSetup) {
          toast.info("Veuillez définir un mot de passe pour sécuriser votre compte.");
          // Rediriger vers une page de configuration de mot de passe
          setTimeout(() => {
            window.location.href = "/set-password";
          }, 1000);
        } else {
          toast.success("Connexion réussie!");
          setTimeout(() => {
            window.location.href = "/rendez-vous";
          }, 1000);
        }
      } else {
        toast.error(data.message || "Erreur de connexion");
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      toast.error("Une erreur est survenue. Vérifiez que le serveur est démarré.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !signupData.firstName ||
      !signupData.lastName ||
      !signupData.email ||
      !signupData.phone ||
      !signupData.password ||
      !signupData.dateOfBirth ||
      !signupData.gender
    ) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    if (signupData.password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setSignupLoading(true);
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: signupData.firstName,
          lastName: signupData.lastName,
          email: signupData.email,
          phone: signupData.phone,
          password: signupData.password,
          dateOfBirth: new Date(signupData.dateOfBirth).toISOString(),
          gender: signupData.gender,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Inscription réussie! Connectez-vous maintenant.");

        // Réinitialiser le formulaire et passer à la connexion
        setSignupData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          dateOfBirth: "",
          gender: "",
        });
        setLoginData({
          email: signupData.email,
          password: "",
        });
        setTab("login");
      } else {
        toast.error(data.message || "Erreur lors de l'inscription");
      }
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      toast.error("Une erreur est survenue. Vérifiez que le serveur est démarré.");
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="">
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
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="vous@email.com"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    disabled={loginLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mot de passe</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    disabled={loginLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loginLoading}>
                  {loginLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connexion en cours...
                    </>
                  ) : (
                    "Se connecter"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label>Nom</Label>
                  <Input
                    placeholder="Votre nom"
                    name="lastName"
                    value={signupData.lastName}
                    onChange={handleSignupChange}
                    disabled={signupLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Prénom</Label>
                  <Input
                    placeholder="Votre prénom"
                    name="firstName"
                    value={signupData.firstName}
                    onChange={handleSignupChange}
                    disabled={signupLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="vous@email.com"
                    name="email"
                    value={signupData.email}
                    onChange={handleSignupChange}
                    disabled={signupLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Téléphone</Label>
                  <Input
                    placeholder="+221 ..."
                    name="phone"
                    value={signupData.phone}
                    onChange={handleSignupChange}
                    disabled={signupLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date de naissance</Label>
                  <Input
                    type="date"
                    name="dateOfBirth"
                    value={signupData.dateOfBirth}
                    onChange={handleSignupChange}
                    disabled={signupLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sexe</Label>
                  <select
                    name="gender"
                    value={signupData.gender}
                    onChange={handleSignupChange}
                    disabled={signupLoading}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  >
                    <option value="">Sélectionnez</option>
                    <option value="M">Homme</option>
                    <option value="F">Femme</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Mot de passe</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    name="password"
                    value={signupData.password}
                    onChange={handleSignupChange}
                    disabled={signupLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={signupLoading}>
                  {signupLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Création en cours...
                    </>
                  ) : (
                    "Créer mon compte"
                  )}
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
