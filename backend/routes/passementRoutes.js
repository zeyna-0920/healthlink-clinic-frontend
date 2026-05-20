import express from 'express';
import { 
  createPassement, 
  getPassements, 
  updatePassementStatus, 
  deletePassement 
} from '../controllers/passementController.js';

const router = express.Router();

router.post('/', createPassement);
router.get('/', getPassements);
router.patch('/:id/status', updatePassementStatus);
router.delete('/:id', deletePassement);

export default router;
