import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Clock } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administration — Clinique Moulaye Dabakh" },
      {
        name: "description",
        content: "Espace d'administration de la clinique.",
      },
    ],
  }),
  component: AdminPage,
});

// Configuration admin
const ADMIN_CREDENTIALS = {
  email: "dienebat782@gmail.com",
  password: "T2000@1970",
};

function AdminPage() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginLoading, setLoginLoading] = useState(false);

  // Vérifier si déjà authentifié
  useEffect(() => {
    const adminAuth = localStorage.getItem("adminAuthenticated");
    if (adminAuth === "true") {
      // @ts-ignore
      navigate({ to: "/dashboard" });
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);

    if (
      loginData.email === ADMIN_CREDENTIALS.email &&
      loginData.password === ADMIN_CREDENTIALS.password
    ) {
      localStorage.setItem("adminAuthenticated", "true");
      toast.success("Connexion réussie");
      // @ts-ignore
      navigate({ to: "/dashboard" });
    } else {
      toast.error("Email ou mot de passe incorrect");
    }

    setLoginLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md p-8 shadow-2xl rounded-[2rem] border-none">
        <div className="text-center mb-8">
          <div className="bg-primary/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Shield className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Administration</h1>
          <p className="text-muted-foreground mt-2">Clinique Moulaye Dabakh</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email Professionnel</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@clinic.sn"
              className="h-12 rounded-xl"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="h-12 rounded-xl"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-xl text-lg font-bold shadow-lg shadow-primary/20"
            disabled={loginLoading}
          >
            {loginLoading ? (
              <>
                <Clock className="mr-2 h-5 w-5 animate-spin" />
                Vérification...
              </>
            ) : (
              "Se connecter"
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}
