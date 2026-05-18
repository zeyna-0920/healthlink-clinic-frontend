import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  BedDouble,
  AlertCircle,
  CheckCircle2,
  Clock,
  LogIn,
  Moon,
  Sun,
  Loader2,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import {
  ALL_CONSULTATION_HOURS,
  CONSULTATION_TYPES,
  getConsultationAmount,
  getDepartmentForType,
  getAgeGroupFromBirthDate,
  getTariffPeriodFromTime,
  TARIFFS,
} from "@/lib/pricing";
import { getStoredPatient, savePendingCheckout } from "@/lib/patient-session";
import { confirmAppointment, createAppointment } from "@/routes/api/-clinic";

const TOTAL_BEDS = 20;
const OCCUPIED_BEDS = 18;
const AVAILABLE_BEDS = TOTAL_BEDS - OCCUPIED_BEDS;

export function AppointmentBookingForm() {
  const navigate = useNavigate();
  const [patient, setPatient] = useState(() => getStoredPatient());
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [hour, setHour] = useState("");
  const [type, setType] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setPatient(getStoredPatient());
  }, []);

  const loggedIn = Boolean(patient?._id);
  const ageGroup = getAgeGroupFromBirthDate(patient?.dateOfBirth);
  const pricePreview = hour ? getConsultationAmount(hour, ageGroup) : null;
  const period = hour ? getTariffPeriodFromTime(hour) : null;

  const isHospi = type === "hospitalisation";
  const hospiBlocked = isHospi && AVAILABLE_BEDS === 0;

  const consultationLabel = useMemo(
    () => CONSULTATION_TYPES.find((t) => t.value === type)?.label ?? "",
    [type],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loggedIn || !patient) {
      toast.error("Connectez-vous pour réserver un rendez-vous.");
      navigate({ to: "/auth" });
      return;
    }

    if (!date || !hour || !type || !reason.trim()) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }

    if (hospiBlocked) {
      toast.error("Aucun lit disponible. Hospitalisation impossible aujourd'hui.");
      return;
    }

    const { amount, period: tariffPeriod } = getConsultationAmount(hour, ageGroup);
    const department = getDepartmentForType(type);

    setSubmitting(true);
    try {
      const appointmentDate = new Date(date);
      appointmentDate.setHours(12, 0, 0, 0);

      const result = await createAppointment({
        patientId: patient._id,
        appointmentDate: appointmentDate.toISOString(),
        appointmentTime: hour,
        department,
        reason: `${consultationLabel} — ${reason.trim()}`,
        doctorName: "À assigner",
      });

      if (!result.success || !result.appointment?._id) {
        toast.error(result.message || "Échec de la réservation.");
        return;
      }

      await confirmAppointment(result.appointment._id);

      savePendingCheckout({
        appointmentId: result.appointment._id,
        patientId: patient._id,
        amount,
        period: tariffPeriod,
        ageGroup,
        appointmentDate: date.toLocaleDateString("fr-FR"),
        appointmentTime: hour,
        consultationLabel,
        patientName: `${patient.firstName} ${patient.lastName}`,
        phone: patient.phone,
      });

      toast.success("Rendez-vous confirmé ! Passez au paiement.");
      navigate({
        to: "/tarifs",
        search: { checkout: "1", appointmentId: result.appointment._id },
      });
    } catch {
      toast.error("Erreur réseau. Vérifiez que le serveur est démarré.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">
            Prendre <span className="text-primary">rendez-vous</span> en ligne
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Connectez-vous, choisissez votre créneau (08h–19h tarif jour, à partir de 20h tarif
            nuit), puis réglez en ligne par Wave ou Orange Money.
          </p>
        </div>

        {!loggedIn && (
          <Card className="mb-6 border-primary/30 bg-primary/5 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sm">
              <LogIn className="h-5 w-5 text-primary shrink-0" />
              <span>Vous devez être connecté pour réserver et payer votre consultation.</span>
            </div>
            <Button asChild>
              <Link to="/auth">Se connecter / S&apos;inscrire</Link>
            </Button>
          </Card>
        )}

        {loggedIn && patient && (
          <Card className="mb-6 p-4 border-medical/20 bg-medical/5">
            <p className="text-sm">
              <span className="font-semibold text-medical">Patient connecté :</span>{" "}
              {patient.firstName} {patient.lastName} — {patient.phone}
              <Badge variant="outline" className="ml-2">
                {ageGroup === "child" ? "Tarif enfant" : "Tarif adulte"}
              </Badge>
            </p>
          </Card>
        )}

        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BedDouble className="h-5 w-5 text-success" />
              <span className="text-sm font-medium">
                Lits disponibles :{" "}
                <span className="font-bold text-success">
                  {AVAILABLE_BEDS} / {TOTAL_BEDS}
                </span>
              </span>
            </div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
              className="rounded-md border"
            />
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Sun className="h-4 w-4 text-amber-500" />
                Jour (08h–19h) : {TARIFFS.jour.adult} FCFA adulte
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Moon className="h-4 w-4 text-medical" />
                Nuit (à partir de 20h) : {TARIFFS.nuit.adult} FCFA adulte
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" />
                Consultations : 08h – 23h
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Heure du rendez-vous</Label>
                <Select value={hour} onValueChange={setHour} disabled={!loggedIn}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une heure" />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_CONSULTATION_HOURS.map((h) => (
                      <SelectItem key={h} value={h}>
                        {h} — {getTariffPeriodFromTime(h) === "jour" ? "Tarif jour" : "Tarif nuit"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Type de consultation</Label>
                <Select value={type} onValueChange={setType} disabled={!loggedIn}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir le type" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONSULTATION_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Motif de consultation</Label>
                <Input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Décrivez brièvement votre motif"
                  disabled={!loggedIn}
                />
              </div>

              {pricePreview && (
                <div
                  className={`rounded-lg border p-4 flex items-center justify-between ${
                    period === "nuit"
                      ? "border-medical/30 bg-medical/5"
                      : "border-amber-500/30 bg-amber-500/5"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {period === "nuit" ? (
                      <Moon className="h-5 w-5 text-medical" />
                    ) : (
                      <Sun className="h-5 w-5 text-amber-500" />
                    )}
                    <span className="text-sm font-medium">
                      Tarif {TARIFFS[pricePreview.period].label} (
                      {ageGroup === "child" ? "enfant" : "adulte"})
                    </span>
                  </div>
                  <span className="text-xl font-bold text-primary">
                    {pricePreview.amount.toLocaleString("fr-FR")} FCFA
                  </span>
                </div>
              )}

              {hospiBlocked && (
                <div className="flex items-start gap-2 rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    Clinique pleine — aucun lit disponible. Essayez la téléconsultation ou
                    contactez-nous pour une urgence.
                  </div>
                </div>
              )}

              {isHospi && !hospiBlocked && (
                <div className="flex items-start gap-2 rounded-md bg-success/10 border border-success/20 p-3 text-sm text-success">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>{AVAILABLE_BEDS} lit(s) disponible(s). Hospitalisation possible.</div>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full gap-2"
                disabled={hospiBlocked || !loggedIn || submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Validation en cours…
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    Valider et payer
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
