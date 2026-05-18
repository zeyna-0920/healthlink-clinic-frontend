import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getApiBaseUrl } from "@/lib/api-base";

export const Route = createFileRoute("/set-password")({
  head: () => ({
    meta: [
      { title: "Définir un mot de passe — Clinique Moulaye Dabakh" },
      {
        name: "description",
        content: "Définissez un mot de passe pour sécuriser votre compte patient.",
      },
    ],
  }),
  component: SetPasswordPage,
});

const API_URL = `${getApiBaseUrl()}/api/patients`;

function SetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [patient, setPatient] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Récupérer les infos du patient depuis le localStorage
    const patientData = localStorage.getItem("patient");
    if (patientData) {
      setPatient(JSON.parse(patientData));
    } else {
      // Rediriger vers la page de connexion si pas de données patient
      window.location.href = "/auth";
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    if (password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    if (!patient) {
      toast.error("Informations patient non trouvées");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/set-password/${patient._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
        }),
      });

      const data = (await response.json()) as {
        success: boolean;
        message: string;
      };

      if (data.success) {
        toast.success("Mot de passe défini avec succès!");

        // Mettre à jour le token pour indiquer que le mot de passe est défini
        const currentToken = localStorage.getItem("authToken");
        if (currentToken) {
          const newToken = currentToken.replace(":temp", "");
          localStorage.setItem("authToken", newToken);
        }

        // Rediriger vers le dashboard
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
      } else {
        toast.error(data.message || "Erreur lors de la définition du mot de passe");
      }
    } catch (err: unknown) {
      console.error("Erreur:", err);
      toast.error("Une erreur est survenue. Vérifiez que le serveur est démarré.");
    } finally {
      setLoading(false);
    }
  };

  if (!patient) {
    return (
      <div className=" min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="">
      <div className="mx-auto max-w-md px-4 sm:px-6 py-16">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[image:var(--gradient-hero)] mb-4">
            <ShieldCheck className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold">Définir un mot de passe</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Bonjour {patient.firstName} {patient.lastName}, définissez un mot de passe pour
            sécuriser votre compte.
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nouveau mot de passe</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label>Confirmer le mot de passe</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Définition en cours...
                </>
              ) : (
                "Définir le mot de passe"
              )}
            </Button>
          </form>
        </Card>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Votre mot de passe sera chiffré et stocké en sécurité.
        </p>
      </div>
    </div>
  );
}
