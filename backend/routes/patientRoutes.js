import express from 'express';
import * as patientController from '../controllers/patientController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes authentification (publiques)
router.post('/register', patientController.registerPatient);
router.post('/login', patientController.loginPatient);

// Routes protégées (patient lui-même ou admin)
router.put('/set-password/:patientId', patientController.setPassword);
router.get('/:patientId', protect, patientController.getPatient);
router.put('/:patientId', protect, patientController.updatePatient);

// Routes réservées à l'admin
router.get('/', protect, admin, patientController.getAllPatients);
router.get('/search', protect, admin, patientController.searchPatientByEmail);
router.delete('/:patientId', protect, admin, patientController.deletePatient);

export default router;
