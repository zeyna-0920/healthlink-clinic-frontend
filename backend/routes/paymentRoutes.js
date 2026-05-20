import express from 'express';
import * as paymentController from '../controllers/paymentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes paiements
router.post('/create', protect, paymentController.createPayment);
router.post('/wave/initiate', protect, paymentController.initiateWavePayment);
router.post('/orange-money/initiate', protect, paymentController.initiateOrangeMoneyPayment);
router.post('/confirm', protect, paymentController.confirmPayment);
router.post('/fail', protect, paymentController.failPayment);
router.get('/patient/:patientId', protect, paymentController.getPatientPayments);

// Routes réservées à l'admin
router.get('/', protect, admin, paymentController.getAllPayments);
router.get('/statistics', protect, admin, paymentController.getPaymentStatistics);

export default router;
