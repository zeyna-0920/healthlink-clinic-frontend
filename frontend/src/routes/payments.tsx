import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CreditCard, DollarSign, CircleDollarSign, Clock, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPayments, type Payment } from "./api/-clinic";

export const Route = createFileRoute("/payments")({
  head: () => ({
    meta: [
      { title: "Paiements — Clinique Moulaye Dabakh" },
      { name: "description", content: "Historique des paiements et statuts de transaction." },
    ],
  }),
  component: PaymentsPage,
});

function formatCurrency(amount: number, currency = "XOF") {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

function PaymentsPage() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Vérification de l'accès administrateur
    const adminAuth = localStorage.getItem("adminAuthenticated");
    if (adminAuth !== "true") {
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    setIsAdmin(true);

    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPayments();
        if (!cancelled) {
          setPayments(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Impossible de charger les paiements.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const summary = useMemo(
    () => ({
      total: payments.length,
      completed: payments.filter((p) => p.status === "completed").length,
      pending: payments.filter((p) => p.status === "pending").length,
      failed: payments.filter((p) => p.status === "failed").length,
      amount: payments.reduce((sum, payment) => sum + (payment.amount || 0), 0),
    }),
    [payments],
  );

  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-border/40 max-w-md w-full">
          <div className="h-20 w-20 bg-destructive/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Lock className="h-10 w-10 text-destructive" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Accès Réservé</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Désolé, seul l'administrateur de la clinique peut consulter les rapports financiers et
            paiements.
          </p>
          <div className="space-y-3">
            <Button className="w-full rounded-2xl h-12 text-lg font-semibold" asChild>
              <Link to="/admin">Se connecter en tant qu'admin</Link>
            </Button>
            <Button variant="ghost" className="w-full rounded-2xl h-12 text-slate-500" asChild>
              <Link to="/">Retour à l'accueil</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-10">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-medical font-semibold mb-3">
              Gestion des paiements
            </p>
            <h1 className="text-4xl font-bold">Paiements</h1>
            <p className="mt-3 text-muted-foreground max-w-2xl">
              Contrôlez les transactions, suivez les paiements réussis et identifiez les échecs.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 text-sm text-muted-foreground">
            <div className="rounded-2xl bg-muted p-4">
              <p className="text-xs uppercase tracking-[0.2em] font-semibold">Total</p>
              <p className="mt-2 text-2xl font-semibold">{summary.total}</p>
            </div>
            <div className="rounded-2xl bg-muted p-4">
              <p className="text-xs uppercase tracking-[0.2em] font-semibold">Montant</p>
              <p className="mt-2 text-2xl font-semibold">{formatCurrency(summary.amount)}</p>
            </div>
            <div className="rounded-2xl bg-muted p-4">
              <p className="text-xs uppercase tracking-[0.2em] font-semibold">Complet</p>
              <p className="mt-2 text-2xl font-semibold">{summary.completed}</p>
            </div>
          </div>
        </div>

        {loading ? (
          <Card className="p-10 text-center text-muted-foreground">Chargement des paiements…</Card>
        ) : error ? (
          <Card className="p-10 text-center text-destructive">{error}</Card>
        ) : payments.length === 0 ? (
          <Card className="p-10 text-center text-muted-foreground">Aucun paiement enregistré.</Card>
        ) : (
          <div className="grid gap-4">
            {payments.map((payment) => (
              <Card key={payment._id} className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-lg font-semibold">
                      <DollarSign className="h-5 w-5 text-primary" />
                      {formatCurrency(payment.amount, payment.currency)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {payment.paymentMethod || "Méthode inconnue"}
                    </p>
                  </div>
                  <Badge
                    variant={
                      payment.status === "completed"
                        ? "default"
                        : payment.status === "pending"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {payment.status}
                  </Badge>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3 text-sm text-muted-foreground">
                  <div className="rounded-lg bg-muted p-3">
                    <p className="font-medium">Référence</p>
                    <p>{payment.transactionId || "—"}</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="font-medium">Payé le</p>
                    <p>
                      {payment.paymentDate
                        ? new Date(payment.paymentDate).toLocaleDateString("fr-FR")
                        : "—"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="font-medium">Description</p>
                    <p>{payment.description || "Aucune"}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
