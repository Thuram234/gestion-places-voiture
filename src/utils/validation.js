// Normalise une chaîne (supprime les espaces superflus)
const clean = (v) => (v ?? "").trim().replace(/\s+/g, " ");

// Téléphone malgache : 10 chiffres commençant par 03 (ex. 034 12 345 67)
// Les espaces, points et tirets sont tolérés ; le préfixe +261 aussi.
const normalizePhone = (v) => {
  let digits = clean(v).replace(/[\s.-]/g, "");
  if (digits.startsWith("+261")) digits = "0" + digits.slice(4);
  return digits;
};

//const PHONE_REGEX = /^03\d{8}$/;

/**
 * Valide un étudiant.
 * @param {object} data        { matricule, nomPrenom, telephone }
 * @param {Array}  seats       tableau complet des sièges
 * @param {number|null} currentSeatId  place en cours de modification (ignorée pour le contrôle des doublons)
 * @returns {{ errors: object, values: object }}  values = données nettoyées
 */
export function validateStudent(data /*, seats, currentSeatId = null*/) {
  const values = {
    matricule: clean(data.matricule),
    nomPrenom: clean(data.nomPrenom),
    telephone: normalizePhone(data.telephone),
  };
  const errors = {};

  /*  
  if (!values.matricule) {
    errors.matricule = "Le matricule est obligatoire.";
  } else {
    const duplicate = seats.some(
      (s) =>
        s.student &&
        s.id !== currentSeatId &&
        s.student.matricule.toLowerCase() === values.matricule.toLowerCase()
    );
    if (duplicate) errors.matricule = "Ce matricule est déjà enregistré.";
  }
  */

  if (!values.nomPrenom) {
    errors.nomPrenom = "Le nom et prénom sont obligatoires.";
  } else if (values.nomPrenom.length < 2) {
    errors.nomPrenom = "Saisissez au moins 2 caractères.";
  }

  /*
  if (!values.telephone) {
    errors.telephone = "Le numéro de téléphone est obligatoire.";
  } else if (!PHONE_REGEX.test(values.telephone)) {
    errors.telephone = "Format attendu : 03X XX XXX XX (10 chiffres).";
  }
  */

  return { errors, values };
}