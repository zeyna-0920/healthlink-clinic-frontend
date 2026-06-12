import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Lock, Mail, ChevronLeft, Loader2, Building2, Activity } from "lucide-react";
import { toast } from "sonner";
import { getApiBaseUrl } from "@/lib/api-base";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Portail Administratif — Clinique Moulaye Dabakh" },
      {
        name: "description",
        content: "Espace d'administration sécurisé de la clinique.",
      },
    ],
  }),
  component: AdminPage,
});

const ADMIN_EMAIL = "dienebat782@gmail.com";

function AdminPage() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginLoading, setLoginLoading] = useState(false);

  // Rediriger vers le dashboard seulement si c'est bien l'admin déjà connecté
  useEffect(() => {
    try {
      const adminAuth = localStorage.getItem("adminAuthenticated");
      const token = localStorage.getItem("authToken");
      const patientStr = localStorage.getItem("patient");
      const patient = patientStr ? JSON.parse(patientStr) : {};
      if (adminAuth === "true" && token && patient?.email === ADMIN_EMAIL) {
        navigate("/dashboard");
      }
    } catch (e) {
      // Ignore invalid localStorage data
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);

    try {
      const API_URL = `${getApiBaseUrl()}/api/patients/login`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (data.success) {
        // Vérifier si c'est bien l'admin
        if (data.patient.email === ADMIN_EMAIL) {
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("adminAuthenticated", "true");
          localStorage.setItem("patient", JSON.stringify(data.patient));
          toast.success("Authentification administrateur confirmée");
          navigate("/dashboard");
        } else {
          toast.error("Accès restreint au personnel autorisé uniquement.");
        }
      } else {
        toast.error(data.message || "Identifiants invalides");
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      toast.error("Connexion au serveur impossible.");
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Fond décoratif technologique */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
        >
          <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium">Retour au site</span>
        </Link>

        <Card className="p-0 border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-slate-800/50 backdrop-blur-xl border border-slate-700">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 text-center border-b border-slate-700">
            <div className="relative inline-block">
              <div className="bg-primary/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-primary/30">
                <Shield className="h-10 w-10 text-primary" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 h-6 w-6 rounded-full border-4 border-slate-800 flex items-center justify-center">
                <Activity className="h-3 w-3 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Portail Administratif</h1>
            <p className="text-slate-400 text-sm mt-2 font-medium flex items-center justify-center gap-2">
              <Building2 className="h-3 w-3" /> Clinique Moulaye Dabakh
            </p>
          </div>

          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300 font-semibold ml-1 text-xs uppercase tracking-wider">Identifiant Professionnel</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nom@clinic.sn"
                      className="h-14 rounded-2xl border-slate-700 bg-slate-900/50 text-white placeholder:text-slate-600 focus:border-primary focus:ring-primary transition-all"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-300 font-semibold ml-1 text-xs uppercase tracking-wider">Clé d'Accès</Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="h-14 rounded-2xl border-slate-700 bg-slate-900/50 text-white placeholder:text-slate-600 focus:border-primary focus:ring-primary transition-all"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
                disabled={loginLoading}
              >
                {loginLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  "Authentification"
                )}
              </Button>

              <div className="pt-4 text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">
                  Accès restreint • Session sécurisée
                </p>
              </div>
            </form>
          </div>
        </Card>
        
        <p className="mt-8 text-center text-slate-500 text-xs">
          © 2026 Clinique Moulaye Dabakh — Système de Gestion Hospitalière
        </p>
      </div>
    </div>
  );
}