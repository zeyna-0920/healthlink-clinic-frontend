import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Medicament from './models/Medicament.js';

// Charger les variables d'environnement
dotenv.config();

const medicamentsInitiaux = [
  {
    nom: "Paracétamol",
    description: "Antalgique et antipyrétique utilisé pour soulager la douleur et réduire la fièvre.",
    categorie: "fievre",
    image: "paracetamol",
    dosage: "500mg",
    prix: 500,
    stock: 100,
  },
  {
    nom: "Ibuprofène",
    description: "Anti-inflammatoire non stéroïdien pour traiter la douleur, l'inflammation et la fièvre.",
    categorie: "douleur",
    image: "ibuprofene",
    dosage: "200mg",
    prix: 750,
    stock: 80,
  },
  {
    nom: "Amoxicilline",
    description: "Antibiotique utilisé pour traiter diverses infections bactériennes.",
    categorie: "infection",
    image: "amoxicilline",
    dosage: "250mg",
    prix: 1200,
    stock: 50,
  },
  {
    nom: "Aspirine",
    description: "Analgésique, antipyrétique et anti-inflammatoire, également utilisé comme anticoagulant.",
    categorie: "douleur",
    image: "aspirine",
    dosage: "500mg",
    prix: 600,
    stock: 120,
  },
  {
    nom: "Doliprane",
    description: "Médicament à base de paracétamol pour soulager la douleur et la fièvre.",
    categorie: "fievre",
    image: "doliprane",
    dosage: "500mg",
    prix: 800,
    stock: 90,
  },
  {
    nom: "Tramadol",
    description: "Analgésique opioïde pour traiter la douleur modérée à sévère.",
    categorie: "douleur",
    image: "tramadol",
    dosage: "50mg",
    prix: 2000,
    stock: 40,
  },
  {
    nom: "Augmentin",
    description: "Association d'amoxicilline et d'acide clavulanique pour traiter les infections bactériennes résistantes.",
    categorie: "infection",
    image: "augmentin",
    dosage: "500mg/125mg",
    prix: 2500,
    stock: 35,
  },
  {
    nom: "Bisoprolol",
    description: "Bêta-bloquant utilisé pour traiter l'hypertension et les problèmes cardiaques.",
    categorie: "coeur",
    image: "bisoprolol",
    dosage: "5mg",
    prix: 1500,
    stock: 60,
  },
  {
    nom: "Azithromycine",
    description: "Antibiotique macrolide pour traiter diverses infections bactériennes.",
    categorie: "infection",
    image: "azithromycine",
    dosage: "500mg",
    prix: 1800,
    stock: 45,
  },
  {
    nom: "Panadol",
    description: "Médicament à base de paracétamol pour soulager la douleur et la fièvre.",
    categorie: "fievre",
    image: "panadol",
    dosage: "500mg",
    prix: 700,
    stock: 110,
  },
  {
    nom: "Smecta",
    description: "Traitement symptomatique de la diarrhée aiguë et chronique.",
    categorie: "diarrhee",
    image: "smecta",
    dosage: "3g",
    prix: 1000,
    stock: 70,
  },
  {
    nom: "Imodium",
    description: "Antidiarrhéique pour traiter la diarrhée aiguë et chronique.",
    categorie: "diarrhee",
    image: "imodium",
    dosage: "2mg",
    prix: 1200,
    stock: 65,
  },
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthlink-clinic', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connecté pour l\'initialisation');
  } catch (error) {
    console.error(`Erreur de connexion: ${error.message}`);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    // Vérifier s'il y a déjà des médicaments
    const count = await Medicament.countDocuments();
    if (count > 0) {
      console.log(`${count} médicaments trouvés dans la base de données.`);
      console.log('La base de données est déjà initialisée. Pour réinitialiser, supprimez d\'abord les données.');
      return;
    }

    // Insérer les médicaments
    const result = await Medicament.insertMany(medicamentsInitiaux);
    console.log(`✓ ${result.length} médicaments ajoutés à la base de données avec succès`);
    
    // Afficher les IDs pour référence
    result.forEach((med, index) => {
      console.log(`  ${index + 1}. ${med.nom} (ID: ${med._id})`);
    });

  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
};

const initDatabase = async () => {
  await connectDB();
  await seedDatabase();
  await mongoose.connection.close();
  console.log('Initialisation terminée');
};

initDatabase();
