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
    prixClinic: 2500,
    prixPharmacie: 3000,
    ordonnance: false,
    stock: 100,
  },
  {
    nom: "Ibuprofène",
    description: "Anti-inflammatoire non stéroïdien pour traiter la douleur, l'inflammation et la fièvre.",
    categorie: "douleur",
    image: "ibuprofene",
    dosage: "200mg",
    prixClinic: 3500,
    prixPharmacie: 4000,
    ordonnance: false,
    stock: 80,
  },
  {
    nom: "Amoxicilline",
    description: "Antibiotique utilisé pour traiter diverses infections bactériennes.",
    categorie: "infection",
    image: "amoxicilline",
    dosage: "250mg",
    prixClinic: 5000,
    prixPharmacie: 6000,
    ordonnance: true,
    stock: 50,
  },
  {
    nom: "Aspirine",
    description: "Analgésique, antipyrétique et anti-inflammatoire, également utilisé comme anticoagulant.",
    categorie: "douleur",
    image: "aspirine",
    dosage: "500mg",
    prixClinic: 2000,
    prixPharmacie: 2500,
    ordonnance: false,
    stock: 120,
  },
  {
    nom: "Doliprane",
    description: "Médicament à base de paracétamol pour soulager la douleur et la fièvre.",
    categorie: "fievre",
    image: "doliprane",
    dosage: "500mg",
    prixClinic: 2800,
    prixPharmacie: 3200,
    ordonnance: false,
    stock: 90,
  },
  {
    nom: "Tramadol",
    description: "Analgésique opioïde pour traiter la douleur modérée à sévère.",
    categorie: "douleur",
    image: "tramadol",
    dosage: "50mg",
    prixClinic: 8000,
    prixPharmacie: 9000,
    ordonnance: true,
    stock: 40,
  },
  {
    nom: "Augmentin",
    description: "Association d'amoxicilline et d'acide clavulanique pour traiter les infections bactériennes résistantes.",
    categorie: "infection",
    image: "augmentin",
    dosage: "500mg/125mg",
    prixClinic: 12000,
    prixPharmacie: 13500,
    ordonnance: true,
    stock: 35,
  },
  {
    nom: "Bisoprolol",
    description: "Bêta-bloquant utilisé pour traiter l'hypertension et les problèmes cardiaques.",
    categorie: "coeur",
    image: "bisoprolol",
    dosage: "5mg",
    prixClinic: 4500,
    prixPharmacie: 5500,
    ordonnance: true,
    stock: 60,
  },
  {
    nom: "Azithromycine",
    description: "Antibiotique macrolide pour traiter diverses infections bactériennes.",
    categorie: "infection",
    image: "azithromycine",
    dosage: "500mg",
    prixClinic: 7000,
    prixPharmacie: 8000,
    ordonnance: true,
    stock: 45,
  },
  {
    nom: "Panadol",
    description: "Médicament à base de paracétamol pour soulager la douleur et la fièvre.",
    categorie: "fievre",
    image: "panadol",
    dosage: "500mg",
    prixClinic: 2600,
    prixPharmacie: 3000,
    ordonnance: false,
    stock: 110,
  },
  {
    nom: "Smecta",
    description: "Traitement symptomatique de la diarrhée aiguë et chronique.",
    categorie: "diarrhee",
    image: "smecta",
    dosage: "3g",
    prixClinic: 4000,
    prixPharmacie: 4500,
    ordonnance: false,
    stock: 75,
  },
  {
    nom: "Imodium",
    description: "Antidiarrhéique pour traiter la diarrhée aiguë et chronique.",
    categorie: "diarrhee",
    image: "imodium",
    dosage: "2mg",
    prixClinic: 3500,
    prixPharmacie: 4000,
    ordonnance: false,
    stock: 85,
  },
];

const seedMedicaments = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connecté à MongoDB pour le seeding des médicaments...');

    // Supprimer les anciens médicaments
    await Medicament.deleteMany({});
    console.log('Anciens médicaments supprimés.');

    // Insérer les nouveaux médicaments
    await Medicament.insertMany(medicamentsInitiaux);
    console.log('Nouveaux médicaments insérés avec succès.');

    mongoose.connection.close();
    console.log('Connexion MongoDB fermée.');
  } catch (error) {
    console.error('Erreur lors du seeding des médicaments:', error);
    process.exit(1);
  }
};

seedMedicaments();
