import { getApiBaseUrl } from "@/lib/api-base";

export type Patient = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: string;
  status?: string;
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  bloodType?: string;
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
};

export type Bed = {
  _id: string;
  bedNumber: string;
  roomNumber: string;
  department: string;
  capacity: number;
  isOccupied: boolean;
  status: string;
  notes?: string;
};

export type Payment = {
  _id: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: string;
  paymentDate?: string;
  description?: string;
  phoneNumber?: string;
  transactionId?: string;
};

export type Notification = {
  _id: string;
  patientId: string;
  type: string;
  title?: string;
  message: string;
  isRead: boolean;
  channel: string;
  sentAt: string;
};

export type Appointment = {
  _id: string;
  patientId: string;
  appointmentDate: string;
  appointmentTime: string;
  department: string;
  doctorName?: string;
  reason: string;
  status: "scheduled" | "confirmed" | "completed" | "cancelled" | "no-show";
  notes?: string;
  bedId?: string;
  isPaid: boolean;
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
};

export type Passement = {
  _id: string;
  patientId: string | Patient;
  nurseName: string;
  date: string;
  time: string;
  careType: string;
  locationType: "at_home" | "at_clinic";
  location?: string;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

const API_BASE_URL = getApiBaseUrl();

// Récupérer les headers d'authentification
function getAuthHeaders() {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function safeFetch<T>(url: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      console.warn(`API fetch failed (${response.status})`, url);
      return fallback;
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.warn(`API fetch error`, error, url);
    return fallback;
  }
}

export function getPatients(): Promise<Patient[]> {
  return fetch(`${API_BASE_URL}/api/patients`, {
    method: "GET",
    headers: getAuthHeaders(),
  })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) {
        console.error(`API Error: ${res.status} ${res.statusText}`, data);
        return [];
      }
      console.log("Patients API Response:", data);
      // Sécurisation : extraire le tableau patients de la réponse
      if (data?.patients && Array.isArray(data.patients)) return data.patients;
      if (Array.isArray(data)) return data;
      return [];
    })
    .catch((err) => {
      console.error("Fetch error for patients:", err);
      return [];
    });
}

export function getPatient(id: string): Promise<Patient | null> {
  return fetch(`${API_BASE_URL}/api/patients/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  })
    .then(async (res) => {
      if (!res.ok) return null;
      const data = await res.json();
      return data?.patient ?? null;
    })
    .catch(() => null);
}

export function createPatient(patient: Omit<Patient, "_id">): Promise<Patient> {
  return fetch(`${API_BASE_URL}/api/patients/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patient),
  })
    .then((res) => res.json())
    .then((data) => data.patient);
}

export function updatePatient(id: string, patient: Partial<Patient>): Promise<Patient> {
  return fetch(`${API_BASE_URL}/api/patients/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(patient),
  })
    .then((res) => res.json())
    .then((data) => data.patient);
}

export function deletePatient(id: string): Promise<void> {
  return fetch(`${API_BASE_URL}/api/patients/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  }).then(() => undefined);
}

export function getBeds(): Promise<Bed[]> {
  return fetch(`${API_BASE_URL}/api/beds`, {
    method: "GET",
    headers: getAuthHeaders(),
  })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) return [];
      // Le backend renvoie { success: true, beds: [...] } ou l'array directement
      if (data?.beds && Array.isArray(data.beds)) return data.beds;
      if (Array.isArray(data)) return data;
      return [];
    })
    .catch(() => []);
}

export function getBedStatistics(): Promise<{
  total: number;
  occupied: number;
  available: number;
  maintenance: number;
}> {
  return fetch(`${API_BASE_URL}/api/beds/statistics`, {
    method: "GET",
    headers: getAuthHeaders(),
  })
    .then(async (res) => {
      if (!res.ok) return { total: 0, occupied: 0, available: 0, maintenance: 0 };
      const data = await res.json();
      const stats = data?.statistics || data || {};
      return {
        total: stats.totalBeds ?? stats.total ?? 0,
        occupied: stats.occupiedBeds ?? stats.occupied ?? 0,
        available: stats.availableBeds ?? stats.available ?? 0,
        maintenance: stats.maintenanceBeds ?? stats.maintenance ?? 0,
      };
    })
    .catch(() => ({ total: 0, occupied: 0, available: 0, maintenance: 0 }));
}

export function getPayments(): Promise<Payment[]> {
  return fetch(`${API_BASE_URL}/api/payments`, {
    method: "GET",
    headers: getAuthHeaders(),
  })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) return [];
      // Le backend renvoie { success: true, payments: [...] } ou l'array directement
      if (data?.payments && Array.isArray(data.payments)) return data.payments;
      if (Array.isArray(data)) return data;
      return [];
    })
    .catch(() => []);
}

export function getNotifications(): Promise<Notification[]> {
  return fetch(`${API_BASE_URL}/api/notifications`, {
    method: "GET",
    headers: getAuthHeaders(),
  })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) return [];
      // Le backend renvoie { success: true, notifications: [...] } ou l'array directement
      if (data?.notifications && Array.isArray(data.notifications)) return data.notifications;
      if (Array.isArray(data)) return data;
      return [];
    })
    .catch(() => []);
}

export function getAppointments(): Promise<Appointment[]> {
  return fetch(`${API_BASE_URL}/api/appointments`, {
    method: "GET",
    headers: getAuthHeaders(),
  })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) return [];
      // Le backend renvoie { success: true, appointments: [...] } ou l'array directement
      if (data?.appointments && Array.isArray(data.appointments)) return data.appointments;
      if (Array.isArray(data)) return data;
      return [];
    })
    .catch(() => []);
}

export function getPatientAppointments(patientId: string): Promise<Appointment[]> {
  return fetch(`${API_BASE_URL}/api/appointments/patient/${patientId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) return [];
      // Le backend renvoie { success: true, appointments: [...] } ou l'array directement
      if (data?.appointments && Array.isArray(data.appointments)) return data.appointments;
      if (Array.isArray(data)) return data;
      return [];
    })
    .catch(() => []);
}

export function getAppointmentsByDate(date: string): Promise<Appointment[]> {
  return fetch(`${API_BASE_URL}/api/appointments/by-date?date=${date}`, {
    method: "GET",
    headers: getAuthHeaders(),
  })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) return [];
      // Le backend renvoie { success: true, appointments: [...] } ou l'array directement
      if (data?.appointments && Array.isArray(data.appointments)) return data.appointments;
      if (Array.isArray(data)) return data;
      return [];
    })
    .catch(() => []);
}

export function updateAppointmentStatus(
  id: string,
  status: Appointment["status"],
): Promise<Appointment> {
  return fetch(`${API_BASE_URL}/api/appointments/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  })
    .then((res) => res.json())
    .then((data) => data.appointment);
}

export type CreateAppointmentInput = {
  patientId: string;
  appointmentDate: string;
  appointmentTime: string;
  department: string;
  reason: string;
  doctorName?: string;
};

export async function createAppointment(
  input: CreateAppointmentInput,
): Promise<{ success: boolean; appointment?: Appointment; message?: string }> {
  const res = await fetch(`${API_BASE_URL}/api/appointments/create`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(input),
  });
  const data = await res.json();
  if (!res.ok) {
    return { success: false, message: data.message || "Impossible de créer le rendez-vous" };
  }
  return { success: true, appointment: data.appointment };
}

export async function confirmAppointment(appointmentId: string): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/api/appointments/${appointmentId}/confirm`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  return Boolean(data.success);
}

export async function sendAppointmentReminders(): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE_URL}/api/appointments/send-reminders`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  return res.json();
}

// Passements API
export function getPassements(): Promise<Passement[]> {
  return fetch(`${API_BASE_URL}/api/passements`, {
    method: "GET",
    headers: getAuthHeaders(),
  })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) return [];
      // Le backend renvoie { success: true, data: [...] } ou l'array directement
      if (data?.data && Array.isArray(data.data)) return data.data;
      if (Array.isArray(data)) return data;
      return [];
    })
    .catch(() => []);
}

export function createPassement(data: {
  patientData?: Partial<Patient>;
  passementData: Partial<Passement>;
}): Promise<Passement> {
  return fetch(`${API_BASE_URL}/api/passements`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .catch((err) => {
      console.error("Error creating passement:", err);
      throw err;
    });
}

export function updatePassementStatus(
  id: string,
  status: Passement["status"],
): Promise<Passement> {
  return fetch(`${API_BASE_URL}/api/passements/${id}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  })
    .then((res) => res.json())
    .catch((err) => {
      console.error("Error updating passement status:", err);
      throw err;
    });
}

export type PaymentRecord = {
  _id: string;
  patientId: string;
  appointmentId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: string;
  transactionId?: string;
};

export async function createPayment(payload: {
  patientId: string;
  appointmentId: string;
  amount: number;
  paymentMethod: "wave" | "orange_money";
  phoneNumber: string;
  description?: string;
}): Promise<{ success: boolean; payment?: PaymentRecord; message?: string }> {
  const res = await fetch(`${API_BASE_URL}/api/payments/create`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    return { success: false, message: data.message || "Erreur lors de la création du paiement" };
  }
  return { success: true, payment: data.payment };
}

export async function initiateWavePayment(payload: {
  paymentId: string;
  phoneNumber: string;
  amount: number;
}): Promise<{ success: boolean; message?: string; nextStep?: string }> {
  const res = await fetch(`${API_BASE_URL}/api/payments/wave/initiate`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return {
    success: Boolean(data.success),
    message: data.message,
    nextStep: data.nextStep,
  };
}

export async function initiateOrangeMoneyPayment(payload: {
  paymentId: string;
  phoneNumber: string;
  amount: number;
}): Promise<{ success: boolean; message?: string; nextStep?: string }> {
  const res = await fetch(`${API_BASE_URL}/api/payments/orange-money/initiate`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return {
    success: Boolean(data.success),
    message: data.message,
    nextStep: data.nextStep,
  };
}

export async function confirmPayment(paymentId: string): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/api/payments/confirm`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ paymentId, reference: `REF_${Date.now()}` }),
  });
  const data = await res.json();
  return Boolean(data.success);
}
