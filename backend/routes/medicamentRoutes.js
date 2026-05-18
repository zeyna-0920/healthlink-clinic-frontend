import express from 'express';
import {
  getAllMedicaments,
  getMedicamentById,
  createMedicament,
  updateMedicament,
  deleteMedicament,
  getMedicamentsByCategory,
} from '../controllers/medicamentController.js';

const router = express.Router();

// GET - Récupérer tous les médicaments
router.get('/', getAllMedicaments);

// GET - Récupérer les médicaments par catégorie
router.get('/categorie/:categorie', getMedicamentsByCategory);

// GET - Récupérer un médicament par ID
router.get('/:id', getMedicamentById);

// POST - Créer un nouveau médicament
router.post('/', createMedicament);

// PUT - Mettre à jour un médicament
router.put('/:id', updateMedicament);

// DELETE - Supprimer un médicament
router.delete('/:id', deleteMedicament);

export default router;
