import express from 'express';
import passport from 'passport';
import * as patientController from '../controllers/patientController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes authentification (publiques)
router.post('/register', patientController.registerPatient);
router.post('/login', patientController.loginPatient);
router.post('/forgot-password', patientController.forgotPassword);
router.put('/reset-password/:token', patientController.resetPassword);

// Social Login
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { session: false }), patientController.socialLoginSuccess);

router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/auth/github/callback', passport.authenticate('github', { session: false }), patientController.socialLoginSuccess);

// Routes protégées (patient lui-même ou admin)
router.put('/set-password/:patientId', patientController.setPassword);
router.get('/:patientId', protect, patientController.getPatient);
router.put('/:patientId', protect, patientController.updatePatient);

// Routes réservées à l'admin
router.get('/', protect, admin, patientController.getAllPatients);
router.get('/search', protect, admin, patientController.searchPatientByEmail);
router.delete('/:patientId', protect, admin, patientController.deletePatient);

export default router;
