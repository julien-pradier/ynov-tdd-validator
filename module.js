/**
 * Calcule l'âge d'une personne en années à partir d'un objet contenant sa date de naissance.
 *
 * @param {object} p - L'objet représentant la personne.
 * @param {Date} p.birth - La date de naissance (propriété obligatoire).
 * @returns {number} L'âge de la personne en années révolues.
 * @throws {Error} Si l'objet est invalide, ne contient pas 'birth' ou si la date est incorrecte.
 *
 * @example
 * calculateAge({ birth: new Date("2000-01-01") }); // Returns current age (e.g., 25)
 */

export function calculateAge(p) {
    if (!p) throw new Error("missing param p");
    if (typeof p !== 'object') throw new Error("param must be an object");
    if (!("birth" in p)) throw new Error("missing birth property");
    if (!(p.birth instanceof Date)) throw new Error("birth must be a Date object");

    const now = new Date();
    if (isNaN(p.birth.getTime()) || p.birth > now) {
        throw new Error("invalid date provided");
    }

    let age = now.getFullYear() - p.birth.getFullYear();
    const monthDiff = now.getMonth() - p.birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < p.birth.getDate())) {
        age--;
    }
    return age;
}