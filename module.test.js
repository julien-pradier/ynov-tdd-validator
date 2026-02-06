import { calculateAge } from "./module.js";

describe('calculateAge - Suite Complète', () => {

    // --- CAS NOMINAUX (HAPPY PATH) ---

    // 1. Cas où l'anniversaire est DÉJÀ passé (ex: né le 1er Janvier)
    it('should return the correct age for a person born in 2000 (birthday passed)', () => {
        const birthDate = new Date("2000-01-01");
        const today = new Date();
        const expectedAge = today.getFullYear() - 2000;

        expect(calculateAge({ birth: birthDate })).toEqual(expectedAge);
    });

    // 2. [AJOUTÉ] Cas où l'anniversaire n'est PAS ENCORE passé (ex: né demain il y a 30 ans)
    // C'est ce test qui permet d'atteindre 100% de couverture (ligne age--)
    it('should return (age - 1) if the birthday has not passed yet this year', () => {
        const today = new Date();
        const ageTheoretical = 30;

        // On crée une date : Année - 30, Même mois, mais Jour + 1 (donc demain)
        const birthDate = new Date(today.getFullYear() - ageTheoretical, today.getMonth(), today.getDate() + 1);

        // La personne a encore 29 ans
        expect(calculateAge({ birth: birthDate })).toEqual(ageTheoretical - 1);
    });

    // --- GESTION DES EFFETS DE BORD (EDGE CASES) ---

    // 3. "Aucun argument n'a été envoyé"
    it('should throw an error if no parameter is provided', () => {
        expect(() => calculateAge()).toThrow("missing param p");
    });

    // 4. "Le format envoyé n'est pas un objet"
    it('should throw an error if parameter is not an object', () => {
        expect(() => calculateAge("je suis une chaine")).toThrow("param must be an object");
        expect(() => calculateAge(123)).toThrow("param must be an object");
    });

    // 5. "L'objet ne contient pas un champ birth"
    it('should throw an error if birth property is missing', () => {
        expect(() => calculateAge({})).toThrow("missing birth property");
    });

    // 6. "Le champ birth n'est pas une date"
    it('should throw an error if birth is not a Date object', () => {
        const badInput = { birth: "1991-07-11" };
        expect(() => calculateAge(badInput)).toThrow("birth must be a Date object");
    });

    // 7. "La date envoyée est fausse" (Date invalide ou future)
    it('should throw an error if the date is invalid or in the future', () => {
        const invalidDate = { birth: new Date("date invalide") };
        expect(() => calculateAge(invalidDate)).toThrow("invalid date provided");

        const futureDate = { birth: new Date(new Date().getFullYear() + 1, 1, 1) };
        expect(() => calculateAge(futureDate)).toThrow("invalid date provided");
    });

});