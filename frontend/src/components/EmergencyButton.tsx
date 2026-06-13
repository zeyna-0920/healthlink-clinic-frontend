import { Link } from "@tanstack/react-router";
import { Phone } from "lucide-react";

export function EmergencyButton() {
  return (
    <Link
      to="/contact"
      className="fixed bottom-8 right-8 z-50 flex items-center gap-2 rounded-full bg-destructive px-5 py-3 text-destructive-foreground shadow-[0_8px_30px_-8px_oklch(0.6_0.22_27/0.5)] hover:scale-105 transition-transform"
    >
      <span className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive-foreground opacity-75" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-destructive-foreground" />
      </span>
      <Phone className="h-4 w-4" />
      <span className="text-sm font-semibold hidden sm:inline">Urgence</span>
    </Link>
  );
}
