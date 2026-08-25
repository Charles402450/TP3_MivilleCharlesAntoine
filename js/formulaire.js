document.addEventListener("DOMContentLoaded", () => {
  /* Formulaire d'infolettre */

  const form = document.getElementById("formInfolettre");
  const prenom = document.getElementById("prenom");
  const nom = document.getElementById("nom");
  const courriel = document.getElementById("courriel");
  const naissance = document.getElementById("naissance");
  const premierContact = document.getElementById("premierContact");
  const langueInfolettre = document.getElementById("langueInfolettre");
  const radiosContenu = document.querySelectorAll(
    'input[name="contenuPreference"]',
  );
  const conditionsUtilisation = document.getElementById(
    "conditionsUtilisation",
  );

  const PAGE_CONFIRMATION = "confirmation.html";
  const AGE_MINIMUM = 18;

  // Regex ancrée (^ ... $) : sans les ancres, test() accepterait
  // n'importe quelle chaîne contenant un courriel valide quelque part.
  const RE_COURRIEL =
    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/;

  // Devient true après la première tentative de soumission.
  // Sert à ne pas afficher d'erreurs avant que l'utilisateur ait essayé.
  let dejaSoumis = false;

  /* --------------------------------------------------------------
     Soumission
     -------------------------------------------------------------- */

  // On bloque systématiquement la soumission native, puis on redirige
  // nous-mêmes vers la page de confirmation si tout est valide.
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    dejaSoumis = true;

    if (validateForm()) {
      window.location.href = PAGE_CONFIRMATION;
    } else {
      focusPremierChampFautif();
    }
  });

  // Revalidation en direct, mais seulement après une première tentative :
  // l'utilisateur voit ses erreurs disparaître au fur et à mesure qu'il corrige.
  form.addEventListener("input", () => {
    if (dejaSoumis) validateForm();
  });

  form.addEventListener("change", () => {
    if (dejaSoumis) validateForm();
  });

  /* --------------------------------------------------------------
     Validation
     -------------------------------------------------------------- */

  const validateForm = () => {
    let noError = true;

    // Prénom
    const prenomValue = prenom.value.trim();
    if (prenomValue === "") {
      setError(prenom, "Votre prénom est requis.");
      noError = false;
    } else {
      setSuccess(prenom);
    }

    // Nom de famille
    const nomValue = nom.value.trim();
    if (nomValue === "") {
      setError(nom, "Votre nom est requis.");
      noError = false;
    } else {
      setSuccess(nom);
    }

    // Adresse courriel
    const courrielValue = courriel.value.trim();
    if (courrielValue === "") {
      setError(courriel, "Le courriel est requis.");
      noError = false;
    } else if (!RE_COURRIEL.test(courrielValue.toLowerCase())) {
      setError(courriel, "Votre courriel n'est pas valide.");
      noError = false;
    } else {
      setSuccess(courriel);
    }

    // Date de naissance
    const naissanceValue = naissance.value;
    if (naissanceValue === "") {
      setError(naissance, "La date de naissance est requise.");
      noError = false;
    } else if (calculerAge(naissanceValue) < AGE_MINIMUM) {
      setError(naissance, `Vous devez avoir ${AGE_MINIMUM} ans ou plus.`);
      noError = false;
    } else {
      setSuccess(naissance);
    }

    // Premier contact
    if (premierContact.value === "") {
      setError(premierContact, "Veuillez choisir une option.");
      noError = false;
    } else {
      setSuccess(premierContact);
    }

    // Langue de l'infolettre
    if (langueInfolettre.value === "") {
      setError(
        langueInfolettre,
        "Veuillez choisir une langue pour l'infolettre.",
      );
      noError = false;
    } else {
      setSuccess(langueInfolettre);
    }

    // Contenu de préférence (groupe de boutons radio)
    const contenuChoisi = [...radiosContenu].some((radio) => radio.checked);
    if (!contenuChoisi) {
      setError(radiosContenu[0], "Veuillez choisir une option de contenu.");
      noError = false;
    } else {
      setSuccess(radiosContenu[0]);
    }

    // Conditions d'utilisation
    if (!conditionsUtilisation.checked) {
      setError(
        conditionsUtilisation,
        "Veuillez accepter les conditions d'utilisation.",
      );
      noError = false;
    } else {
      setSuccess(conditionsUtilisation);
    }

    return noError;
  };

  /* --------------------------------------------------------------
     Fonctions utilitaires
     -------------------------------------------------------------- */

  // Calcule l'âge à partir d'une valeur d'input date (format "AAAA-MM-JJ").
  // On découpe la chaîne au lieu de faire new Date("2000-01-15") :
  // cette syntaxe est interprétée en UTC par le navigateur, ce qui recule
  // la date d'une journée dans le fuseau de Montréal.
  const calculerAge = (valeurISO) => {
    const [annee, mois, jour] = valeurISO.split("-").map(Number);
    const dateNaissance = new Date(annee, mois - 1, jour);
    const dateAujourdhui = new Date();

    let age = dateAujourdhui.getFullYear() - dateNaissance.getFullYear();
    const differenceMois = dateAujourdhui.getMonth() - dateNaissance.getMonth();
    const differenceJour = dateAujourdhui.getDate() - dateNaissance.getDate();

    // L'anniversaire n'est pas encore passé cette année
    if (differenceMois < 0 || (differenceMois === 0 && differenceJour < 0)) {
      age--;
    }

    return age;
  };

  // Place le focus sur le premier champ en erreur pour aider
  // l'utilisateur (et les lecteurs d'écran) à trouver quoi corriger.
  const focusPremierChampFautif = () => {
    const champFautif = form.querySelector(
      ".formulaire__champ--erreur .formulaire__saisie",
    );
    if (champFautif) {
      champFautif.focus();
    }
  };

  const setError = (element, message) => {
    const champ = element.closest(".formulaire__champ");
    const errorDisplay = champ.querySelector(".formulaire__erreur");

    errorDisplay.innerText = message;
    champ.classList.add("formulaire__champ--erreur");
    champ.classList.remove("formulaire__champ--succes");
    element.setAttribute("aria-invalid", "true");
  };

  const setSuccess = (element) => {
    const champ = element.closest(".formulaire__champ");
    const errorDisplay = champ.querySelector(".formulaire__erreur");

    errorDisplay.innerText = "";
    champ.classList.add("formulaire__champ--succes");
    champ.classList.remove("formulaire__champ--erreur");
    element.removeAttribute("aria-invalid");
  };
});
