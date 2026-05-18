import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';
import Notification from '../models/Notification.js';
import { sendAdminAppointmentNotification } from '../utils/emailService.js';

// Créer un rendez-vous
export const createAppointment = async (req, res) => {
  try {
    const {
      patientId,
      appointmentDate,
      appointmentTime,
      department,
      doctorName,
      reason,
    } = req.body;

    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient non trouvé' });
    }

    const appointment = new Appointment({
      patientId,
      appointmentDate,
      appointmentTime,
      department,
      doctorName,
      reason,
      status: 'scheduled',
    });

    await appointment.save();

    // Notification pour le patient
    await Notification.create({
      patientId,
      type: 'appointment_confirmed',
      title: 'Rendez-vous confirmé',
      message: `Votre rendez-vous est confirmé pour le ${appointmentDate} à ${appointmentTime}`,
      relatedId: appointment._id,
    });

    // Notification pour l'administrateur
    await Notification.create({
      patientId: null, // Notification globale admin
      type: 'admin_alert',
      title: 'Nouveau Rendez-vous',
      message: `Le patient ${patient.firstName} ${patient.lastName} a pris rendez-vous en ${department} pour le ${appointmentDate}.`,
      relatedId: appointment._id,
    });

    // Envoi de l'email à l'administrateur
    await sendAdminAppointmentNotification(patient, appointment);

    res.status(201).json({
      success: true,
      message: 'Rendez-vous créé',
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Récupérer les rendez-vous d'un patient
export const getPatientAppointments = async (req, res) => {
  try {
    const { patientId } = req.params;
    const appointments = await Appointment.find({ patientId })
      .populate('patientId', 'firstName lastName email phone')
      .sort({ appointmentDate: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Récupérer tous les rendez-vous
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patientId', 'firstName lastName email phone')
      .sort({ appointmentDate: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Mettre à jour un rendez-vous
export const updateAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const updateData = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }

    res.status(200).json({
      success: true,
      message: 'Rendez-vous mis à jour',
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Confirmer un rendez-vous
export const confirmAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: 'confirmed' },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }

    // Notification
    await Notification.create({
      patientId: appointment.patientId,
      type: 'appointment_confirmed',
      title: 'Rendez-vous confirmé',
      message: 'Votre rendez-vous a été confirmé',
      relatedId: appointmentId,
    });

    res.status(200).json({
      success: true,
      message: 'Rendez-vous confirmé',
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Annuler un rendez-vous
export const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: 'completed' },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }

    res.status(200).json({
      success: true,
      message: 'Rendez-vous complété',
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Envoyer des rappels pour les rendez-vous à venir (ex: dans les prochaines 24h)
export const sendAppointmentReminders = async (req, res) => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const upcomingAppointments = await Appointment.find({
      appointmentDate: tomorrowStr,
      status: 'scheduled',
    }).populate('patientId');

    const reminders = [];
    for (const apt of upcomingAppointments) {
      const reminder = await Notification.create({
        patientId: apt.patientId._id,
        type: 'appointment_reminder',
        title: 'Rappel de rendez-vous',
        message: `Bonjour ${apt.patientId.firstName}, n'oubliez pas votre rendez-vous demain à ${apt.appointmentTime} en ${apt.department}.`,
        relatedId: apt._id,
      });
      reminders.push(reminder);
    }

    res.status(200).json({
      success: true,
      message: `${reminders.length} rappels envoyés pour demain.`,
      count: reminders.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Compléter un rendez-vous
export const completeAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { notes } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: 'completed' },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }

    // Mettre à jour la date de dernière consultation du patient
    await Patient.findByIdAndUpdate(appointment.patientId, {
      lastConsultation: new Date(),
    });

    res.status(200).json({
      success: true,
      message: 'Rendez-vous complété',
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Récupérer les rendez-vous par date
export const getAppointmentsByDate = async (req, res) => {
  try {
    const { date } = req.query;
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    const appointments = await Appointment.find({
      appointmentDate: { $gte: startDate, $lt: endDate },
    })
      .populate('patientId', 'firstName lastName email phone')
      .sort({ appointmentTime: 1 });

    res.status(200).json({
      success: true,
      date,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
