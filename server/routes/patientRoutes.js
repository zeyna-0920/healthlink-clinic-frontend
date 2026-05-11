import express from 'express';
import * as patientController from '../controllers/patientController.js';

const router = express.Router();

// Routes patients
router.post('/register', patientController.registerPatient);
router.get('/', patientController.getAllPatients);
router.get('/search', patientController.searchPatientByEmail);
router.get('/:patientId', patientController.getPatient);
router.put('/:patientId', patientController.updatePatient);
router.delete('/:patientId', patientController.deletePatient);

export default router;
