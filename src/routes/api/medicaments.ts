import { createServerFn } from "@tanstack/react-start";
import paracetamolImg from "@/assets/meds/paracetamol.jpg";
import ibuprofeneImg from "@/assets/meds/ibuprofene.jpg";
import amoxicillineImg from "@/assets/meds/amoxicilline.jpg";
import aspirineImg from "@/assets/meds/aspirine.jpg";
import dolipraneImg from "@/assets/meds/doliprane.jpg";
import tramadolImg from "@/assets/meds/tramadol.jpg";
import augmentinImg from "@/assets/meds/augmentin.jpg";
import bisoprololImg from "@/assets/meds/bisoprolol.jpg";
import azithromycineImg from "@/assets/meds/azithromycine.jpg";
import panadolImg from "@/assets/meds/panadol.jpg";

/**
 * GET /api/medicaments
 * Prêt pour Cloudflare D1 (voir commentaires précédents).
 */

export type Medicament = {
  id: number;
  nom: string;
  description: string;
  categorie: "fievre" | "douleur" | "infection" | "coeur";
  image: string;
};

const MEDICAMENTS: Medicament[] = [
  {
    id: 1,
    nom: "Paracétamol 500mg",
    description: "Antipyrétique et antalgique pour soulager la fièvre et les douleurs légères.",
    categorie: "fievre",
    image: paracetamolImg,
  },
  {
    id: 2,
    nom: "Ibuprofène 400mg",
    description: "Anti-inflammatoire non stéroïdien efficace contre la douleur et l'inflammation.",
    categorie: "douleur",
    image: ibuprofeneImg,
  },
  {
    id: 3,
    nom: "Amoxicilline 1g",
    description: "Antibiotique à large spectre utilisé pour traiter diverses infections bactériennes.",
    categorie: "infection",
    image: amoxicillineImg,
  },
  {
    id: 4,
    nom: "Aspirine 100mg",
    description: "Antiagrégant plaquettaire prescrit pour la prévention cardiovasculaire.",
    categorie: "coeur",
    image: aspirineImg,
  },
  {
    id: 5,
    nom: "Doliprane 1000mg",
    description: "Soulagement rapide de la fièvre et des maux de tête chez l'adulte.",
    categorie: "fievre",
    image: dolipraneImg,
  },
  {
    id: 6,
    nom: "Tramadol 50mg",
    description: "Antalgique opioïde pour les douleurs modérées à sévères sur prescription.",
    categorie: "douleur",
    image: tramadolImg,
  },
  {
    id: 7,
    nom: "Augmentin 1g",
    description: "Association amoxicilline + acide clavulanique contre les infections résistantes.",
    categorie: "infection",
    image: augmentinImg,
  },
  {
    id: 8,
    nom: "Bisoprolol 5mg",
    description: "Bêta-bloquant utilisé dans l'hypertension et l'insuffisance cardiaque.",
    categorie: "coeur",
    image: bisoprololImg,
  },
  {
    id: 9,
    nom: "Azithromycine 250mg",
    description: "Macrolide indiqué pour les infections respiratoires et ORL.",
    categorie: "infection",
    image: azithromycineImg,
  },
  {
    id: 10,
    nom: "Panadol 500mg",
    description: "Paracétamol pour soulager efficacement maux de tête, fièvre et douleurs courantes.",
    categorie: "fievre",
    image: panadolImg,
  },
];

export const getMedicaments = createServerFn().handler(async (): Promise<Medicament[]> => {
  return MEDICAMENTS;
});
