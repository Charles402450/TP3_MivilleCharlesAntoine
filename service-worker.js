/* ==================================================================
   Service worker — Studio Chatoyant
   Cycle de vie : install (précache) → activate (nettoyage) → fetch.
   Incrémenter CACHE_NAME à CHAQUE modification d'un fichier caché,
   sinon les anciennes versions continuent d'être servies.
   ================================================================== */

const CACHE_NAME = "chatoyant-v1";

// Le CDN Tailwind est traité à part : s'il est indisponible au moment de
// l'installation, addAll() rejetterait tout le précache et le service
// worker ne s'installerait pas du tout.
const CDN_TAILWIND = "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4";

const FICHIERS_A_CACHER = [
  "./",
  "index.html",
  "apropos.html",
  "jeux.html",
  "moogicalsanctuary.html",
  "contact.html",
  "conditions.html",
  "confirmation.html",
  "offline.html",

  "css/normalize.css",
  "css/style.css",
  "css/hero.css",
  "css/hover.css",

  "js/navigation.js",
  "js/formulaire.js",
  "js/pwa.js",

  "media/logo250x250.png",
  "media/moogicalsanctuary1.png",
  "favicon.png",

  "icons/icon-144.png",
  "icons/icon-192.png",
  "icons/icon-512.png",

  // Seules les graisses réellement employées par le site. Les autres
  // seront mises en cache au fil de l'eau si jamais elles servent.
  "fonts/Poppins-Regular.ttf",
  "fonts/Poppins-Medium.ttf",
  "fonts/Poppins-SemiBold.ttf",
  "fonts/Poppins-Bold.ttf",
  "fonts/Fraunces-Variable.ttf",

  "manifest.json",
];

/* ---------------- Installation : on remplit le cache ---------------- */

self.addEventListener("install", (evenement) => {
  evenement.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // waitUntil garde le worker en phase d'installation tant que le
      // cache n'est pas rempli.
      await cache.addAll(FICHIERS_A_CACHER);

      // Le CDN est facultatif : une panne réseau ne doit pas faire
      // échouer toute l'installation.
      try {
        await cache.add(CDN_TAILWIND);
      } catch (erreur) {
        console.warn("CDN Tailwind non mis en cache :", erreur);
      }
    }),
  );

  // Active le nouveau worker sans attendre la fermeture des onglets.
  self.skipWaiting();
});

/* ------------- Activation : on supprime les vieux caches ------------- */

self.addEventListener("activate", (evenement) => {
  evenement.waitUntil(
    caches.keys().then((cles) =>
      Promise.all(
        cles.map((cle) => {
          if (cle !== CACHE_NAME) {
            return caches.delete(cle);
          }
        }),
      ),
    ),
  );

  // Prend le contrôle des pages déjà ouvertes.
  self.clients.claim();
});

/* ---------------------- Interception des requêtes ---------------------- */

self.addEventListener("fetch", (evenement) => {
  const requete = evenement.request;

  // On ne met en cache que les lectures.
  if (requete.method !== "GET") return;

  // ---- Navigation entre les pages : Network First ----
  // On tente le réseau pour avoir la version la plus fraîche, puis on
  // se rabat sur le cache, et en dernier recours sur offline.html.
  if (requete.mode === "navigate") {
    evenement.respondWith(
      fetch(requete)
        .then((reponse) => {
          const copie = reponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(requete, copie));
          return reponse;
        })
        .catch(() =>
          caches
            .match(requete)
            .then((cachee) => cachee || caches.match("offline.html")),
        ),
    );
    return;
  }

  // ---- Ressources statiques : Cache First ----
  // CSS, JS, polices, images : elles changent rarement, autant les
  // servir immédiatement depuis le cache.
  evenement.respondWith(
    caches.match(requete).then((cachee) => {
      if (cachee) return cachee;

      return fetch(requete).then((reponse) => {
        // On garde une copie pour la prochaine fois. Les réponses
        // opaques (type "opaque") viennent d'un domaine externe sans
        // CORS : leur statut est 0, on ne les met pas en cache.
        if (reponse.ok) {
          const copie = reponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(requete, copie));
        }
        return reponse;
      });
    }),
  );
});
