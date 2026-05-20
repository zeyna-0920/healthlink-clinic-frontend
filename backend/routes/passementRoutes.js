import express from 'express';
import { 
  createPassement, 
  getPassements, 
  updatePassementStatus, 
  deletePassement 
} from '../controllers/passementController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Toutes les routes de passements sont réservées à l'admin
router.post('/', protect, admin, createPassement);
router.get('/', protect, admin, getPassements);
router.patch('/:id/status', protect, admin, updatePassementStatus);
router.delete('/:id', protect, admin, deletePassement);

export default router;
