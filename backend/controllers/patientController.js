import Patient from '../models/Patient.js';
import Notification from '../models/Notification.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendWelcomeEmail } from '../utils/emailService.js';

// Générer un token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'votre_secret_jwt_tres_long_et_sur', {
    expiresIn: '30d',
  });
};

// Inscription d'un nouveau patient
export const registerPatient = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      dateOfBirth,
      gender,
      address,
      bloodType,
      medicalHistory,
      allergies,
      emergencyContact,
    } = req.body;

    const normalizedEmail = email.toLowerCase().trim();
    const existingPatient = await Patient.findOne({ email: normalizedEmail });
    if (existingPatient) {
      return res.status(400).json({ success: false, message: 'Ce patient est déjà enregistré' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Le mot de passe est requis et doit contenir au moins 6 caractères' });
    }

    const patient = new Patient({
      firstName,
      lastName,
      email: normalizedEmail,
      phone,
      password,
      dateOfBirth,
      gender,
      address,
      bloodType,
      medicalHistory,
      allergies,
      emergencyContact,
      isRegistered: true,
      registrationDate: new Date(),
    });

    await patient.save();

    await Notification.create({
      patientId: patient._id,
      type: 'registration_complete',
      title: 'Inscription réussie',
      message: 'Bienvenue! Votre inscription est complète.',
      channel: 'email',
    });

    // Envoi de l'email de bienvenue
    const welcomeEmailResult = await sendWelcomeEmail(patient);
    if (!welcomeEmailResult.success) {
      console.error(`⚠️ Email de bienvenue non envoyé: ${welcomeEmailResult.error}`);
    }

    res.status(201).json({
      success: true,
      message: 'Patient enregistré avec succès',
      emailSent: welcomeEmailResult.success,
      token: generateToken(patient._id),
      patient: patient.toJSON(),
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Connexion d'un patient
export const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email et mot de passe requis' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const patient = await Patient.findOne({ email: normalizedEmail }).select('+password');

    if (!patient) {
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
    }

    if (!patient.password) {
      const token = generateToken(patient._id);
      return res.status(200).json({
        success: true,
        message: 'Connexion réussie. Veuillez définir un mot de passe.',
        token,
        patient: patient.toJSON(),
        requiresPasswordSetup: true,
      });
    }

    if (!patient.password.startsWith('$2a$') && !patient.password.startsWith('$2b$')) {
      console.error(`🚨 ALERTE SÉCURITÉ: Le mot de passe pour ${normalizedEmail} n'est PAS haché !`);
      return res.status(500).json({ success: false, message: 'Erreur interne de sécurité.' });
    }

    const isPasswordValid = await patient.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
    }

    const token = generateToken(patient._id);
    res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      token,
      patient: patient.toJSON(),
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mot de passe oublié
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const patient = await Patient.findOne({ email: email.toLowerCase().trim() });

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Aucun utilisateur avec cet email' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    patient.resetPasswordToken = resetToken;
    patient.resetPasswordExpires = Date.now() + 3600000; // 1 heure

    await patient.save();

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    console.log('Lien de réinitialisation:', resetUrl);

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const mailOptions = {
        to: patient.email,
        from: process.env.EMAIL_USER,
        subject: 'Réinitialisation de votre mot de passe - HealthLink Clinic',
        text: `Vous recevez cet email car vous avez demandé la réinitialisation du mot de passe de votre compte.\n\n` +
          `Veuillez cliquer sur le lien suivant :\n\n${resetUrl}\n\n` +
          `Si vous n'avez pas demandé cela, ignorez cet email.\n`,
      };
      await transporter.sendMail(mailOptions);
    }

    res.status(200).json({ success: true, message: 'Email envoyé' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur lors de l\'envoi' });
  }
};

// Réinitialiser le mot de passe
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const patient = await Patient.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!patient) {
      return res.status(400).json({ success: false, message: 'Lien invalide ou expiré' });
    }

    patient.password = password;
    patient.resetPasswordToken = undefined;
    patient.resetPasswordExpires = undefined;
    await patient.save();

    res.status(200).json({ success: true, message: 'Mot de passe mis à jour' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Social Login Success
export const socialLoginSuccess = async (req, res) => {
  if (req.user) {
    const token = generateToken(req.user._id);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth?token=${token}&patient=${encodeURIComponent(JSON.stringify(req.user))}`);
  } else {
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth?error=social_failed`);
  }
};

// CRUD et autres fonctions
export const getPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.patientId);
    if (!patient) return res.status(404).json({ message: 'Patient non trouvé' });
    res.status(200).json({ success: true, patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllPatients = async (req, res) => {
  try {
    console.log('--- Requête Admin: Récupération de tous les patients ---');
    const patients = await Patient.find({ status: { $nin: ['archived'] } });
    console.log(`✅ ${patients.length} patients trouvés`);
    res.status(200).json({ success: true, count: patients.length, patients });
  } catch (error) {
    console.error('❌ Erreur getAllPatients:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const updateData = req.body;
    if (updateData.password) delete updateData.password;
    const patient = await Patient.findByIdAndUpdate(patientId, updateData, { new: true, runValidators: true });
    if (!patient) return res.status(404).json({ message: 'Patient non trouvé' });
    res.status(200).json({ success: true, message: 'Patient mis à jour', patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.patientId, { status: 'archived' }, { new: true });
    if (!patient) return res.status(404).json({ message: 'Patient non trouvé' });
    res.status(200).json({ success: true, message: 'Patient archivé' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const searchPatientByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ success: false, message: 'Email requis' });
    const patient = await Patient.findOne({ email: email.toLowerCase().trim() });
    if (!patient) return res.status(404).json({ success: false, message: 'Aucun patient trouvé' });
    res.status(200).json({ success: true, patient });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const setPassword = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { password } = req.body;
    if (!password || password.length < 6) return res.status(400).json({ success: false, message: '6 caractères min' });
    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ success: false, message: 'Patient non trouvé' });
    patient.password = password;
    await patient.save();
    res.status(200).json({ success: true, message: 'Mot de passe défini' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
