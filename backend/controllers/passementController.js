import Passement from '../models/Passement.js';
import Patient from '../models/Patient.js';

export const createPassement = async (req, res) => {
  try {
    const { patientData, passementData } = req.body;
    let patientId = passementData.patientId;

    // If no patientId is provided, we might need to create a new patient
    if (!patientId && patientData) {
      // Check if patient already exists by email or phone
      let patient = await Patient.findOne({
        $or: [{ email: patientData.email }, { phone: patientData.phone }]
      });

      if (!patient) {
        // Create new patient
        // Generate a random password since it's required by the model
        const randomPassword = Math.random().toString(36).slice(-10);
        patient = new Patient({
          ...patientData,
          password: randomPassword,
          isRegistered: true,
          registrationDate: new Date()
        });
        await patient.save();
      }
      patientId = patient._id;
    }

    if (!patientId) {
      return res.status(400).json({ message: "Patient ID or Patient Data is required" });
    }

    const passement = new Passement({
      ...passementData,
      patientId
    });

    await passement.save();
    res.status(201).json(passement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getPassements = async (req, res) => {
  try {
    const passements = await Passement.find().populate('patientId');
    res.status(200).json(passements);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePassementStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const passement = await Passement.findByIdAndUpdate(id, { status }, { new: true });
    res.status(200).json(passement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePassement = async (req, res) => {
  try {
    await Passement.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Passement supprimé" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
