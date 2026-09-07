/* ==================================================================
   Enregistrement du service worker
   Placé à la racine du site, le worker contrôle toutes les pages.
   S'il était dans /js/, sa portée se limiterait à /js/.
   ================================================================== */

// Vérification du support : évite une erreur sur les vieux navigateurs
// et sur les pages ouvertes en file://, où l'API n'existe pas.
if ("serviceWorker" in navigator) {
  // On attend « load » pour ne pas retarder le premier affichage.
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("service-worker.js")
      .then((enregistrement) => {
        console.log("Service worker enregistré :", enregistrement.scope);
      })
      .catch((erreur) => {
        console.error("Échec de l'enregistrement du service worker :", erreur);
      });
  });
}
