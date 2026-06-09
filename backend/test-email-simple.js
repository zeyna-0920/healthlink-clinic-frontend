import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

console.log('--- Test de configuration Email ---');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '********' : 'NON DÉFINI');
console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const mailOptions = {
  from: `"HealthLink Test" <${process.env.EMAIL_USER}>`,
  to: process.env.ADMIN_EMAIL,
  subject: 'Test de connexion Nodemailer',
  text: 'Si vous recevez cet email, la configuration Nodemailer fonctionne correctement.',
  html: '<b>Si vous recevez cet email, la configuration Nodemailer fonctionne correctement.</b>',
};

console.log('\nTentative d\'envoi d\'un email de test...');

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('\n❌ ERREUR lors de l\'envoi:', error);
    if (error.code === 'EAUTH') {
      console.log('\nConseil: Vérifiez votre "App Password" Gmail. Si vous utilisez la validation en deux étapes, vous devez générer un mot de passe d\'application spécifique.');
    }
  } else {
    console.log('\n✅ SUCCÈS ! Email envoyé.');
    console.log('ID du message:', info.messageId);
    console.log('Réponse du serveur:', info.response);
  }
});
