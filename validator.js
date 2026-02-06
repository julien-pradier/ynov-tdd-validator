/**
 * Module de validation des données utilisateur
 * Contient les règles métiers pour l'âge, le code postal, l'identité et l'email
 * @module validator
 */

/**
 * Vérifie si une personne est majeure (18 ans ou plus) à la date d'aujourd'hui
 * Effectue un calcul précis au jour près
 *
 * @param {Date} birthDate - La date de naissance de la personne à valider
 * @returns {boolean} Retourne true si la personne a 18 ans révolus
 * @throws {Error} Si le paramètre est manquant, n'est pas une Date, est invalide ou dans le futur
 * @throws {Error} Si la personne est mineure (< 18 ans)
 *
 * @example
 * isValidAge(new Date('2000-01-01')); // returns true
 */

export function isValidAge(birthDate) {
    if (!birthDate) throw new Error("Le paramètre date de naissance est requis");
    if (!(birthDate instanceof Date)) throw new Error("Le format de la date est invalide. Un objet Date est attendu");

    const today = new Date();

    if (isNaN(birthDate.getTime())) throw new Error("La date fournie n'est pas une date valide");
    if (birthDate > today) throw new Error("La date de naissance ne peut pas être dans le futur");

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    if (age < 18) throw new Error("Vous devez être majeur");
    return true;
}

/**
 * Valide le format d'un code postal français
 * Doit être une chaîne de caractères contenant exactement 5 chiffres
 *
 * @param {string} zipCode - La chaîne représentant le code postal (ex: "75001")
 * @returns {boolean} Retourne true si le format est valide
 * @throws {Error} Si le paramètre est manquant, n'est pas une chaîne, a une mauvaise longueur ou contient des lettres
 *
 * @example
 * isValidZipCode("75001"); // returns true
 * isValidZipCode("06000"); // returns true
 */

export function isValidZipCode(zipCode) {
    if (!zipCode) throw new Error("Le code postal est requis");
    if (typeof zipCode !== 'string') throw new Error("Le code postal doit être une chaîne de caractères");
    if (zipCode.length !== 5) throw new Error("Le code postal doit contenir exactement 5 chiffres");
    if (!/^\d+$/.test(zipCode)) throw new Error("Le code postal ne doit contenir que des chiffres");
    return true;
}

/**
 * Valide un nom ou un prénom selon les règles d'identité standard
 * Autorise les lettres, accents, tirets et espaces. Interdit les chiffres et les caractères spéciaux (protection XSS)
 *
 * @param {string} name - Le nom ou prénom à valider
 * @returns {boolean} Retourne true si le nom respecte les critères
 * @throws {Error} Si le nom est vide, n'est pas une chaîne ou contient des caractères interdits
 *
 * @example
 * isValidName("Jean-Pierre"); // returns true
 * isValidName("Noël"); // returns true
 */

export function isValidName(name) {
    if (typeof name !== 'string') {
        if (typeof name === 'number') throw new Error("Le nom doit être une chaîne de caractères");
        throw new Error("Le nom est requis");
    }

    if (name.trim() === '') throw new Error("Le nom est requis");

    const nameRegex = /^[a-zA-ZÀ-ÿ\s-]+$/;
    if (!nameRegex.test(name)) throw new Error("Le nom ne doit contenir que des lettres, accents, espaces ou tirets");
    return true;
}

/**
 * Valide le format d'une adresse email standard
 * Vérifie la présence de l'arobase, du domaine et de l'extension
 *
 * @param {string} email - L'adresse email à valider
 * @returns {boolean} Retourne true si le format est valide
 * @throws {Error} Si l'email est vide, n'est pas une chaîne ou a un format incorrect
 *
 * @example
 * isValidEmail("contact@ynov.com"); // returns true
 */

export function isValidEmail(email) {
    if (!email) throw new Error("L'email est requis");
    if (typeof email !== 'string') throw new Error("L'email doit être une chaîne de caractères");
    if (email.trim() === '') throw new Error("L'email est requis");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailRegex.test(email)) {
        throw new Error("L'email doit être valide (ex: user@domain.com)");
    }

    return true;
}