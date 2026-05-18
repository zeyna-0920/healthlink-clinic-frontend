// Exemples d'utilisation de l'API HealthLink Clinic

const API_URL = 'http://localhost:5000/api';

// ============ PATIENTS ============

// 1. Enregistrer un nouveau patient
export const registerNewPatient = async () => {
  const patientData = {
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@email.com',
    phone: '+221772345678',
    dateOfBirth: '1990-05-15',
    gender: 'M',
    address: {
      street: '123 Rue de la Paix',
      city: 'Dakar',
      postalCode: '18000',
      country: 'Senegal',
    },
    bloodType: 'O+',
    medicalHistory: ['Diabète contrôlé'],
    allergies: ['Pénicilline'],
    emergencyContact: {
      name: 'Marie Dupont',
      phone: '+221771234567',
      relationship: 'Épouse',
    },
  };

  try {
    const response = await fetch(`${API_URL}/patients/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientData),
    });
    const data = await response.json();
    console.log('Patient enregistré:', data);
    return data.patient._id;
  } catch (error) {
    console.error('Erreur:', error);
  }
};

// 2. Obtenir les informations d'un patient
export const getPatientInfo = async (patientId) => {
  try {
    const response = await fetch(`${API_URL}/patients/${patientId}`);
    const data = await response.json();
    console.log('Informations du patient:', data.patient);
    return data.patient;
  } catch (error) {
    console.error('Erreur:', error);
  }
};

// ============ LITS ============

// 3. Obtenir les lits disponibles
export const getAvailableBeds = async () => {
  try {
    const response = await fetch(`${API_URL}/beds/available`);
    const data = await response.json();
    console.log('Lits disponibles:', data);
    return data.beds;
  } catch (error) {
    console.error('Erreur:', error);
  }
};

// 4. Obtenir les statistiques des lits
export const getBedStats = async () => {
  try {
    const response = await fetch(`${API_URL}/beds/statistics`);
    const data = await response.json();
    console.log('Statistiques des lits:', data.statistics);
    return data.statistics;
  } catch (error) {
    console.error('Erreur:', error);
  }
};

// 5. Assigner un patient à un lit
export const assignPatientToBed = async (bedId, patientId) => {
  try {
    const response = await fetch(`${API_URL}/beds/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bedId, patientId }),
    });
    const data = await response.json();
    console.log('Patient assigné au lit:', data);
    return data.bed;
  } catch (error) {
    console.error('Erreur:', error);
  }
};

// ============ RENDEZ-VOUS ============

// 6. Créer un rendez-vous
export const createAppointment = async (patientId) => {
  const appointmentData = {
    patientId,
    appointmentDate: '2024-05-20',
    appointmentTime: '14:00',
    department: 'Interne',
    doctorName: 'Dr. Martin Sall',
    reason: 'Suivi diabète',
  };

  try {
    const response = await fetch(`${API_URL}/appointments/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointmentData),
    });
    const data = await response.json();
    console.log('Rendez-vous créé:', data);
    return data.appointment._id;
  } catch (error) {
    console.error('Erreur:', error);
  }
};

// 7. Obtenir les rendez-vous d'un patient
export const getPatientAppointments = async (patientId) => {
  try {
    const response = await fetch(`${API_URL}/appointments/patient/${patientId}`);
    const data = await response.json();
    console.log('Rendez-vous du patient:', data);
    return data.appointments;
  } catch (error) {
    console.error('Erreur:', error);
  }
};

// 8. Confirmer un rendez-vous
export const confirmAppointment = async (appointmentId) => {
  try {
    const response = await fetch(`${API_URL}/appointments/${appointmentId}/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    console.log('Rendez-vous confirmé:', data);
    return data.appointment;
  } catch (error) {
    console.error('Erreur:', error);
  }
};

// ============ PAIEMENTS ============

// 9. Créer un paiement
export const createPayment = async (patientId, appointmentId) => {
  const paymentData = {
    patientId,
    appointmentId,
    amount: 15000, // 15 000 XOF
    paymentMethod: 'wave',
    phoneNumber: '+221772345678',
    description: 'Consultation Interne',
  };

  try {
    const response = await fetch(`${API_URL}/payments/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData),
    });
    const data = await response.json();
    console.log('Paiement créé:', data);
    return data.payment._id;
  } catch (error) {
    console.error('Erreur:', error);
  }
};

// 10. Initier un paiement Wave
export const initiateWavePayment = async (paymentId, phoneNumber) => {
  try {
    const response = await fetch(`${API_URL}/payments/wave/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId, phoneNumber }),
    });
    const data = await response.json();
    console.log('Paiement Wave initié:', data);
    return data.payment;
  } catch (error) {
    console.error('Erreur:', error);
  }
};

// 11. Confirmer un paiement
export const confirmPayment = async (paymentId, reference) => {
  try {
    const response = await fetch(`${API_URL}/payments/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId, reference }),
    });
    const data = await response.json();
    console.log('Paiement confirmé:', data);
    return data.payment;
  } catch (error) {
    console.error('Erreur:', error);
  }
};

// 12. Obtenir les statistiques des paiements
export const getPaymentStats = async () => {
  try {
    const response = await fetch(`${API_URL}/payments/statistics`);
    const data = await response.json();
    console.log('Statistiques des paiements:', data.statistics);
    return data.statistics;
  } catch (error) {
    console.error('Erreur:', error);
  }
};

// ============ NOTIFICATIONS ============

// 13. Obtenir les notifications d'un patient
export const getPatientNotifications = async (patientId) => {
  try {
    const response = await fetch(`${API_URL}/notifications/patient/${patientId}`);
    const data = await response.json();
    console.log('Notifications du patient:', data);
    return data.notifications;
  } catch (error) {
    console.error('Erreur:', error);
  }
};

// 14. Obtenir les notifications non lues
export const getUnreadNotifications = async (patientId) => {
  try {
    const response = await fetch(`${API_URL}/notifications/patient/${patientId}/unread`);
    const data = await response.json();
    console.log('Notifications non lues:', data);
    return data.notifications;
  } catch (error) {
    console.error('Erreur:', error);
  }
};

// 15. Marquer une notification comme lue
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    console.log('Notification marquée comme lue:', data);
    return data.notification;
  } catch (error) {
    console.error('Erreur:', error);
  }
};

// ============ WORKFLOW COMPLET ============

export const completeWorkflow = async () => {
  console.log('=== Démarrage du workflow complet ===');

  // 1. Enregistrer un patient
  const patientId = await registerNewPatient();
  console.log('ID du patient:', patientId);

  // 2. Obtenir les lits disponibles
  const availableBeds = await getAvailableBeds();
  console.log('Lits disponibles:', availableBeds);

  // 3. Assigner un lit au patient
  if (availableBeds && availableBeds.length > 0) {
    await assignPatientToBed(availableBeds[0]._id, patientId);
  }

  // 4. Créer un rendez-vous
  const appointmentId = await createAppointment(patientId);

  // 5. Confirmer le rendez-vous
  await confirmAppointment(appointmentId);

  // 6. Créer un paiement
  const paymentId = await createPayment(patientId, appointmentId);

  // 7. Initier le paiement Wave
  await initiateWavePayment(paymentId, '+221772345678');

  // 8. Confirmer le paiement (après réponse du patient)
  // await confirmPayment(paymentId, 'WAVE_REFERENCE_123');

  // 9. Obtenir les notifications
  const notifications = await getPatientNotifications(patientId);
  console.log('Nombre de notifications:', notifications.length);

  console.log('=== Workflow complet terminé ===');
};

// Exécuter le workflow
// completeWorkflow().catch(console.error);
