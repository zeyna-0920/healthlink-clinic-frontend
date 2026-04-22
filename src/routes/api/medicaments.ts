import { createServerFileRoute } from "@tanstack/react-start/server";

/**
 * GET /api/medicaments
 *
 * Endpoint prêt pour Cloudflare D1.
 * Pour brancher D1 :
 *   1. Ajouter le binding D1 dans wrangler.jsonc (binding: "DB")
 *   2. Remplacer MEDICAMENTS ci-dessous par :
 *        const { results } = await env.DB
 *          .prepare("SELECT id, nom, description, categorie, image FROM medicaments")
 *          .all();
 *        return Response.json(results);
 *
 * L'URL de l'API est configurable via VITE_MEDICAMENTS_API_URL.
 * Si non défini, le frontend appellera /api/medicaments (cette route).
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
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80",
  },
  {
    id: 2,
    nom: "Ibuprofène 400mg",
    description: "Anti-inflammatoire non stéroïdien efficace contre la douleur et l'inflammation.",
    categorie: "douleur",
    image: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=600&q=80",
  },
  {
    id: 3,
    nom: "Amoxicilline 1g",
    description: "Antibiotique à large spectre utilisé pour traiter diverses infections bactériennes.",
    categorie: "infection",
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&q=80",
  },
  {
    id: 4,
    nom: "Aspirine 100mg",
    description: "Antiagrégant plaquettaire prescrit pour la prévention cardiovasculaire.",
    categorie: "coeur",
    image: "https://images.unsplash.com/photo-1626516831459-7d8edd6b934d?w=600&q=80",
  },
  {
    id: 5,
    nom: "Doliprane 1000mg",
    description: "Soulagement rapide de la fièvre et des maux de tête chez l'adulte.",
    categorie: "fievre",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&q=80",
  },
  {
    id: 6,
    nom: "Tramadol 50mg",
    description: "Antalgique opioïde pour les douleurs modérées à sévères sur prescription.",
    categorie: "douleur",
    image: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=600&q=80",
  },
  {
    id: 7,
    nom: "Augmentin 1g",
    description: "Association amoxicilline + acide clavulanique contre les infections résistantes.",
    categorie: "infection",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&q=80",
  },
  {
    id: 8,
    nom: "Bisoprolol 5mg",
    description: "Bêta-bloquant utilisé dans l'hypertension et l'insuffisance cardiaque.",
    categorie: "coeur",
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=600&q=80",
  },
  {
    id: 9,
    nom: "Azithromycine 250mg",
    description: "Macrolide indiqué pour les infections respiratoires et ORL.",
    categorie: "infection",
    image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=600&q=80",
  },
];

export const ServerRoute = createServerFileRoute("/api/medicaments").methods({
  GET: async () => {
    return Response.json(MEDICAMENTS, {
      headers: { "cache-control": "public, max-age=60" },
    });
  },
});