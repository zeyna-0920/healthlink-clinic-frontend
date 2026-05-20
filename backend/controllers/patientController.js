import Patient from '../models/Patient.js';
import Notification from '../models/Notification.js';
import jwt from 'jsonwebtoken';

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

    // Vérifier si le patient existe déjà
    const normalizedEmail = email.toLowerCase().trim();
    const existingPatient = await Patient.findOne({ email: normalizedEmail });
    if (existingPatient) {
      return res.status(400).json({ success: false, message: 'Ce patient est déjà enregistré' });
    }

    // Vérifier que le mot de passe est fourni
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

    // Créer une notification de bienvenue
    await Notification.create({
      patientId: patient._id,
      type: 'registration_complete',
      title: 'Inscription réussie',
      message: 'Bienvenue! Votre inscription est complète.',
      channel: 'email',
    });

    res.status(201).json({
      success: true,
      message: 'Patient enregistré avec succès',
      token: generateToken(patient._id),
      patient: patient.toJSON(),
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Définir un mot de passe pour un patient existant
export const setPassword = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Le mot de passe doit contenir au moins 6 caractères' });
    }

    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient non trouvé' });
    }

    // Mettre à jour le mot de passe
    patient.password = password;
    await patient.save();

    res.status(200).json({
      success: true,
      message: 'Mot de passe défini avec succès',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Connexion d'un patient
export const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier que les données sont fournies
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email et mot de passe requis' });
    }

    // Normaliser l'email
    const normalizedEmail = email.toLowerCase().trim();

    // Chercher le patient par email
    const patient = await Patient.findOne({ email: normalizedEmail }).select('+password');

    if (!patient) {
      console.log(`Tentative de connexion échouée: patient non trouvé pour l'email ${normalizedEmail}`);
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
    }

    // Vérifier si le patient a un mot de passe défini
    if (!patient.password) {
      console.log(`Patient trouvé (${normalizedEmail}) mais n'a pas de mot de passe défini.`);
      // Patient existant sans mot de passe - connexion temporaire
      const token = generateToken(patient._id);

      return res.status(200).json({
        success: true,
        message: 'Connexion réussie. Veuillez définir un mot de passe.',
        token,
        patient: patient.toJSON(),
        requiresPasswordSetup: true,
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await patient.comparePassword(password);

    if (!isPasswordValid) {
      console.log(`Mot de passe invalide pour le patient ${normalizedEmail}`);
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
    }

    // Créer un token JWT
    const token = generateToken(patient._id);

    res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      token,
      patient: patient.toJSON(),
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Récupérer un patient par ID
export const getPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }

    res.status(200).json({
      success: true,
      patient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Récupérer tous les patients
export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find({ status: { $nin: ['archived'] } });
    res.status(200).json({
      success: true,
      count: patients.length,
      patients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Mettre à jour les informations d'un patient
export const updatePatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const updateData = req.body;

    const patient = await Patient.findByIdAndUpdate(
      patientId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }

    res.status(200).json({
      success: true,
      message: 'Patient mis à jour',
      patient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Supprimer un patient (archive)
export const deletePatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const patient = await Patient.findByIdAndUpdate(
      patientId,
      { status: 'archived' },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }

    res.status(200).json({
      success: true,
      message: 'Patient archivé',
      patient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Rechercher un patient par email
export const searchPatientByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    const patient = await Patient.findOne({ email });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient non trouvé',
      });
    }

    res.status(200).json({
      success: true,
      patient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
