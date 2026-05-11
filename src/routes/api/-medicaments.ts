export type MedSlug =
  | "paracetamol"
  | "ibuprofene"
  | "amoxicilline"
  | "aspirine"
  | "doliprane"
  | "tramadol"
  | "augmentin"
  | "bisoprolol"
  | "azithromycine"
  | "panadol"
  | "smecta"
  | "imodium";

export type Categorie = "fievre" | "douleur" | "infection" | "coeur" | "diarrhee";

export type Medicament = {
  id: string;
  nom: string;
  description: string;
  categorie: Categorie;
  image: MedSlug;
};

// Données locales comme fallback
const medicamentsLocaux: Medicament[] = [
  {
    id: "1",
    nom: "Paracétamol",
    description: "Antalgique et antipyrétique utilisé pour soulager la douleur et réduire la fièvre.",
    categorie: "fievre",
    image: "paracetamol",
  },
  {
    id: "2",
    nom: "Ibuprofène",
    description: "Anti-inflammatoire non stéroïdien pour traiter la douleur, l'inflammation et la fièvre.",
    categorie: "douleur",
    image: "ibuprofene",
  },
  {
    id: "3",
    nom: "Amoxicilline",
    description: "Antibiotique utilisé pour traiter diverses infections bactériennes.",
    categorie: "infection",
    image: "amoxicilline",
  },
  {
    id: "4",
    nom: "Aspirine",
    description: "Analgésique, antipyrétique et anti-inflammatoire, également utilisé comme anticoagulant.",
    categorie: "douleur",
    image: "aspirine",
  },
  {
    id: "5",
    nom: "Doliprane",
    description: "Médicament à base de paracétamol pour soulager la douleur et la fièvre.",
    categorie: "fievre",
    image: "doliprane",
  },
  {
    id: "6",
    nom: "Tramadol",
    description: "Analgésique opioïde pour traiter la douleur modérée à sévère.",
    categorie: "douleur",
    image: "tramadol",
  },
  {
    id: "7",
    nom: "Augmentin",
    description: "Association d'amoxicilline et d'acide clavulanique pour traiter les infections bactériennes résistantes.",
    categorie: "infection",
    image: "augmentin",
  },
  {
    id: "8",
    nom: "Bisoprolol",
    description: "Bêta-bloquant utilisé pour traiter l'hypertension et les problèmes cardiaques.",
    categorie: "coeur",
    image: "bisoprolol",
  },
  {
    id: "9",
    nom: "Azithromycine",
    description: "Antibiotique macrolide pour traiter diverses infections bactériennes.",
    categorie: "infection",
    image: "azithromycine",
  },
  {
    id: "10",
    nom: "Panadol",
    description: "Médicament à base de paracétamol pour soulager la douleur et la fièvre.",
    categorie: "fievre",
    image: "panadol",
  },
  {
    id: "11",
    nom: "Smecta",
    description: "Traitement symptomatique de la diarrhée aiguë et chronique.",
    categorie: "diarrhee",
    image: "smecta",
  },
  {
    id: "12",
    nom: "Imodium",
    description: "Antidiarrhéique pour traiter la diarrhée aiguë et chronique.",
    categorie: "diarrhee",
    image: "imodium",
  },
];

// API URL - utilise l'URL d'API du serveur
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function getMedicaments(): Promise<Medicament[]> {
  try {
    // Essayer de récupérer depuis l'API MongoDB
    const response = await fetch(`${API_BASE_URL}/api/medicaments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.warn("Impossible de récupérer les médicaments depuis l'API, utilisation des données locales");
      return medicamentsLocaux;
    }

    const data = await response.json();
    
    // Vérifier que les données sont valides
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    
    // Si aucune donnée depuis l'API, utiliser les données locales
    return medicamentsLocaux;
  } catch (error) {
    console.warn("Erreur lors de la récupération des médicaments depuis l'API:", error);
    console.log("Utilisation des données locales...");
    return medicamentsLocaux;
  }
}