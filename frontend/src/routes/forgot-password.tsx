import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ChevronLeft, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { getApiBaseUrl } from "@/lib/api-base";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Veuillez entrer votre email");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/patients/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (data.success) {
        setSent(true);
        toast.success("Lien de réinitialisation envoyé !");
      } else {
        toast.error(data.message || "Erreur lors de l'envoi de l'email");
      }
    } catch (error) {
      toast.error("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/auth" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary mb-8 transition-colors font-medium">
          <ChevronLeft className="h-4 w-4" />
          Retour à la connexion
        </Link>

        <Card className="p-8 rounded-[2.5rem] shadow-xl border-none">
          {!sent ? (
            <>
              <div className="text-center mb-8">
                <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900">Mot de passe oublié ?</h1>
                <p className="text-slate-500 mt-2">Entrez votre email pour recevoir un lien de réinitialisation.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="ml-1">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    className="h-12 rounded-xl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button className="w-full h-12 rounded-xl font-bold gap-2" disabled={loading}>
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Send className="h-4 w-4" /> Envoyer le lien</>}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="h-16 w-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Email envoyé !</h2>
              <p className="text-slate-500 mt-4 leading-relaxed">
                Si un compte existe pour <strong>{email}</strong>, vous recevrez un lien de réinitialisation d'ici quelques minutes.
              </p>
              <Button asChild className="mt-8 w-full h-12 rounded-xl" variant="outline">
                <Link to="/auth">Retour à la connexion</Link>
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
