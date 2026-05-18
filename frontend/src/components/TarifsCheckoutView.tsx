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
          <Card className="overflow-hidden border-2 border-primary/20 shadow-lg">
            <div className="bg-[image:var(--gradient-hero)] px-6 py-4 text-primary-foreground">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Votre rendez-vous à régler
              </h2>
            </div>
            <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm border-b">
              <div>
                <p className="text-muted-foreground mb-1">Patient</p>
                <p className="font-semibold">{pending.patientName}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> Date
                </p>
                <p className="font-semibold">{pending.appointmentDate}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> Heure
                </p>
                <p className="font-semibold">{pending.appointmentTime}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Montant</p>
                <p className="text-2xl font-bold text-primary">
                  {pending.amount.toLocaleString("fr-FR")} FCFA
                </p>
                <Badge className="mt-2" variant="outline">
                  {pending.period === "jour" ? "Tarif journée" : "Tarif nuit"} —{" "}
                  {pending.ageGroup === "child" ? "enfant" : "adulte"}
                </Badge>
              </div>
            </div>
            <div className="p-6 bg-muted/20 space-y-4">
              <div className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Choisissez votre moyen de paiement</h3>
              </div>
              <div className="space-y-2 max-w-md">
                <Label htmlFor="pay-phone">Numéro mobile (Wave / Orange Money)</Label>
                <Input
                  id="pay-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+221 77 000 00 00"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Button
                  type="button"
                  size="lg"
                  className="h-14 gap-3 bg-[#1DC4FF] hover:bg-[#19b0e8] text-white shadow-md"
                  disabled={paying !== null}
                  onClick={() => onPay("wave")}
                >
                  {paying === "wave" ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <WaveIcon className="h-8 w-8 shrink-0" />
                  )}
                  Payer avec Wave
                  <ArrowRight className="h-4 w-4 ml-auto opacity-80" />
                </Button>
                <Button
                  type="button"
                  size="lg"
                  className="h-14 gap-3 bg-[#FF7900] hover:bg-[#e66d00] text-white shadow-md"
                  disabled={paying !== null}
                  onClick={() => onPay("orange_money")}
                >
                  {paying === "orange_money" ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <OrangeMoneyIcon className="h-8 w-8 shrink-0" />
                  )}
                  Orange Money
                  <ArrowRight className="h-4 w-4 ml-auto opacity-80" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" /> Paiement sécurisé — confirmation sur votre
                téléphone.
              </p>
            </div>
          </Card>
        )}

        {paymentDone && (
          <Card className="p-8 text-center border-success/30 bg-success/5">
            <CheckCircle2 className="h-14 w-14 text-success mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Paiement confirmé</h2>
            <p className="text-muted-foreground mb-6">
              Votre consultation est réservée et payée. À bientôt à la clinique.
            </p>
            <Button asChild>
              <Link to="/dashboard">Voir mon espace</Link>
            </Button>
          </Card>
        )}

        <TarifsGrid showCta={!isCheckout && !paymentDone} />
      </div>
    </div>
  );
}
