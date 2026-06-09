import type { Patient } from "@/routes/api/-clinic";

const PATIENT_KEY = "patient";
const TOKEN_KEY = "authToken";

export function getStoredPatient(): Patient | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PATIENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Patient;
  } catch {
    return null;
  }
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function isPatientLoggedIn(): boolean {
  return Boolean(getStoredPatient()?._id);
}

export function clearPatientSession(): void {
  localStorage.removeItem(PATIENT_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

export const PENDING_CHECKOUT_KEY = "healthlink_pending_checkout";

export type PendingCheckout = {
  appointmentId: string;
  patientId: string;
  amount: number;
  period: "jour" | "nuit";
  ageGroup: "child" | "adult";
  appointmentDate: string;
  appointmentTime: string;
  consultationLabel: string;
  patientName: string;
  phone: string;
};

export function savePendingCheckout(data: PendingCheckout): void {
  localStorage.setItem(PENDING_CHECKOUT_KEY, JSON.stringify(data));
}

export function getPendingCheckout(): PendingCheckout | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PENDING_CHECKOUT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PendingCheckout;
  } catch {
    return null;
  }
}

export function clearPendingCheckout(): void {
  localStorage.removeItem(PENDING_CHECKOUT_KEY);
}
