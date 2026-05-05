import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { toast } from "sonner";

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
    <div className="bg-[image:var(--gradient-soft)]">
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Contactez-nous</h1>
        <p className="text-lg text-muted-foreground">Une question ? Nous sommes à votre écoute.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Card className="p-5 flex items-start gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-semibold">Adresse</div>
              <div className="text-sm text-muted-foreground">Rue de la Santé, Ville</div>
            </div>
          </Card>
          <Card className="p-5 flex items-start gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/10 flex-shrink-0">
              <Phone className="h-5 w-5 text-success" />
            </div>
            <div>
              <div className="font-semibold">Téléphone</div>
              <div className="text-sm text-muted-foreground">+221 33 123 45 67</div>
            </div>
          </Card>
          <Card className="p-5 flex items-start gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-medical/10 flex-shrink-0">
              <Mail className="h-5 w-5 text-medical" />
            </div>
            <div>
              <div className="font-semibold">Email</div>
              <div className="text-sm text-muted-foreground">contact@moulaye-dabakh.sn</div>
            </div>
          </Card>
          <Card className="p-5 flex items-start gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-destructive/10 flex-shrink-0">
              <Clock className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <div className="font-semibold">Horaires</div>
              <div className="text-sm text-muted-foreground">
                Consultations : 08h – 00h
                <br />
                Urgences : 24h/24
              </div>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <iframe
              title="Localisation Clinique"
              src="https://www.google.com/maps?q=Dakar,Senegal&output=embed"
              width="100%"
              height="280"
              loading="lazy"
              style={{ border: 0 }}
            />
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Envoyez-nous un message</h2>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nom</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                rows={6}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full">
              Envoyer
            </Button>
          </form>
        </Card>
      </div>
    </div>
    </div>
  );
}
