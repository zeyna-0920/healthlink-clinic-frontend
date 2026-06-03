import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { getApiBaseUrl } from "@/lib/api-base";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { token } = Route.useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Le mot de passe doit faire au moins 6 caractères");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/patients/reset-password/${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        toast.success("Mot de passe mis à jour !");
        setTimeout(() => {
          // @ts-ignore
          navigate({ to: "/auth" });
        }, 3000);
      } else {
        toast.error(data.message || "Lien invalide ou expiré");
      }
    } catch (error) {
      toast.error("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 rounded-[2.5rem] shadow-xl border-none">
        {!success ? (
          <>
            <div className="text-center mb-8">
              <div className="h-16 w-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-indigo-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Nouveau mot de passe</h1>
              <p className="text-slate-500 mt-2">Choisissez votre nouveau mot de passe sécurisé.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pass">Mot de passe</Label>
                  <Input
                    id="pass"
                    type="password"
                    placeholder="••••••••"
                    className="h-12 rounded-xl"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="conf">Confirmer</Label>
                  <Input
                    id="conf"
                    type="password"
                    placeholder="••••••••"
                    className="h-12 rounded-xl"
                    value={confirmPassword}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button className="w-full h-12 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700" disabled={loading}>
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Réinitialiser le mot de passe"}
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="h-16 w-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Succès !</h2>
            <p className="text-slate-500 mt-4">Votre mot de passe a été modifié. Redirection...</p>
          </div>
        )}
      </Card>
    </div>
  );
}
