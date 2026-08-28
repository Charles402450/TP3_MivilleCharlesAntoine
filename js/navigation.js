document.addEventListener("DOMContentLoaded", () => {
  /* Navigation principale */

  const burger = document.getElementById("navBurger");
  const menu = document.getElementById("navPrincipale");
  const iconeBurger = document.getElementById("navIconeBurger");
  const iconeFermer = document.getElementById("navIconeFermer");
  const bascules = document.querySelectorAll(".nav__bascule");
  const header = document.querySelector(".nav");

  // Doit correspondre au breakpoint « md » de Tailwind (48rem = 768px).
  const POINT_RUPTURE_MD = window.matchMedia("(min-width: 48rem)");

  /* --------------------------------------------------------------
     Menu burger (mobile)
     -------------------------------------------------------------- */

  const ouvrirMenu = () => {
    menu.classList.remove("hidden");
    iconeBurger.classList.add("hidden");
    iconeFermer.classList.remove("hidden");
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Fermer le menu de navigation");
  };

  const fermerMenu = () => {
    menu.classList.add("hidden");
    iconeBurger.classList.remove("hidden");
    iconeFermer.classList.add("hidden");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Ouvrir le menu de navigation");
  };

  burger.addEventListener("click", () => {
    const estOuvert = burger.getAttribute("aria-expanded") === "true";
    if (estOuvert) {
      fermerMenu();
    } else {
      ouvrirMenu();
    }
  });

  /* --------------------------------------------------------------
     Sous-menus (« Jeux »)
     -------------------------------------------------------------- */

  const fermerSousMenu = (bascule) => {
    const sousMenu = document.getElementById(
      bascule.getAttribute("aria-controls"),
    );
    const chevron = bascule.querySelector(".nav__chevron");

    sousMenu.classList.remove("nav__sousMenu--ouvert");
    chevron.classList.remove("rotate-180");
    bascule.setAttribute("aria-expanded", "false");
  };

  const ouvrirSousMenu = (bascule) => {
    const sousMenu = document.getElementById(
      bascule.getAttribute("aria-controls"),
    );
    const chevron = bascule.querySelector(".nav__chevron");

    sousMenu.classList.add("nav__sousMenu--ouvert");
    chevron.classList.add("rotate-180");
    bascule.setAttribute("aria-expanded", "true");
  };

  const fermerTousLesSousMenus = () => {
    bascules.forEach(fermerSousMenu);
  };

  const estBureau = () => POINT_RUPTURE_MD.matches;

  bascules.forEach((bascule) => {
    const item = bascule.closest(".nav__item");

    // --- Clic sur le chevron (mobile) ---
    bascule.addEventListener("click", () => {
      const estOuvert = bascule.getAttribute("aria-expanded") === "true";

      // Un seul sous-menu ouvert à la fois
      fermerTousLesSousMenus();

      if (!estOuvert) {
        ouvrirSousMenu(bascule);
      }
    });

    // --- Survol (bureau seulement) ---
    // Le chevron est masqué à partir de md : sur bureau, le survol et le
    // focus clavier sont les deux seuls déclencheurs.
    item.addEventListener("mouseenter", () => {
      if (estBureau()) {
        ouvrirSousMenu(bascule);
      }
    });

    item.addEventListener("mouseleave", () => {
      if (!estBureau()) return;

      // Si l'utilisateur navigue au clavier à l'intérieur du sous-menu,
      // un simple mouvement de souris ne doit pas le refermer sous lui.
      if (item.contains(document.activeElement)) return;

      fermerSousMenu(bascule);
    });

    // --- Focus clavier (bureau seulement) ---
    // Sans ça, le sous-menu serait inatteignable au clavier sur bureau
    // puisque le chevron y est masqué.
    item.addEventListener("focusin", () => {
      if (estBureau()) {
        ouvrirSousMenu(bascule);
      }
    });

    item.addEventListener("focusout", (event) => {
      if (!estBureau()) return;

      // relatedTarget = l'élément qui reçoit le focus. S'il est encore
      // dans le sous-menu, on laisse ouvert.
      if (item.contains(event.relatedTarget)) return;

      // La souris est toujours par-dessus : c'est le survol qui commande.
      if (item.matches(":hover")) return;

      fermerSousMenu(bascule);
    });
  });

  /* --------------------------------------------------------------
     Fermeture : Échap et clic à l'extérieur
     -------------------------------------------------------------- */

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    const sousMenuOuvert = [...bascules].find(
      (bascule) => bascule.getAttribute("aria-expanded") === "true",
    );

    // Échap ferme d'abord le sous-menu, puis le menu complet.
    // Le focus revient sur le bouton qui a ouvert le panneau.
    if (sousMenuOuvert) {
      fermerSousMenu(sousMenuOuvert);
      sousMenuOuvert.focus();
    } else if (burger.getAttribute("aria-expanded") === "true") {
      fermerMenu();
      burger.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (header.contains(event.target)) return;

    fermerTousLesSousMenus();
    if (burger.getAttribute("aria-expanded") === "true") {
      fermerMenu();
    }
  });

  /* --------------------------------------------------------------
     Changement de résolution
     -------------------------------------------------------------- */

  // En passant en mode bureau, on remet le menu à son état fermé :
  // « md:block » le garde visible, mais l'état ARIA doit rester cohérent
  // pour le retour éventuel en mode mobile.
  POINT_RUPTURE_MD.addEventListener("change", () => {
    fermerMenu();
    fermerTousLesSousMenus();
  });

  /* --------------------------------------------------------------
     Page active
     -------------------------------------------------------------- */

  // Ajoute aria-current="page" sur le lien de la page courante.
  // Évite d'avoir à modifier le header manuellement dans chaque fichier.
  const marquerPageActive = () => {
    const segments = window.location.pathname.split("/");
    const fichier = segments.pop() || "index.html";

    menu.querySelectorAll(".nav__lien").forEach((lien) => {
      const cible = lien.getAttribute("href");
      if (cible !== fichier) return;

      lien.setAttribute("aria-current", "page");

      // Si la page active est dans un sous-menu, on ouvre le sous-menu
      // et on marque aussi son parent comme section courante.
      const sousMenu = lien.closest(".nav__sousMenu");
      if (!sousMenu) return;

      const bascule = document.querySelector(
        `[aria-controls="${sousMenu.id}"]`,
      );
      if (bascule && POINT_RUPTURE_MD.matches === false) {
        ouvrirSousMenu(bascule);
      }

      const lienParent = sousMenu
        .closest(".nav__item")
        .querySelector(".nav__lien");
      lienParent.setAttribute("aria-current", "true");
    });
  };

  marquerPageActive();
});
