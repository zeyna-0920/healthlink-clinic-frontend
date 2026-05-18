import Medicament from '../models/Medicament.js';

// Récupérer tous les médicaments
export const getAllMedicaments = async (req, res) => {
  try {
    const medicaments = await Medicament.find({ active: true }).sort({ nom: 1 });
    
    if (!medicaments || medicaments.length === 0) {
      return res.status(200).json([]);
    }

    // Formater les données pour correspondre au format du frontend
    const formattedMedicaments = medicaments.map((med) => ({
      id: med._id.toString(),
      nom: med.nom,
      description: med.description,
      categorie: med.categorie,
      image: med.image,
      prixClinic: med.prixClinic,
      prixPharmacie: med.prixPharmacie,
      ordonnance: med.ordonnance,
    }));

    res.status(200).json(formattedMedicaments);
  } catch (error) {
    console.error('Erreur lors de la récupération des médicaments:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des médicaments',
      error: error.message,
    });
  }
};

// Récupérer les détails complets d'un médicament
export const getMedicamentById = async (req, res) => {
  try {
    const { id } = req.params;
    const medicament = await Medicament.findById(id);

    if (!medicament) {
      return res.status(404).json({
        success: false,
        message: 'Médicament non trouvé',
      });
    }

    res.status(200).json({
      success: true,
      data: medicament,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du médicament:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du médicament',
      error: error.message,
    });
  }
};

// Créer un médicament
export const createMedicament = async (req, res) => {
  try {
    const { nom, description, categorie, image, dosage, sideEffects, contraindications, prix, stock } = req.body;

    // Vérifier que le nom et la catégorie sont fournis
    if (!nom || !description || !categorie || !image) {
      return res.status(400).json({
        success: false,
        message: 'Les champs nom, description, catégorie et image sont requis',
      });
    }

    const medicament = new Medicament({
      nom,
      description,
      categorie,
      image,
      dosage,
      sideEffects,
      contraindications,
      prix,
      stock,
    });

    await medicament.save();

    res.status(201).json({
      success: true,
      message: 'Médicament créé avec succès',
      data: medicament,
    });
  } catch (error) {
    console.error('Erreur lors de la création du médicament:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Un médicament avec ce nom existe déjà',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du médicament',
      error: error.message,
    });
  }
};

// Mettre à jour un médicament
export const updateMedicament = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, description, categorie, image, dosage, sideEffects, contraindications, prix, stock, active } = req.body;

    const medicament = await Medicament.findByIdAndUpdate(
      id,
      {
        nom,
        description,
        categorie,
        image,
        dosage,
        sideEffects,
        contraindications,
        prix,
        stock,
        active,
      },
      { new: true, runValidators: true }
    );

    if (!medicament) {
      return res.status(404).json({
        success: false,
        message: 'Médicament non trouvé',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Médicament mis à jour avec succès',
      data: medicament,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du médicament:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du médicament',
      error: error.message,
    });
  }
};

// Supprimer un médicament
export const deleteMedicament = async (req, res) => {
  try {
    const { id } = req.params;
    
    const medicament = await Medicament.findByIdAndUpdate(
      id,
      { active: false },
      { new: true }
    );

    if (!medicament) {
      return res.status(404).json({
        success: false,
        message: 'Médicament non trouvé',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Médicament supprimé avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du médicament:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du médicament',
      error: error.message,
    });
  }
};

// Rechercher des médicaments par catégorie
export const getMedicamentsByCategory = async (req, res) => {
  try {
    const { categorie } = req.params;
    const validCategories = ['fievre', 'douleur', 'infection', 'coeur', 'diarrhee'];

    if (!validCategories.includes(categorie)) {
      return res.status(400).json({
        success: false,
        message: 'Catégorie invalide',
      });
    }

    const medicaments = await Medicament.find({ categorie, active: true }).sort({ nom: 1 });

    res.status(200).json({
      success: true,
      data: medicaments,
    });
  } catch (error) {
    console.error('Erreur lors de la recherche par catégorie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la recherche par catégorie',
      error: error.message,
    });
  }
};
