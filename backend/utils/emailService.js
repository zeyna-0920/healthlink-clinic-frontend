import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger le .env depuis le dossier backend (plus robuste)
dotenv.config({ path: path.join(__dirname, '..', '.env') });

console.log('--- Initialisation du service Email ---');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '********' : 'NON DÉFINI');
console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);

// Configuration du transporteur d'email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Vérifier la connexion au démarrage
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Erreur de configuration Nodemailer:', error);
  } else {
    console.log('✅ Serveur d\'email prêt à envoyer des messages');
  }
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
    console.log(`--- Préparation envoi email Admin ---`);
    console.log(`De: ${mailOptions.from}`);
    console.log(`À: ${mailOptions.to}`);
    console.log(`Sujet: ${mailOptions.subject}`);
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email Admin envoyé: ${info.messageId}`);
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email à l\'admin:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Envoie un email de réception de demande de rendez-vous au patient
 * @param {Object} patient - Les informations du patient
 * @param {Object} appointment - Les informations du rendez-vous
 */
export const sendPatientAppointmentReceived = async (patient, appointment) => {
  const mailOptions = {
    from: `"HealthLink Clinic" <${process.env.EMAIL_USER || 'noreply@healthlink.sn'}>`,
    to: patient.email,
    subject: `📩 Demande de rendez-vous reçue - HealthLink Clinic`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
        <div style="background: #0ea5e9; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Demande Reçue</h1>
        </div>
        <div style="padding: 20px;">
          <p>Bonjour ${patient.firstName} ${patient.lastName},</p>
          <p>Nous avons bien reçu votre demande de rendez-vous. Un administrateur va l'examiner et vous recevrez un email de confirmation très prochainement.</p>
          
          <h3 style="color: #0ea5e9; border-bottom: 2px solid #0ea5e9; padding-bottom: 5px; margin-top: 20px;">Détails de votre demande</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold; width: 150px;">Date :</td><td>${new Date(appointment.appointmentDate).toLocaleDateString('fr-FR')}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Heure :</td><td>${appointment.appointmentTime}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Département :</td><td>${appointment.department}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Raison :</td><td>${appointment.reason}</td></tr>
          </table>

          <p style="margin-top: 30px;">Merci de votre confiance.</p>
        </div>
        <div style="background: #f8fafc; color: #64748b; padding: 15px; text-align: center; font-size: 12px;">
          © 2026 HealthLink Clinic - Moulaye Dabakh. Tous droits réservés.
        </div>
      </div>
    `,
  };

  try {
    console.log(`--- Préparation envoi email Réception Patient ---`);
    console.log(`De: ${mailOptions.from}`);
    console.log(`À: ${mailOptions.to}`);
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email Réception Patient envoyé: ${info.messageId}`);
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de réception au patient:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Envoie un email de bienvenue au patient lors de son inscription
 * @param {Object} patient - Les informations du patient
 */
export const sendWelcomeEmail = async (patient) => {
  const mailOptions = {
    from: `"HealthLink Clinic" <${process.env.EMAIL_USER || 'noreply@healthlink.sn'}>`,
    to: patient.email,
    subject: `👋 Bienvenue chez HealthLink Clinic, ${patient.firstName} !`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
        <div style="background: #0ea5e9; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Bienvenue !</h1>
        </div>
        <div style="padding: 20px;">
          <p>Bonjour ${patient.firstName} ${patient.lastName},</p>
          <p>Nous sommes ravis de vous compter parmi nos patients. Votre compte a été créé avec succès sur la plateforme HealthLink Clinic.</p>
          
          <p>Grâce à votre compte, vous pouvez désormais :</p>
          <ul>
            <li>Prendre rendez-vous en ligne</li>
            <li>Consulter votre historique médical</li>
            <li>Recevoir vos ordonnances et résultats</li>
            <li>Suivre vos paiements</li>
          </ul>

          <div style="margin-top: 30px; text-align: center;">
            <a href="http://localhost:3000/login" style="background: #0ea5e9; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Accéder à mon espace</a>
          </div>

          <p style="margin-top: 30px;">À très bientôt,<br>L'équipe HealthLink Clinic</p>
        </div>
        <div style="background: #f8fafc; color: #64748b; padding: 15px; text-align: center; font-size: 12px;">
          © 2026 HealthLink Clinic - Moulaye Dabakh. Tous droits réservés.
        </div>
      </div>
    `,
  };

  try {
    console.log(`Tentative d'envoi d'email de bienvenue à : ${patient.email}...`);
    await transporter.sendMail(mailOptions);
    console.log(`Email de bienvenue envoyé avec succès à : ${patient.email}`);
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de bienvenue:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Envoie un email de confirmation au patient
 * @param {Object} patient - Les informations du patient
 * @param {Object} appointment - Les informations du rendez-vous
 */
export const sendPatientAppointmentConfirmation = async (patient, appointment) => {
  const mailOptions = {
    from: `"HealthLink Clinic" <${process.env.EMAIL_USER || 'noreply@healthlink.sn'}>`,
    to: patient.email,
    subject: `✅ Confirmation de votre rendez-vous - HealthLink Clinic`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
        <div style="background: #10b981; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Rendez-vous Confirmé</h1>
        </div>
        <div style="padding: 20px;">
          <p>Bonjour ${patient.firstName} ${patient.lastName},</p>
          <p style="font-size: 16px; font-weight: bold; color: #10b981;">
            Votre rendez-vous est confirmé au sein de notre clinic Moulaye Dabakh.
          </p>
          <p>Voici le récapitulatif de vos informations :</p>
          
          <h3 style="color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 5px;">Vos Informations</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold; width: 150px;">Nom complet :</td><td>${patient.firstName} ${patient.lastName}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Email :</td><td>${patient.email}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Téléphone :</td><td>${patient.phone}</td></tr>
          </table>

          <h3 style="color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 5px; margin-top: 20px;">Détails du Rendez-vous</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold; width: 150px;">Date :</td><td>${new Date(appointment.appointmentDate).toLocaleDateString('fr-FR')}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Heure :</td><td>${appointment.appointmentTime}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Département :</td><td>${appointment.department}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Raison :</td><td>${appointment.reason}</td></tr>
          </table>

          <p style="margin-top: 30px;">Nous nous réjouissons de vous accueillir. En cas d'empêchement, merci de nous prévenir au moins 24h à l'avance.</p>
        </div>
        <div style="background: #f8fafc; color: #64748b; padding: 15px; text-align: center; font-size: 12px;">
          © 2026 HealthLink Clinic - Moulaye Dabakh. Tous droits réservés.
        </div>
      </div>
    `,
  };

  try {
    console.log(`Tentative d'envoi d'email de confirmation à : ${patient.email}...`);
    await transporter.sendMail(mailOptions);
    console.log(`Email de confirmation envoyé avec succès au patient: ${patient.email}`);
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email au patient:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Envoie un email de refus au patient
 * @param {Object} patient - Les informations du patient
 * @param {Object} appointment - Les informations du rendez-vous
 */
export const sendPatientAppointmentRejection = async (patient, appointment) => {
  const mailOptions = {
    from: `"HealthLink Clinic" <${process.env.EMAIL_USER || 'noreply@healthlink.sn'}>`,
    to: patient.email,
    subject: `❌ Information concernant votre rendez-vous - HealthLink Clinic`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
        <div style="background: #ef4444; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Mise à jour du Rendez-vous</h1>
        </div>
        <div style="padding: 20px;">
          <p>Bonjour ${patient.firstName} ${patient.lastName},</p>
          <p>Nous vous informons que votre rendez-vous prévu pour le ${new Date(appointment.appointmentDate).toLocaleDateString('fr-FR')} à ${appointment.appointmentTime} n'a pas pu être confirmé.</p>
          <p>Nous vous invitons à nous contacter par téléphone au +221 XX XXX XX XX ou à reprendre rendez-vous via notre plateforme pour une autre date.</p>
          <p>Merci de votre compréhension.</p>
        </div>
        <div style="background: #f8fafc; color: #64748b; padding: 15px; text-align: center; font-size: 12px;">
          © 2026 HealthLink Clinic - Moulaye Dabakh. Tous droits réservés.
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de refus:', error);
    return { success: false, error: error.message };
  }
};
