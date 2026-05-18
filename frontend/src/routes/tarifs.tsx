import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TarifsCheckoutView } from "@/components/TarifsCheckoutView";
import {
  clearPendingCheckout,
  getPendingCheckout,
  getStoredPatient,
  type PendingCheckout,
} from "@/lib/patient-session";
import {
  confirmPayment,
  createPayment,
  initiateOrangeMoneyPayment,
  initiateWavePayment,
} from "./api/-clinic";

type TarifsSearch = {
  checkout?: string;
  appointmentId?: string;
};

export const Route = createFileRoute("/tarifs")({
  validateSearch: (search: Record<string, unknown>): TarifsSearch => ({
    checkout: typeof search.checkout === "string" ? search.checkout : undefined,
    appointmentId: typeof search.appointmentId === "string" ? search.appointmentId : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Tarifs & Paiement — Clinique Moulaye Dabakh" },
      {
        name: "description",
        content: "Tarifs consultation jour et nuit. Paiement Wave et Orange Money.",
      },
    ],
  }),
  component: TarifsPage,
});

function TarifsPage() {
  const { checkout, appointmentId } = Route.useSearch();
  const [pending, setPending] = useState<PendingCheckout | null>(null);
  const [phone, setPhone] = useState("");
  const [paying, setPaying] = useState<"wave" | "orange_money" | null>(null);
  const [paymentDone, setPaymentDone] = useState(false);

  useEffect(() => {
    const data = getPendingCheckout();
    if (data && (!appointmentId || data.appointmentId === appointmentId)) {
      setPending(data);
      setPhone(data.phone);
    } else if (checkout === "1" && !data) {
      toast.info("Session de paiement expirée. Reprenez un rendez-vous.");
    }
  }, [checkout, appointmentId]);

  const isCheckout = Boolean(pending);

  const handlePay = async (method: "wave" | "orange_money") => {
    if (!pending) {
      toast.error("Aucun rendez-vous en attente de paiement.");
      return;
    }
    const patient = getStoredPatient();
    if (!patient?._id) {
      toast.error("Connectez-vous pour payer.");
      return;
    }
    if (!phone.trim()) {
      toast.error("Indiquez votre numéro de téléphone mobile.");
      return;
    }

    setPaying(method);
    try {
      const created = await createPayment({
        patientId: patient._id,
        appointmentId: pending.appointmentId,
        amount: pending.amount,
        paymentMethod: method,
        phoneNumber: phone.trim(),
        description: `Consultation ${pending.consultationLabel} — ${pending.appointmentDate} ${pending.appointmentTime}`,
      });

      if (!created.success || !created.payment?._id) {
        toast.error(created.message || "Impossible de créer le paiement.");
        return;
      }

      const initiate =
        method === "wave"
          ? await initiateWavePayment({
              paymentId: created.payment._id,
              phoneNumber: phone.trim(),
              amount: pending.amount,
            })
          : await initiateOrangeMoneyPayment({
              paymentId: created.payment._id,
              phoneNumber: phone.trim(),
              amount: pending.amount,
            });

      if (!initiate.success) {
        toast.error(initiate.message || "Échec de l'initiation du paiement.");
        return;
      }

      toast.success(
        initiate.nextStep ||
          (method === "wave"
            ? "Confirmez le paiement sur votre application Wave."
            : "Confirmez le paiement sur Orange Money."),
      );

      const confirmed = await confirmPayment(created.payment._id);
      if (confirmed) {
        setPaymentDone(true);
        clearPendingCheckout();
        toast.success("Paiement enregistré. Merci !");
      }
    } catch {
      toast.error("Erreur réseau. Vérifiez que le serveur est démarré.");
    } finally {
      setPaying(null);
    }
  };

  return (
    <TarifsCheckoutView
      pending={pending}
      isCheckout={isCheckout}
      paymentDone={paymentDone}
      phone={phone}
      setPhone={setPhone}
      paying={paying}
      onPay={handlePay}
    />
  );
}
