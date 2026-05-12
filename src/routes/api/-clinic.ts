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

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function safeFetch<T>(url: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(async (res) => {
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data?.patients) ? data.patients : [];
    })
    .catch(() => []);
}

export function getPatient(id: string): Promise<Patient | null> {
  return fetch(`${API_BASE_URL}/api/patients/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(async (res) => {
      if (!res.ok) return null;
      const data = await res.json();
      return data?.patient ?? null;
    })
    .catch(() => null);
}

export function createPatient(patient: Omit<Patient, '_id'>): Promise<Patient> {
  return fetch(`${API_BASE_URL}/api/patients/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patient),
  })
    .then((res) => res.json())
    .then((data) => data.patient);
}

export function updatePatient(id: string, patient: Partial<Patient>): Promise<Patient> {
  return fetch(`${API_BASE_URL}/api/patients/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patient),
  })
    .then((res) => res.json())
    .then((data) => data.patient);
}

export function deletePatient(id: string): Promise<void> {
  return fetch(`${API_BASE_URL}/api/patients/${id}`, {
    method: 'DELETE',
  }).then(() => undefined);
}

export function getBeds(): Promise<Bed[]> {
  return fetch(`${API_BASE_URL}/api/beds`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(async (res) => {
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data?.beds) ? data.beds : [];
    })
    .catch(() => []);
}

export function getBedStatistics(): Promise<{ total: number; occupied: number; available: number; maintenance: number }> {
  return fetch(`${API_BASE_URL}/api/beds/statistics`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(async (res) => {
      if (!res.ok) return { total: 0, occupied: 0, available: 0, maintenance: 0 };
      const data = await res.json();
      const stats = data?.statistics ?? {};
      return {
        total: stats.totalBeds ?? 0,
        occupied: stats.occupiedBeds ?? 0,
        available: stats.availableBeds ?? 0,
        maintenance: stats.maintenanceBeds ?? 0,
      };
    })
    .catch(() => ({ total: 0, occupied: 0, available: 0, maintenance: 0 }));
}

export function getPayments(): Promise<Payment[]> {
  return fetch(`${API_BASE_URL}/api/payments`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(async (res) => {
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data?.payments) ? data.payments : [];
    })
    .catch(() => []);
}

export function getNotifications(): Promise<Notification[]> {
  return fetch(`${API_BASE_URL}/api/notifications`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(async (res) => {
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data?.notifications) ? data.notifications : [];
    })
    .catch(() => []);
}
