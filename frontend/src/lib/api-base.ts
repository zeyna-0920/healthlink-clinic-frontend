/**
 * URL de base de l’API Express.
 * - En dev (navigateur) : chaîne vide → requêtes relatives `/api/...` proxifiées par Vite vers le backend (fonctionne en localhost et en accès LAN).
 * - En dev (SSR Node) : loopback explicite (fetch relatif non fiable côté serveur).
 * - `VITE_API_URL` : prioritaire si défini (ex. déploiement).
 */
export function getApiBaseUrl(): string {
  const fromEnv = import.meta.env.VITE_API_URL;
  if (fromEnv != null && String(fromEnv).trim() !== "") {
    return String(fromEnv).replace(/\/$/, "");
  }
  if (import.meta.env.DEV && import.meta.env.SSR) {
    return "http://127.0.0.1:5000";
  }
  if (import.meta.env.DEV) {
    return "";
  }
  if (import.meta.env.SSR) {
    const serverUrl =
      typeof process !== "undefined" && process.env?.API_URL
        ? String(process.env.API_URL).replace(/\/$/, "")
        : "http://127.0.0.1:5000";
    return serverUrl;
  }
  return "";
}
