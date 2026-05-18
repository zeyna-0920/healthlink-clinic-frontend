import { getApiBaseUrl } from "@/lib/api-base";

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
  prixClinic: number; // Prix en clinique
  prixPharmacie: number; // Prix en pharmacie
  ordonnance: boolean; // true = nécessite ordonnance, false = sans ordonnance
};

// Données locales comme fallback
const medicamentsLocaux: Medicament[] = [
  {
    id: "1",
    nom: "Paracétamol",
    description:
      "Antalgique et antipyrétique utilisé pour soulager la douleur et réduire la fièvre.",
    categorie: "fievre",
    image: "paracetamol",
    prixClinic: 2500,
    prixPharmacie: 3000,
    ordonnance: false,
  },
  {
    id: "2",
    nom: "Ibuprofène",
    description:
      "Anti-inflammatoire non stéroïdien pour traiter la douleur, l'inflammation et la fièvre.",
    categorie: "douleur",
    image: "ibuprofene",
    prixClinic: 3500,
    prixPharmacie: 4000,
    ordonnance: false,
  },
  {
    id: "3",
    nom: "Amoxicilline",
    description: "Antibiotique utilisé pour traiter diverses infections bactériennes.",
    categorie: "infection",
    image: "amoxicilline",
    prixClinic: 5000,
    prixPharmacie: 6000,
    ordonnance: true,
  },
  {
    id: "4",
    nom: "Aspirine",
    description:
      "Analgésique, antipyrétique et anti-inflammatoire, également utilisé comme anticoagulant.",
    categorie: "douleur",
    image: "aspirine",
    prixClinic: 2000,
    prixPharmacie: 2500,
    ordonnance: false,
  },
  {
    id: "5",
    nom: "Doliprane",
    description: "Médicament à base de paracétamol pour soulager la douleur et la fièvre.",
    categorie: "fievre",
    image: "doliprane",
    prixClinic: 2800,
    prixPharmacie: 3200,
    ordonnance: false,
  },
  {
    id: "6",
    nom: "Tramadol",
    description: "Analgésique opioïde pour traiter la douleur modérée à sévère.",
    categorie: "douleur",
    image: "tramadol",
    prixClinic: 8000,
    prixPharmacie: 9000,
    ordonnance: true,
  },
  {
    id: "7",
    nom: "Augmentin",
    description:
      "Association d'amoxicilline et d'acide clavulanique pour traiter les infections bactériennes résistantes.",
    categorie: "infection",
    image: "augmentin",
    prixClinic: 12000,
    prixPharmacie: 13500,
    ordonnance: true,
  },
  {
    id: "8",
    nom: "Bisoprolol",
    description: "Bêta-bloquant utilisé pour traiter l'hypertension et les problèmes cardiaques.",
    categorie: "coeur",
    image: "bisoprolol",
    prixClinic: 4500,
    prixPharmacie: 5000,
    ordonnance: true,
  },
  {
    id: "9",
    nom: "Azithromycine",
    description: "Antibiotique macrolide pour traiter diverses infections bactériennes.",
    categorie: "infection",
    image: "azithromycine",
    prixClinic: 7000,
    prixPharmacie: 8000,
    ordonnance: true,
  },
  {
    id: "10",
    nom: "Panadol",
    description: "Médicament à base de paracétamol pour soulager la douleur et la fièvre.",
    categorie: "fievre",
    image: "panadol",
    prixClinic: 2600,
    prixPharmacie: 3000,
    ordonnance: false,
  },
  {
    id: "11",
    nom: "Smecta",
    description: "Traitement symptomatique de la diarrhée aiguë et chronique.",
    categorie: "diarrhee",
    image: "smecta",
    prixClinic: 4000,
    prixPharmacie: 4500,
    ordonnance: false,
  },
  {
    id: "12",
    nom: "Imodium",
    description: "Antidiarrhéique pour traiter la diarrhée aiguë et chronique.",
    categorie: "diarrhee",
    image: "imodium",
    prixClinic: 3500,
    prixPharmacie: 4000,
    ordonnance: false,
  },
];

const API_BASE_URL = getApiBaseUrl();

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
      console.warn(
        "Impossible de récupérer les médicaments depuis l'API, utilisation des données locales",
      );
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
