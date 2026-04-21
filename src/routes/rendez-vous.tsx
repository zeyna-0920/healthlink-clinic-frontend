import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BedDouble, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/rendez-vous")({
  head: () => ({
    meta: [
      { title: "Prendre rendez-vous — Clinique Moulaye Dabakh" },
      { name: "description", content: "Réservez votre consultation en ligne en quelques clics." },
    ],
  }),
  component: AppointmentPage,
});

const TOTAL_BEDS = 20;
const OCCUPIED_BEDS = 18;
const AVAILABLE_BEDS = TOTAL_BEDS - OCCUPIED_BEDS;
const HOURS = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00", "20:00", "22:00"];

function AppointmentPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [hour, setHour] = useState("");
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const isHospi = type === "hospitalisation";
  const hospiBlocked = isHospi && AVAILABLE_BEDS === 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !hour || !type || !name || !phone) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }
    if (hospiBlocked) {
      toast.error("Aucun lit disponible. Hospitalisation impossible aujourd'hui.");
      return;
    }
    toast.success(`RDV confirmé pour ${name} le ${date.toLocaleDateString("fr-FR")} à ${hour}.`);
    setHour(""); setType(""); setName(""); setPhone("");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold mb-3">Prendre <span className="text-primary">rendez-vous</span> en ligne</h1>
        <p className="text-muted-foreground">Sélectionnez votre date et le type de consultation souhaité.</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BedDouble className="h-5 w-5 text-success" />
            <span className="text-sm font-medium">Lits disponibles : <span className="font-bold text-success">{AVAILABLE_BEDS} / {TOTAL_BEDS}</span></span>
          </div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
            className="rounded-md border"
          />
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4 text-primary" />Consultations : 08h – 00h</div>
            <div className="flex items-center gap-2 text-muted-foreground"><AlertCircle className="h-4 w-4 text-destructive" />Urgences acceptées 24h/24</div>
          </div>
        </Card>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nom complet</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre nom" />
              </div>
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+221 ..." />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Heure</Label>
              <Select value={hour} onValueChange={setHour}>
                <SelectTrigger><SelectValue placeholder="Choisir une heure" /></SelectTrigger>
                <SelectContent>
                  {HOURS.map((h) => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Type de consultation</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue placeholder="Choisir le type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="generale">Consultation générale</SelectItem>
                  <SelectItem value="tele">Téléconsultation</SelectItem>
                  <SelectItem value="hospitalisation">Hospitalisation</SelectItem>
                  <SelectItem value="soins">Soins infirmiers</SelectItem>
                  <SelectItem value="urgence">Urgence</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {hospiBlocked && (
              <div className="flex items-start gap-2 rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>Clinique pleine — aucun lit disponible. Veuillez essayer la téléconsultation ou nous contacter pour une urgence.</div>
              </div>
            )}

            {isHospi && !hospiBlocked && (
              <div className="flex items-start gap-2 rounded-md bg-success/10 border border-success/20 p-3 text-sm text-success">
                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>{AVAILABLE_BEDS} lit(s) disponible(s). Hospitalisation possible.</div>
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={hospiBlocked}>
              Valider le rendez-vous
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
