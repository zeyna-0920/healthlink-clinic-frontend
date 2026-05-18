import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configuration du transporteur d'email
// Note: Pour un environnement de production, utilisez un service SMTP réel
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Envoie un email de notification à l'administrateur pour un nouveau rendez-vous
 * @param {Object} patient - Les informations du patient
 * @param {Object} appointment - Les informations du rendez-vous
 */
export const sendAdminAppointmentNotification = async (patient, appointment) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'dienebat782@gmail.com';

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const mailOptions = {
    from: `"HealthLink Clinic" <${process.env.EMAIL_USER || 'noreply@healthlink.sn'}>`,
    to: adminEmail,
    subject: `🚨 Nouveau Rendez-vous : ${patient.firstName} ${patient.lastName}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
        <div style="background: #0ea5e9; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Nouveau Rendez-vous</h1>
        </div>
        <div style="padding: 20px;">
          <p>Bonjour l'administrateur,</p>
          <p>Un nouveau rendez-vous vient d'être pris sur la plateforme. Voici les détails complets :</p>
          
          <h3 style="color: #0ea5e9; border-bottom: 2px solid #0ea5e9; padding-bottom: 5px;">Informations du Patient</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold; width: 150px;">Nom complet :</td><td>${patient.firstName} ${patient.lastName}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Date de naissance :</td><td>${new Date(patient.dateOfBirth).toLocaleDateString('fr-FR')}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Âge :</td><td>${calculateAge(patient.dateOfBirth)} ans</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Genre :</td><td>${patient.gender === 'M' ? 'Masculin' : patient.gender === 'F' ? 'Féminin' : 'Autre'}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Email :</td><td>${patient.email}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Téléphone :</td><td>${patient.phone}</td></tr>
          </table>

          <h3 style="color: #0ea5e9; border-bottom: 2px solid #0ea5e9; padding-bottom: 5px; margin-top: 20px;">Détails du Rendez-vous</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold; width: 150px;">Date :</td><td>${new Date(appointment.appointmentDate).toLocaleDateString('fr-FR')}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Heure :</td><td>${appointment.appointmentTime}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Département :</td><td>${appointment.department}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Raison :</td><td>${appointment.reason}</td></tr>
          </table>

          <div style="margin-top: 30px; text-align: center;">
            <a href="http://localhost:3000/admin" style="background: #0ea5e9; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Gérer sur le Dashboard</a>
          </div>
        </div>
        <div style="background: #f8fafc; color: #64748b; padding: 15px; text-align: center; font-size: 12px;">
          Ceci est une notification automatique de HealthLink Clinic.
        </div>
      </div>
    `,
  };

  try {
    console.log(`Tentative d'envoi d'email à : ${adminEmail}...`);
    await transporter.sendMail(mailOptions);
    console.log(`Email de notification envoyé avec succès à l'admin: ${adminEmail}`);
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email à l\'admin:', error);
    return { success: false, error: error.message };
  }
};
