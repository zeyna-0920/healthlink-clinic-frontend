import express from 'express';
import * as appointmentController from '../controllers/appointmentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes rendez-vous
router.post('/create', protect, appointmentController.createAppointment);
router.get('/patient/:patientId', protect, appointmentController.getPatientAppointments);

// Routes réservées à l'admin
router.get('/', protect, admin, appointmentController.getAllAppointments);
router.get('/by-date', protect, admin, appointmentController.getAppointmentsByDate);
router.put('/:appointmentId', protect, admin, appointmentController.updateAppointment);
router.post('/:appointmentId/confirm', protect, admin, appointmentController.confirmAppointment);
router.post('/:appointmentId/cancel', protect, admin, appointmentController.cancelAppointment);
router.post('/:appointmentId/complete', protect, admin, appointmentController.completeAppointment);
router.post('/send-reminders', protect, admin, appointmentController.sendAppointmentReminders);

export default router;
