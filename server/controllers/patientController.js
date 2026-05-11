import Patient from '../models/Patient.js';
import Notification from '../models/Notification.js';

// Inscription d'un nouveau patient
export const registerPatient = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      bloodType,
      medicalHistory,
      allergies,
      emergencyContact,
    } = req.body;

    // Vérifier si le patient existe déjà
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ message: 'Ce patient est déjà enregistré' });
    }

    const patient = new Patient({
      firstName,
      lastName,
      email,
      phone,
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
      patient,
    });
  } catch (error) {
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
    const patients = await Patient.find({ status: 'active' });
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
