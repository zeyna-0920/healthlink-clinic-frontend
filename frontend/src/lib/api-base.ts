/**
 * URL de base de l’API Express.
 * - En dev (navigateur) : chaîne vide → requêtes relatives `/api/...` proxifiées par Vite vers le backend (fonctionne en localhost et en accès LAN).
 * - En dev (SSR Node) : loopback explicite (fetch relatif non fiable côté serveur).
 * - `VITE_API_URL` : prioritaire si défini (ex. déploiement).
 */
export function getApiBaseUrl(): string {
  // 1. Vérifier si une URL est explicitement définie dans l'env (ex: Vercel Dashboard)
  const fromEnv = import.meta.env.VITE_API_URL;
  if (fromEnv != null && String(fromEnv).trim() !== "") {
    return String(fromEnv).replace(/\/$/, "");
  }

  // 2. En production (Vercel) ou développement
  // Nous retournons une chaîne vide pour utiliser des URLs relatives (/api/...)
  // Cela permet à Vercel de proxifier les requêtes vers Render via vercel.json
  // et évite les problèmes de CORS et de configuration d'URL en dur.
  return "";
}
