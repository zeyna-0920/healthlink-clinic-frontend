import express from 'express';
import * as notificationController from '../controllers/notificationController.js';

const router = express.Router();

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
