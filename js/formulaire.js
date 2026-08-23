document.addEventListener("DOMContentLoaded", () => {
  /* Formulaire */

  const form = document.getElementById("formInscription");
  const prenom = document.getElementById("prenom");
  const nom = document.getElementById("nom");
  const courriel = document.getElementById("courriel");
  const naissance = document.getElementById("naissance");
  const entreprise = document.getElementById("entreprise");
  const secteurActivite = document.getElementById("secteur-activite");
  const tailleEquipe1 = document.getElementById("equipe-1");
  const tailleEquipe2 = document.getElementById("equipe-2-10");
  const tailleEquipe3 = document.getElementById("equipe-11-50");
  const tailleEquipe4 = document.getElementById("equipe-51-ou-plus");
  const tailleEquipe = document.getElementById("taille-equipe");
  const siteWeb = document.getElementById("site-web");
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const passwordConfirmation = document.getElementById("password-confirmation");
  const planChoisi = document.getElementById("plan-choisi");
  const planGratuit = document.getElementById("plan-gratuit");
  const planPro = document.getElementById("plan-pro");
  const planEntreprise = document.getElementById("plan-entreprise");
  const conditionsUtilisation = document.getElementById(
    "conditions-utilisation",
  );

  // empêche le formulaire de se soumettre directement sans passer par notre validation
  // Si validateForm() retourne true (noError = true), le formulaire se soumet
  // Sinon, on communique pourquoi à l'utilisateur
  form.addEventListener("submit", (event) => {
    if (!validateForm()) {
      event.preventDefault();
    }
  });

  // fonction de validation du formulaire
  const validateForm = () => {
    let noError = true;

    // validation prenom
    const prenomValue = prenom.value.trim();
    if (prenomValue === "") {
      setError(prenom, "Votre prénom est requis.");
      noError = false;
    } else {
      setSuccess(prenom);
    }

    // validation nom de famille
    const nomValue = nom.value.trim();
    if (nomValue === "") {
      setError(nom, "Votre nom est requis.");
      noError = false;
    } else {
      setSuccess(nom);
    }

    // validation courriel
    const isValidCourriel = (courriel) => {
      const re =
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
      return re.test(String(courriel).toLowerCase());
    };
    const courrielValue = courriel.value.trim();
    if (courrielValue === "") {
      setError(courriel, "Le courriel est requis.");
      noError = false;
    } else if (!isValidCourriel(courrielValue)) {
      setError(courriel, "Votre courriel n'est pas valide.");
      noError = false;
    } else {
      setSuccess(courriel);
    }

    // validation date de naissance
    const naissanceValue = naissance.value;
    const dateNaissance = new Date(naissanceValue);
    const dateAujourdhui = new Date();
    const differenceJour = dateAujourdhui.getDate() - dateNaissance.getDate();
    const differenceMois = dateAujourdhui.getMonth() - dateNaissance.getMonth();
    let age = dateAujourdhui.getFullYear() - dateNaissance.getFullYear();
    if (differenceMois < 0 || (differenceMois === 0 && differenceJour < 0)) {
      age--;
    }

    if (naissanceValue === "") {
      setError(naissance, "La date de naissance est requise.");
      noError = false;
    } else if (age < 18) {
      setError(naissance, "Vous devez avoir 18 ans ou plus.");
      noError = false;
    } else {
      setSuccess(naissance);
    }

    // validation nom de l'entreprise
    const entrepriseValue = entreprise.value.trim();
    if (entrepriseValue === "") {
      setError(entreprise, "Votre nom d'entreprise est requis.");
      noError = false;
    } else {
      setSuccess(entreprise);
    }

    // validation secteur d'activité
    const secteurActiviteValue = secteurActivite.value;
    if (secteurActiviteValue === "") {
      setError(secteurActivite, "Votre secteur d'activité est requis.");
      noError = false;
    } else {
      setSuccess(secteurActivite);
    }

    // validation taille de l'équipe
    let tailleEquipeChoisi = null;
    if (tailleEquipe1.checked) {
      tailleEquipeChoisi = tailleEquipe1.value;
    } else if (tailleEquipe2.checked) {
      tailleEquipeChoisi = tailleEquipe2.value;
    } else if (tailleEquipe3.checked) {
      tailleEquipeChoisi = tailleEquipe3.value;
    } else if (tailleEquipe4.checked) {
      tailleEquipeChoisi = tailleEquipe4.value;
    }

    if (tailleEquipeChoisi === null) {
      setError(tailleEquipe, "Veuillez choisir une taille d'équipe.");
      noError = false;
    } else {
      setSuccess(tailleEquipe);
    }

    // validation site web
    const siteWebValue = siteWeb.value.trim();
    if (siteWebValue !== "") {
      const isValidUrl = (siteWeb) => {
        const urlRegex =
          /^(https?:\/\/)((?!-)(?!.*--)[a-zA-Z\-0-9]{1,63}(?<!-)\.)+[a-zA-Z]{2,63}(\/[^\s]*)?$/;
        return urlRegex.test(String(siteWeb).toLowerCase());
      };

      if (!isValidUrl(siteWebValue)) {
        setError(siteWeb, "L'adresse de votre site web n'est pas valide.");
        noError = false;
      } else {
        setSuccess(siteWeb);
      }
    }

    // validation nom d'utilisateur
    const usernameValue = username.value.trim();
    if (usernameValue === "") {
      setError(username, "Le nom d'utilisateur est requis.");
      noError = false;
    } else if (usernameValue.length < 3 || usernameValue.length > 20) {
      setError(
        username,
        "Le nom d'utilisateur doit avoir entre 3 et 20 caractères.",
      );
      noError = false;
    } else if (usernameValue.includes(" ")) {
      setError(username, "Le nom d'utilisateur ne peut pas contenir d'espace.");
      noError = false;
    } else {
      setSuccess(username);
    }

    // validation mot de passe
    const isValidPassword = (password) => {
      const passwordRegex = /^(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;
      return passwordRegex.test(String(password));
    };

    const passwordValue = password.value.trim();
    if (passwordValue === "") {
      setError(password, "Le mot de passe est requis.");
      noError = false;
    } else if (!isValidPassword(passwordValue)) {
      setError(
        password,
        "Minimum 8 caractères, 1 majuscule, 1 chiffre, 1 caractère spécial.",
      );
      noError = false;
    } else {
      setSuccess(password);
    }

    // validation de la confirmation du mot de passe
    const passwordConfirmationValue = passwordConfirmation.value.trim();
    if (passwordConfirmationValue === "") {
      setError(
        passwordConfirmation,
        "La confirmation du mot de passe est requis.",
      );
      noError = false;
    } else if (passwordConfirmationValue !== passwordValue) {
      setError(
        passwordConfirmation,
        "La confirmation du mot de passe n'est pas identique au mot de passe.",
      );
      noError = false;
    } else {
      setSuccess(passwordConfirmation);
    }

    // validation du plan choisi
    let planChoisiValue = null;
    if (planGratuit.checked) {
      planChoisiValue = planGratuit.value;
    } else if (planPro.checked) {
      planChoisiValue = planPro.value;
    } else if (planEntreprise.checked) {
      planChoisiValue = planEntreprise.value;
    }

    if (planChoisiValue === null) {
      setError(planChoisi, "Veuillez choisir un plan.");
      noError = false;
    } else {
      setSuccess(planChoisi);
    }

    // validation conditions d'utilisation
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

  const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector(".errorMessage");

    errorDisplay.innerText = message;
    inputControl.classList.add("error");
    inputControl.classList.remove("success");
  };

  const setSuccess = (element) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector(".errorMessage");

    errorDisplay.innerText = "";
    inputControl.classList.add("success");
    inputControl.classList.remove("error");
  };
});
