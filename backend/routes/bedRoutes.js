import express from 'express';
import * as bedController from '../controllers/bedController.js';

const router = express.Router();

// Routes lits
router.post('/create', bedController.createBed);
router.get('/', bedController.getAllBeds);
router.get('/available', bedController.getAvailableBeds);
router.get('/statistics', bedController.getBedStatistics);
router.get('/department/:department', bedController.getBedsByDepartment);
router.post('/assign', bedController.assignPatientToBed);
router.post('/:bedId/release', bedController.releaseBed);
router.post('/:bedId/maintenance', bedController.setBedMaintenance);

export default router;
