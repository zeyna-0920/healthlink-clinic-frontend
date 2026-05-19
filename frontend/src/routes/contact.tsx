import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Clinique Moulaye Dabakh" },
      { name: "description", content: "Contactez-nous : adresse, téléphone, email et formulaire." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }
    toast.success("Message envoyé. Nous vous répondrons rapidement.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16 space-y-4">
          <Badge className="bg-primary/10 text-primary border-none px-4 py-1.5 rounded-full">Contactez-nous</Badge>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Nous sommes à <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">votre écoute</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Une question ou besoin d'une information ? Nos équipes sont disponibles pour vous accompagner.
          </p>
        </div>

        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10">
          <div className="space-y-6">
            <Card className="group relative overflow-hidden rounded-3xl border-none bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-xl transition-all duration-300 hover:shadow-blue-500/20 hover:-translate-y-1">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-xl transition-all group-hover:bg-white/20" />
              <div className="relative z-10 flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-inner flex-shrink-0">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold tracking-tight">Adresse</div>
                  <div className="text-blue-50/90 font-medium">Rue de la Santé, Dakar, Sénégal</div>
                </div>
              </div>
            </Card>

            <Card className="group relative overflow-hidden rounded-3xl border-none bg-gradient-to-br from-emerald-500 to-teal-700 p-6 text-white shadow-xl transition-all duration-300 hover:shadow-emerald-500/20 hover:-translate-y-1">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-xl transition-all group-hover:bg-white/20" />
              <div className="relative z-10 flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-inner flex-shrink-0">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold tracking-tight">Téléphone</div>
                  <div className="text-emerald-50/90 font-medium">+221 33 123 45 67</div>
                </div>
              </div>
            </Card>

            <Card className="group relative overflow-hidden rounded-3xl border-none bg-gradient-to-br from-purple-500 to-indigo-700 p-6 text-white shadow-xl transition-all duration-300 hover:shadow-purple-500/20 hover:-translate-y-1">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-xl transition-all group-hover:bg-white/20" />
              <div className="relative z-10 flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-inner flex-shrink-0">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold tracking-tight">Email</div>
                  <div className="text-purple-50/90 font-medium">contact@moulaye-dabakh.sn</div>
                </div>
              </div>
            </Card>

            <Card className="group relative overflow-hidden rounded-3xl border-none bg-gradient-to-br from-orange-500 to-amber-600 p-6 text-white shadow-xl transition-all duration-300 hover:shadow-orange-500/20 hover:-translate-y-1">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-xl transition-all group-hover:bg-white/20" />
              <div className="relative z-10 flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md shadow-inner flex-shrink-0">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold tracking-tight">Horaires</div>
                  <div className="text-orange-50/90 font-medium text-sm leading-relaxed">
                    Consultations : 08h – 00h<br />
                    Urgences : 24h/24
                  </div>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-white">
              <iframe
                title="Localisation Clinique"
                src="https://www.google.com/maps?q=Dakar,Senegal&output=embed"
                width="100%"
                height="220"
                loading="lazy"
                style={{ border: 0 }}
                className="grayscale hover:grayscale-0 transition-all duration-500"
              />
            </Card>
          </div>

          <Card className="p-10 border-none shadow-2xl rounded-[3rem] bg-white relative overflow-hidden group">
            <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-blue-500/5 blur-3xl transition-all group-hover:bg-blue-500/10" />
            
            <div className="relative z-10 mb-10">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
                  <MessageCircle className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Envoyez un message</h3>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Nous vous répondrons rapidement</p>
                </div>
              </div>
            </div>

            <form onSubmit={submit} className="relative z-10 space-y-6">
              <div className="space-y-3">
                <Label className="text-slate-600 font-bold ml-1 uppercase tracking-widest text-[10px]">Nom complet</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex: Amadou Diop"
                  className="h-14 rounded-2xl border-slate-200 focus:ring-primary shadow-sm text-lg font-medium px-6 bg-slate-50/50"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-slate-600 font-bold ml-1 uppercase tracking-widest text-[10px]">Email professionnel</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Ex: amadou@email.com"
                  className="h-14 rounded-2xl border-slate-200 focus:ring-primary shadow-sm text-lg font-medium px-6 bg-slate-50/50"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-slate-600 font-bold ml-1 uppercase tracking-widest text-[10px]">Votre message</Label>
                <Textarea
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Comment pouvons-nous vous aider ?"
                  className="rounded-[1.5rem] border-slate-200 focus:ring-primary shadow-sm text-lg font-medium p-6 bg-slate-50/50"
                />
              </div>
              <Button type="submit" className="w-full h-16 rounded-[2rem] text-xl font-bold gap-3 shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 hover:shadow-primary/30">
                <Send className="h-5 w-5" /> Envoyer le message
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

