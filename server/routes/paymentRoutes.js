import express from 'express';
import * as paymentController from '../controllers/paymentController.js';

const router = express.Router();

// Routes paiements
router.post('/create', paymentController.createPayment);
router.post('/wave/initiate', paymentController.initiateWavePayment);
router.post('/orange-money/initiate', paymentController.initiateOrangeMoneyPayment);
router.post('/confirm', paymentController.confirmPayment);
router.post('/fail', paymentController.failPayment);
router.get('/', paymentController.getAllPayments);
router.get('/statistics', paymentController.getPaymentStatistics);
router.get('/patient/:patientId', paymentController.getPatientPayments);

export default router;
