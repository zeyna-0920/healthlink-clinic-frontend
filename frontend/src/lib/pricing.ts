/** Tarifs consultation (FCFA) — alignés sur la page tarifs */
export const TARIFFS = {
  jour: { child: 500, adult: 1000, label: "Journée", hours: "08h – 19h" },
  nuit: { child: 1000, adult: 2000, label: "Nuit", hours: "à partir de 20h" },
} as const;

export type TariffPeriod = keyof typeof TARIFFS;
export type PatientAgeGroup = "child" | "adult";

const CHILD_MAX_AGE = 17;

export function parseHour(time: string): number {
  const [h] = time.split(":").map(Number);
  return Number.isFinite(h) ? h : 0;
}

/** 08h–19h = jour ; 20h et plus = nuit */
export function getTariffPeriodFromTime(time: string): TariffPeriod {
  const hour = parseHour(time);
  return hour >= 20 ? "nuit" : "jour";
}

export function getAgeGroupFromBirthDate(dateOfBirth?: string): PatientAgeGroup {
  if (!dateOfBirth) return "adult";
  const birth = new Date(dateOfBirth);
  if (Number.isNaN(birth.getTime())) return "adult";
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age <= CHILD_MAX_AGE ? "child" : "adult";
}

export function getConsultationAmount(
  time: string,
  ageGroup: PatientAgeGroup,
): { period: TariffPeriod; amount: number; label: string } {
  const period = getTariffPeriodFromTime(time);
  const amount = TARIFFS[period][ageGroup];
  return {
    period,
    amount,
    label: `${TARIFFS[period].label} — ${amount.toLocaleString("fr-FR")} FCFA`,
  };
}

export const CONSULTATION_HOURS_DAY = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
] as const;

export const CONSULTATION_HOURS_NIGHT = ["20:00", "21:00", "22:00", "23:00"] as const;

export const ALL_CONSULTATION_HOURS = [
  ...CONSULTATION_HOURS_DAY,
  ...CONSULTATION_HOURS_NIGHT,
] as const;

export const CONSULTATION_TYPES = [
  { value: "generale", label: "Consultation générale", department: "Interne" },
  { value: "gynécologie", label: "Consultation Gynécologie", department: "Gynécologie" },
  { value: "pédiatrie", label: "Consultation Pédiatrie", department: "Pédiatrie" },
  { value: "maternité", label: "Maternité / Accouchement", department: "Maternité" },
  { value: "tele", label: "Téléconsultation", department: "Interne" },
  { value: "soins", label: "Soins infirmiers", department: "Interne" },
  { value: "hospitalisation", label: "Hospitalisation", department: "Interne" },
  { value: "urgence", label: "Urgence", department: "Urgence" },
] as const;

export function getDepartmentForType(type: string): string {
  return CONSULTATION_TYPES.find((t) => t.value === type)?.department ?? "Interne";
}
