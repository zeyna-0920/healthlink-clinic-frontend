import { Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Smartphone,
  CheckCircle2,
  Loader2,
  Calendar,
  Clock,
  Stethoscope,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import type { PendingCheckout } from "@/lib/patient-session";
import { TarifsGrid } from "@/components/TarifsGrid";

export function WaveIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <circle cx="24" cy="24" r="22" fill="#1DC4FF" />
      <path
        d="M14 28c2-6 6-10 10-10s8 4 10 10"
        stroke="white"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function OrangeMoneyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <circle cx="24" cy="24" r="22" fill="#FF7900" />
      <text x="24" y="29" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
        OM
      </text>
    </svg>
  );
}

type Props = {
  pending: PendingCheckout | null;
  isCheckout: boolean;
  paymentDone: boolean;
  phone: string;
  setPhone: (v: string) => void;
  paying: "wave" | "orange_money" | null;
  onPay: (method: "wave" | "orange_money") => void;
};

export function TarifsCheckoutView({
  pending,
  isCheckout,
  paymentDone,
  phone,
  setPhone,
  paying,
  onPay,
}: Props) {
  return (
    <div className="min-h-screen ">
      <section className="relative overflow-hidden border-b border-border/60 bg-[image:var(--gradient-hero)] text-primary-foreground">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_50%)]" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center">
          <Badge className="mb-4 bg-white/15 text-white border-white/25 hover:bg-white/20">
            Paiement sécurisé
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-tight mb-4">
            Tarifs & règlement
          </h1>
          <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
            Consultation de jour (08h–19h) ou de nuit (à partir de 20h). Réglez par Wave ou Orange
            Money.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {isCheckout && pending && !paymentDone && (
          <Card className="overflow-hidden border-none shadow-2xl rounded-[2.5rem] bg-white">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6 text-white relative overflow-hidden">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
              <h2 className="text-2xl font-bold flex items-center gap-3 relative z-10">
                <Stethoscope className="h-6 w-6" />
                Votre rendez-vous à régler
              </h2>
            </div>
            <div className="p-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm border-b border-slate-100">
              <div className="space-y-1">
                <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  Patient
                </p>
                <p className="text-lg font-bold text-slate-900">{pending.patientName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Date
                </p>
                <p className="text-lg font-bold text-slate-900">{pending.appointmentDate}</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Heure
                </p>
                <p className="text-lg font-bold text-slate-900">{pending.appointmentTime}</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  Montant à régler
                </p>
                <div className="flex flex-col">
                  <p className="text-3xl font-black text-primary">
                    {pending.amount.toLocaleString("fr-FR")} <span className="text-sm font-bold">FCFA</span>
                  </p>
                  <Badge
                    className="mt-2 w-fit bg-primary/10 text-primary border-none font-bold"
                    variant="outline"
                  >
                    {pending.period === "jour" ? "Tarif journée" : "Tarif nuit"} —{" "}
                    {pending.ageGroup === "child" ? "enfant" : "adulte"}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="p-8 bg-slate-50/50 space-y-8">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Choisissez votre moyen de paiement
                </h3>
              </div>
              <div className="space-y-3 max-w-md">
                <Label htmlFor="pay-phone" className="text-slate-600 font-bold ml-1">
                  Numéro mobile (Wave / Orange Money)
                </Label>
                <Input
                  id="pay-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+221 77 000 00 00"
                  className="h-14 rounded-2xl border-slate-200 focus:ring-primary shadow-sm text-lg font-medium px-6"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Button
                  type="button"
                  size="lg"
                  className="h-16 rounded-2xl gap-3 bg-[#1DC4FF] hover:bg-[#19b0e8] text-white shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-1 font-bold text-lg"
                  disabled={paying !== null}
                  onClick={() => onPay("wave")}
                >
                  {paying === "wave" ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <WaveIcon className="h-10 w-10 shrink-0" />
                  )}
                  Payer avec Wave
                  <ArrowRight className="h-5 w-5 ml-auto opacity-80" />
                </Button>
                <Button
                  type="button"
                  size="lg"
                  className="h-16 rounded-2xl gap-3 bg-[#FF7900] hover:bg-[#e66d00] text-white shadow-xl shadow-orange-500/20 transition-all hover:-translate-y-1 font-bold text-lg"
                  disabled={paying !== null}
                  onClick={() => onPay("orange_money")}
                >
                  {paying === "orange_money" ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <OrangeMoneyIcon className="h-10 w-10 shrink-0" />
                  )}
                  Orange Money
                  <ArrowRight className="h-5 w-5 ml-auto opacity-80" />
                </Button>
              </div>
              <p className="text-sm text-slate-400 flex items-center gap-2 font-medium">
                <ShieldCheck className="h-4 w-4 text-emerald-500" /> Paiement sécurisé — confirmation
                immédiate sur votre téléphone.
              </p>
            </div>
          </Card>
        )}

        {paymentDone && (
          <Card className="p-12 text-center border-none shadow-2xl rounded-[3rem] bg-emerald-50 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl transition-all group-hover:bg-emerald-500/20" />
            <div className="h-20 w-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/30">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-3">Paiement confirmé !</h2>
            <p className="text-slate-600 mb-10 text-lg font-medium max-w-md mx-auto">
              Votre consultation est réservée et payée avec succès. Nous vous attendons avec
              impatience à la clinique.
            </p>
            <Button asChild size="lg" className="rounded-2xl h-14 px-10 font-bold">
              <Link to="/dashboard">Accéder à mon espace patient</Link>
            </Button>
          </Card>
        )}

        <TarifsGrid showCta={!isCheckout && !paymentDone} />
      </div>
    </div>
  );
}
