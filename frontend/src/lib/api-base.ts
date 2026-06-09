/**
 * URL de base de l’API Express.
 * - En dev (navigateur) : chaîne vide → requêtes relatives `/api/...` proxifiées par Vite vers le backend (fonctionne en localhost et en accès LAN).
 * - En dev (SSR Node) : loopback explicite (fetch relatif non fiable côté serveur).
 * - `VITE_API_URL` : prioritaire si défini (ex. déploiement).
 */
export function getApiBaseUrl(): string {
  const fromEnv = import.meta.env.VITE_API_URL;
  if (fromEnv != null && String(fromEnv).trim() !== "") {
    const url = String(fromEnv).replace(/\/$/, "");
    // En production, ignorer localhost (erreur fréquente dans les variables Vercel)
    if (import.meta.env.PROD && /localhost|127\.0\.0\.1/.test(url)) {
      console.warn(
        "VITE_API_URL pointe vers localhost en production — utilisation des URLs relatives /api/",
      );
      return "";
    }
    return url;
  }

  // URLs relatives : Vercel proxifie /api/* vers Render (vercel.json)
  return "";
}
