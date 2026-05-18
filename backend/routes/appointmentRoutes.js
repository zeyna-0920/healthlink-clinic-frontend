import express from 'express';
import * as appointmentController from '../controllers/appointmentController.js';

const router = express.Router();

// Routes rendez-vous
router.post('/create', appointmentController.createAppointment);
router.get('/', appointmentController.getAllAppointments);
router.get('/by-date', appointmentController.getAppointmentsByDate);
router.get('/patient/:patientId', appointmentController.getPatientAppointments);
router.put('/:appointmentId', appointmentController.updateAppointment);
router.post('/:appointmentId/confirm', appointmentController.confirmAppointment);
router.post('/:appointmentId/cancel', appointmentController.cancelAppointment);
router.post('/:appointmentId/complete', appointmentController.completeAppointment);
router.post('/send-reminders', appointmentController.sendAppointmentReminders);

export default router;
