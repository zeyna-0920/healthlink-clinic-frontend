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
  CheckCircle,
  Clock,
  LogIn,
  Moon,
  Sun,
  Loader2,
  CreditCard,
  Calendar as CalendarIcon,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
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
  console.log("Rendering AppointmentBookingForm...");
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
    <div className="min-h-screen bg-slate-50/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16 space-y-4">
          <Badge className="bg-primary/10 text-primary border-none px-4 py-1.5 rounded-full">Prise de rendez-vous</Badge>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Prendre <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">rendez-vous</span> en ligne
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Connectez-vous, choisissez votre créneau (08h–19h tarif jour, à partir de 20h tarif
            nuit), puis réglez en ligne par Wave ou Orange Money.
          </p>
        </div>

        {!loggedIn && (
          <Card className="mb-10 group relative overflow-hidden border-none bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-xl rounded-[2.5rem] transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl transition-all group-hover:bg-white/20" />
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                  <LogIn className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold">Connexion Requise</h3>
                  <p className="text-blue-50/90 font-medium">Vous devez être connecté pour réserver et payer votre consultation.</p>
                </div>
              </div>
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 rounded-2xl font-bold h-14 px-8 text-lg shadow-xl shadow-black/10">
                <Link to="/auth">Se connecter / S&apos;inscrire</Link>
              </Button>
            </div>
          </Card>
        )}

        {loggedIn && patient && (
          <Card className="mb-10 group relative overflow-hidden border-none bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white shadow-xl rounded-[2.5rem]">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="relative z-10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-emerald-50/80">Patient connecté</p>
                  <p className="text-xl font-extrabold">{patient.firstName} {patient.lastName} — {patient.phone}</p>
                </div>
              </div>
              <Badge className="bg-white/20 backdrop-blur-md border-none text-white px-4 py-1.5 rounded-xl font-bold text-sm">
                {ageGroup === "child" ? "Tarif enfant" : "Tarif adulte"}
              </Badge>
            </div>
          </Card>
        )}

        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10">
          <Card className="p-8 border-none shadow-2xl rounded-[3rem] bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden group transition-all duration-500 hover:shadow-blue-500/20 hover:-translate-y-1">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl transition-all group-hover:bg-white/20" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                  <BedDouble className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-100/70">Disponibilité</p>
                  <p className="text-lg font-bold">
                    Lits libres :{" "}
                    <span className="text-white font-black">
                      {AVAILABLE_BEDS} / {TOTAL_BEDS}
                    </span>
                  </p>
                </div>
              </div>

              <div className="rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl p-4 bg-white/10 backdrop-blur-md">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={{ before: new Date() }}
                  className="rounded-md border-none bg-transparent text-white"
                />
              </div>

              <div className="mt-10 space-y-4">
                <div className="group/item flex items-center gap-4 p-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 transition-all hover:bg-white/20">
                  <div className="h-12 w-12 rounded-xl bg-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <Sun className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Tarif Journée</p>
                    <p className="text-xs font-medium text-blue-100/80">{TARIFFS.jour.adult} FCFA • 08h–19h</p>
                  </div>
                </div>

                <div className="group/item flex items-center gap-4 p-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 transition-all hover:bg-white/20">
                  <div className="h-12 w-12 rounded-xl bg-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <Moon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Tarif Nuit</p>
                    <p className="text-xs font-medium text-blue-100/80">{TARIFFS.nuit.adult} FCFA • Dès 20h</p>
                  </div>
                </div>

                <div className="group/item flex items-center gap-4 p-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 transition-all hover:bg-white/20">
                  <div className="h-12 w-12 rounded-xl bg-sky-400 flex items-center justify-center shadow-lg shadow-sky-500/20">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Consultations</p>
                    <p className="text-xs font-medium text-blue-100/80">Ouvert 7j/7 • 08h – 23h</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-10 border-none shadow-2xl rounded-[3rem] bg-white relative overflow-hidden group transition-all duration-500 hover:shadow-blue-500/5">
            <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-blue-500/5 blur-3xl transition-all group-hover:bg-blue-500/10" />
            
            <div className="relative z-10 mb-10">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
                  <CalendarIcon className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Détails du RDV</h3>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Formulaire de réservation</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
              <div className="space-y-3">
                <Label className="text-slate-600 font-bold ml-1 uppercase tracking-widest text-[10px]">Heure du rendez-vous</Label>
                <Select value={hour} onValueChange={setHour} disabled={!loggedIn}>
                  <SelectTrigger className="h-14 rounded-2xl border-slate-200 focus:ring-primary shadow-sm text-lg font-medium px-6 bg-slate-50/50">
                    <SelectValue placeholder="Choisir une heure" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-100 shadow-2xl p-2">
                    {ALL_CONSULTATION_HOURS.map((h) => (
                      <SelectItem key={h} value={h} className="rounded-xl h-12 font-medium">
                        {h} — {getTariffPeriodFromTime(h) === "jour" ? "Tarif jour" : "Tarif nuit"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-slate-600 font-bold ml-1 uppercase tracking-widest text-[10px]">Type de consultation</Label>
                <Select value={type} onValueChange={setType} disabled={!loggedIn}>
                  <SelectTrigger className="h-14 rounded-2xl border-slate-200 focus:ring-primary shadow-sm text-lg font-medium px-6 bg-slate-50/50">
                    <SelectValue placeholder="Choisir le type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-100 shadow-2xl p-2">
                    {CONSULTATION_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value} className="rounded-xl h-12 font-medium">
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-slate-600 font-bold ml-1 uppercase tracking-widest text-[10px]">Motif de consultation</Label>
                <Input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Ex: Douleurs abdominales, fièvre..."
                  disabled={!loggedIn}
                  className="h-14 rounded-2xl border-slate-200 focus:ring-primary shadow-sm text-lg font-medium px-6 bg-slate-50/50"
                />
              </div>

              {pricePreview && (
                <div
                  className={cn(
                    "rounded-[2rem] border-none p-8 flex items-center justify-between text-white shadow-xl transition-all animate-in zoom-in-95 duration-300",
                    period === "nuit"
                      ? "bg-gradient-to-r from-indigo-600 to-blue-700 shadow-indigo-500/20"
                      : "bg-gradient-to-r from-amber-500 to-orange-600 shadow-orange-500/20"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                      {period === "nuit" ? (
                        <Moon className="h-7 w-7 text-white" />
                      ) : (
                        <Sun className="h-7 w-7 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-white/70">Récapitulatif Tarif</p>
                      <p className="text-lg font-bold">
                        {TARIFFS[pricePreview.period].label} ({ageGroup === "child" ? "enfant" : "adulte"})
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-4xl font-black">
                      {pricePreview.amount.toLocaleString("fr-FR")}
                    </span>
                    <span className="ml-2 text-sm font-bold opacity-70 text-white">FCFA</span>
                  </div>
                </div>
              )}

              {hospiBlocked && (
                <div className="flex items-start gap-4 rounded-[2rem] bg-rose-50 border border-rose-100 p-6 text-rose-700 animate-in slide-in-from-top-4 duration-300">
                  <div className="h-10 w-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold">Clinique pleine</p>
                    <p className="text-sm opacity-90 leading-relaxed">Aucun lit disponible actuellement. Essayez la téléconsultation ou contactez-nous en cas d'urgence.</p>
                  </div>
                </div>
              )}

              {isHospi && !hospiBlocked && (
                <div className="flex items-start gap-4 rounded-[2rem] bg-emerald-50 border border-emerald-100 p-6 text-emerald-700 animate-in slide-in-from-top-4 duration-300">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold">Disponibilité confirmée</p>
                    <p className="text-sm opacity-90 leading-relaxed">{AVAILABLE_BEDS} lit(s) libre(s). Vous pouvez procéder à l'hospitalisation.</p>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full h-16 rounded-[2rem] text-xl font-bold gap-3 shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 hover:shadow-primary/30"
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
