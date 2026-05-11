// Utilitaire pour envoyer les notifications
export const sendNotificationByChannel = async (notification, channel) => {
  try {
    switch (channel) {
      case 'email':
        return await sendEmailNotification(notification);
      case 'sms':
        return await sendSMSNotification(notification);
      case 'whatsapp':
        return await sendWhatsAppNotification(notification);
      case 'in-app':
      default:
        return notification;
    }
  } catch (error) {
    console.error(`Erreur lors de l'envoi de la notification: ${error.message}`);
    throw error;
  }
};

// Exemple d'envoi par email (à intégrer avec nodemailer)
const sendEmailNotification = async (notification) => {
  console.log('Email notification:', notification);
  // À implémenter avec nodemailer
  return true;
};

// Exemple d'envoi par SMS (à intégrer avec une API SMS)
const sendSMSNotification = async (notification) => {
  console.log('SMS notification:', notification);
  // À implémenter avec une API SMS (Twilio, etc.)
  return true;
};

// Exemple d'envoi par WhatsApp (à intégrer avec une API WhatsApp)
const sendWhatsAppNotification = async (notification) => {
  console.log('WhatsApp notification:', notification);
  // À implémenter avec une API WhatsApp (Twilio, etc.)
  return true;
};

// Utilitaire pour calculer les frais de consultation
export const calculateConsultationFee = (department) => {
  const departmentFees = {
    Urgence: 25000,      // 25 000 XOF
    Interne: 15000,      // 15 000 XOF
    Chirurgie: 40000,    // 40 000 XOF
    Maternité: 35000,    // 35 000 XOF
    Pédiatrie: 12000,    // 12 000 XOF
    UCI: 50000,          // 50 000 XOF
  };

  return departmentFees[department] || 0;
};

// Utilitaire pour formater les messages
export const formatMessage = (type, data) => {
  const messages = {
    appointment_reminder: `Rappel: Vous avez un rendez-vous le ${data.date} à ${data.time}`,
    appointment_confirmed: `Votre rendez-vous a été confirmé pour le ${data.date}`,
    payment_reminder: `Un paiement de ${data.amount} XOF est dû pour votre consultation`,
    payment_successful: `Votre paiement de ${data.amount} XOF a été accepté`,
    payment_failed: `Votre paiement a échoué: ${data.reason}`,
    registration_complete: 'Bienvenue! Votre inscription est complète',
    bed_assigned: `Vous avez été assigné au lit ${data.bedNumber}`,
    bed_released: 'Votre lit a été libéré',
  };

  return messages[type] || '';
};
