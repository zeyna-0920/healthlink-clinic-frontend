import { createServerFn } from "@tanstack/react-start";

/**
 * GET /api/medicaments
 * Prêt pour Cloudflare D1.
 * NOTE: `image` est un slug ; le mapping vers l'asset bundlé se fait côté client
 * (voir src/routes/medicaments.tsx) pour éviter que les URLs `/assets/*` passent
 * par la server function (sinon bloquées par l'auth du preview).
 */

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

export type Medicament = {
  id: number;
  nom: string;
  description: string;
  categorie: "fievre" | "douleur" | "infection" | "coeur" | "diarrhee";
  image: MedSlug;
};

const MEDICAMENTS: Medicament[] = [
  { id: 1, nom: "Paracétamol 500mg", description: "Antipyrétique et antalgique pour soulager la fièvre et les douleurs légères.", categorie: "fievre", image: "paracetamol" },
  { id: 2, nom: "Ibuprofène 400mg", description: "Anti-inflammatoire non stéroïdien efficace contre la douleur et l'inflammation.", categorie: "douleur", image: "ibuprofene" },
  { id: 3, nom: "Amoxicilline 1g", description: "Antibiotique à large spectre utilisé pour traiter diverses infections bactériennes.", categorie: "infection", image: "amoxicilline" },
  { id: 4, nom: "Aspirine 100mg", description: "Antiagrégant plaquettaire prescrit pour la prévention cardiovasculaire.", categorie: "coeur", image: "aspirine" },
  { id: 5, nom: "Doliprane 1000mg", description: "Soulagement rapide de la fièvre et des maux de tête chez l'adulte.", categorie: "fievre", image: "doliprane" },
  { id: 6, nom: "Tramadol 50mg", description: "Antalgique opioïde pour les douleurs modérées à sévères sur prescription.", categorie: "douleur", image: "tramadol" },
  { id: 7, nom: "Augmentin 1g", description: "Association amoxicilline + acide clavulanique contre les infections résistantes.", categorie: "infection", image: "augmentin" },
  { id: 8, nom: "Bisoprolol 5mg", description: "Bêta-bloquant utilisé dans l'hypertension et l'insuffisance cardiaque.", categorie: "coeur", image: "bisoprolol" },
  { id: 9, nom: "Azithromycine 250mg", description: "Macrolide indiqué pour les infections respiratoires et ORL.", categorie: "infection", image: "azithromycine" },
  { id: 10, nom: "Panadol 500mg", description: "Paracétamol pour soulager efficacement maux de tête, fièvre et douleurs courantes.", categorie: "fievre", image: "panadol" },
  { id: 11, nom: "Smecta 3g", description: "Pansement intestinal à base de diosmectite, traite la diarrhée aiguë et chronique.", categorie: "diarrhee", image: "smecta" },
  { id: 12, nom: "Imodium 2mg", description: "Lopéramide, ralentit le transit intestinal pour stopper rapidement la diarrhée.", categorie: "diarrhee", image: "imodium" },
];

export const getMedicaments = createServerFn().handler(async (): Promise<Medicament[]> => {
  return MEDICAMENTS;
});
