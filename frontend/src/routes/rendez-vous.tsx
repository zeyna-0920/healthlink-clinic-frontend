import { createFileRoute } from "@tanstack/react-router";
import { AppointmentBookingForm } from "@/components/AppointmentBookingForm";

export const Route = createFileRoute("/rendez-vous")({
  head: () => ({
    meta: [
      { title: "Prendre rendez-vous — Clinique Moulaye Dabakh" },
      { name: "description", content: "Réservez votre consultation en ligne en quelques clics." },
    ],
  }),
  component: () => (
    <div className="min-h-screen">
      <AppointmentBookingForm />
    </div>
  ),
});
