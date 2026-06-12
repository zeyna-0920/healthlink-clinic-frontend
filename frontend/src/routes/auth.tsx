import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShieldCheck, 
  Loader2, 
  Stethoscope, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Calendar, 
  ChevronRight,
  HeartPulse,
  Activity,
  UserPlus,
  Github,
  Chrome
} from "lucide-react";
import { toast } from "sonner";
import { getApiBaseUrl } from "@/lib/api-base";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Espace Patient — Clinique Moulaye Dabakh" },
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
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  // Gérer le retour du social login
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const patientStr = params.get("patient");
    const error = params.get("error");

    if (token && patientStr) {
      localStorage.setItem("authToken", token);
      localStorage.setItem("patient", decodeURIComponent(patientStr));
      toast.success("Connexion sociale réussie !");
      setTimeout(() => {
        navigate("/rendez-vous");
      }, 500);
    } else if (error) {
      toast.error("Échec de la connexion sociale. Veuillez réessayer.");
    }
  }, [navigate]);

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

  const handleSocialLogin = (provider: "google" | "github") => {
    const backendBaseUrl = getApiBaseUrl() || "http://localhost:5000";
    window.location.href = `${backendBaseUrl}/api/patients/auth/${provider}`;
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
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("patient", JSON.stringify(data.patient));

        if (data.requiresPasswordSetup) {
          toast.info("Veuillez définir un mot de passe pour sécuriser votre compte.");
          setTimeout(() => {
            navigate("/set-password");
          }, 1000);
        } else {
          toast.success("Heureux de vous revoir !");
          setTimeout(() => {
            navigate("/rendez-vous");
          }, 1000);
        }
      } else {
        toast.error(data.message || "Email ou mot de passe incorrect");
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      toast.error("Une erreur est survenue. Vérifiez votre connexion.");
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
      toast.error("Veuillez remplir tous les champs obligatoires");
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
        toast.success("Bienvenue à la Clinique ! Vous pouvez maintenant vous connecter.");
        setTab("login");
        setLoginData({
          email: signupData.email,
          password: "",
        });
      } else {
        toast.error(data.message || "Erreur lors de l'inscription");
      }
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      toast.error("Une erreur est survenue lors de la création du compte.");
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Éléments décoratifs en arrière-plan */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* Section Gauche : Contenu Informatif */}
        <div className="hidden lg:flex flex-col space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
              <Activity className="h-4 w-4" />
              <span>Espace Patient Sécurisé</span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 leading-tight">
              Prenez soin de votre santé avec <span className="text-primary">Allo Docteur</span>
            </h1>
            <p className="mt-6 text-xl text-slate-600 leading-relaxed">
              La Clinique Moulaye Dabakh met à votre disposition une plateforme moderne pour gérer vos rendez-vous, consulter vos résultats et échanger avec nos spécialistes.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
              <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-900">Rendez-vous 24/7</h3>
              <p className="text-sm text-slate-500 mt-1">Réservez vos consultations en quelques clics.</p>
            </div>
            <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
              <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                <HeartPulse className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-900">Suivi Médical</h3>
              <p className="text-sm text-slate-500 mt-1">Accédez à votre historique et vos prescriptions.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              !
            </div>
            <p className="text-sm text-slate-700">
              <span className="font-bold">Urgence ?</span> Contactez-nous immédiatement au <span className="text-primary font-bold">+221 33 800 00 00</span>
            </p>
          </div>
        </div>

        {/* Section Droite : Formulaire */}
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8 lg:hidden">
            <h1 className="text-3xl font-bold text-slate-900">Espace Patient</h1>
            <p className="text-slate-500 mt-2">Clinique Moulaye Dabakh</p>
          </div>

          <Card className="p-0 border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] overflow-hidden bg-white">
            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <TabsList className="grid grid-cols-2 h-16 p-2 bg-slate-50 rounded-none border-b border-slate-100">
                <TabsTrigger 
                  value="login" 
                  className="rounded-2xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-bold transition-all"
                >
                  Se connecter
                </TabsTrigger>
                <TabsTrigger 
                  value="signup" 
                  className="rounded-2xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-primary font-bold transition-all"
                >
                  S'inscrire
                </TabsTrigger>
              </TabsList>

              <div className="p-8">
                <TabsContent value="login" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <Button
                      variant="outline"
                      className="h-12 rounded-xl border-slate-200 hover:bg-slate-50 gap-2 font-bold"
                      onClick={() => handleSocialLogin("google")}
                    >
                      <Chrome className="h-5 w-5 text-red-500" />
                      Google
                    </Button>
                    <Button
                      variant="outline"
                      className="h-12 rounded-xl border-slate-200 hover:bg-slate-50 gap-2 font-bold"
                      onClick={() => handleSocialLogin("github")}
                    >
                      <Github className="h-5 w-5" />
                      GitHub
                    </Button>
                  </div>

                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-100"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-4 text-slate-400 font-bold tracking-wider">Ou avec email</span>
                    </div>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email" className="text-slate-700 font-semibold ml-1">Email</Label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                          <Input
                            id="login-email"
                            type="email"
                            placeholder="votre@email.com"
                            name="email"
                            className="pl-12 h-14 rounded-2xl border-slate-200 focus:border-primary focus:ring-primary bg-slate-50/50"
                            value={loginData.email}
                            onChange={handleLoginChange}
                            disabled={loginLoading}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between ml-1">
                          <Label htmlFor="login-password" className="text-slate-700 font-semibold">Mot de passe</Label>
                          <Link to="/forgot-password" title="Réinitialiser" className="text-xs font-bold text-primary hover:underline">Oublié ?</Link>
                        </div>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                          <Input
                            id="login-password"
                            type="password"
                            placeholder="••••••••"
                            name="password"
                            className="pl-12 h-14 rounded-2xl border-slate-200 focus:border-primary focus:ring-primary bg-slate-50/50"
                            value={loginData.password}
                            onChange={handleLoginChange}
                            disabled={loginLoading}
                          />
                        </div>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98]" 
                      disabled={loginLoading}
                    >
                      {loginLoading ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Connexion <ChevronRight className="h-5 w-5" />
                        </span>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <Button
                      variant="outline"
                      className="h-12 rounded-xl border-slate-200 hover:bg-slate-50 gap-2 font-bold"
                      onClick={() => handleSocialLogin("google")}
                    >
                      <Chrome className="h-5 w-5 text-red-500" />
                      Google
                    </Button>
                    <Button
                      variant="outline"
                      className="h-12 rounded-xl border-slate-200 hover:bg-slate-50 gap-2 font-bold"
                      onClick={() => handleSocialLogin("github")}
                    >
                      <Github className="h-5 w-5" />
                      GitHub
                    </Button>
                  </div>

                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-100"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-4 text-slate-400 font-bold tracking-wider">Ou avec email</span>
                    </div>
                  </div>

                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold ml-1 text-sm">Prénom</Label>
                        <Input
                          placeholder="Prénom"
                          name="firstName"
                          className="h-12 rounded-xl border-slate-200 bg-slate-50/50"
                          value={signupData.firstName}
                          onChange={handleSignupChange}
                          disabled={signupLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold ml-1 text-sm">Nom</Label>
                        <Input
                          placeholder="Nom"
                          name="lastName"
                          className="h-12 rounded-xl border-slate-200 bg-slate-50/50"
                          value={signupData.lastName}
                          onChange={handleSignupChange}
                          disabled={signupLoading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold ml-1 text-sm">Email</Label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          type="email"
                          placeholder="votre@email.com"
                          name="email"
                          className="pl-10 h-12 rounded-xl border-slate-200 bg-slate-50/50"
                          value={signupData.email}
                          onChange={handleSignupChange}
                          disabled={signupLoading}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold ml-1 text-sm">Téléphone</Label>
                        <div className="relative group">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            placeholder="77..."
                            name="phone"
                            className="pl-10 h-12 rounded-xl border-slate-200 bg-slate-50/50"
                            value={signupData.phone}
                            onChange={handleSignupChange}
                            disabled={signupLoading}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-semibold ml-1 text-sm">Genre</Label>
                        <select
                          name="gender"
                          value={signupData.gender}
                          onChange={handleSignupChange}
                          disabled={signupLoading}
                          className="w-full h-12 px-3 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        >
                          <option value="">Sélectionnez</option>
                          <option value="M">Homme</option>
                          <option value="F">Femme</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold ml-1 text-sm">Date de naissance</Label>
                      <div className="relative group">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          type="date"
                          name="dateOfBirth"
                          className="pl-10 h-12 rounded-xl border-slate-200 bg-slate-50/50"
                          value={signupData.dateOfBirth}
                          onChange={handleSignupChange}
                          disabled={signupLoading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700 font-semibold ml-1 text-sm">Mot de passe</Label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          name="password"
                          className="pl-10 h-12 rounded-xl border-slate-200 bg-slate-50/50"
                          value={signupData.password}
                          onChange={handleSignupChange}
                          disabled={signupLoading}
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] mt-2" 
                      disabled={signupLoading}
                    >
                      {signupLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Créer mon compte <UserPlus className="h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </div>
            </Tabs>
          </Card>

          <div className="mt-8 flex items-center justify-center gap-2 text-slate-500 text-xs font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Données protégées par cryptage SSL de grade médical</span>
          </div>
        </div>
      </div>
    </div>
  );
}
