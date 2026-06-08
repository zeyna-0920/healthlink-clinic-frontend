import express from 'express';
import * as notificationController from '../controllers/notificationController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { sendAdminAppointmentNotification } from '../utils/emailService.js';

const router = express.Router();

// Route de test d'email (Admin seulement)
router.post('/test-email', protect, admin, async (req, res) => {
  try {
    const { email } = req.body;
    const testPatient = { firstName: 'Test', lastName: 'User', email: email || 'test@example.com', phone: '000000000', dateOfBirth: new Date() };
    const testAppointment = { appointmentDate: new Date(), appointmentTime: '10:00', department: 'Test', reason: 'Test Email' };
    
    console.log(`--- Test d'email demandé pour ${email || 'admin'} ---`);
    const result = await sendAdminAppointmentNotification(testPatient, testAppointment);
    
    if (result.success) {
      res.status(200).json({ success: true, message: 'Email de test envoyé avec succès' });
    } else {
      res.status(500).json({ success: false, message: 'Échec de l\'envoi', error: result.error });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Routes notifications
router.get('/', notificationController.getAllNotifications);
router.post('/create', notificationController.createNotification);
router.get('/patient/:patientId', notificationController.getPatientNotifications);
router.get('/patient/:patientId/unread', notificationController.getUnreadNotifications);
router.get('/patient/:patientId/statistics', notificationController.getNotificationStatistics);
router.post('/:notificationId/read', notificationController.markNotificationAsRead);
router.post('/patient/:patientId/read-all', notificationController.markAllNotificationsAsRead);
router.delete('/:notificationId', notificationController.deleteNotification);

export default router;
