import { calculateAge, isValidAge, isValidZipCode, isValidName, isValidEmail, isValidProfile } from "./validator.js";

// ==========================================
// 1. CALCULATE AGE (La logique pure)
// ==========================================
describe('Validator - calculateAge (Unit)', () => {
    // Cas passants
    it('doit calculer l\'âge correct (anniversaire passé)', () => {
        const today = new Date();
        const birth = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
        expect(calculateAge(birth)).toBe(20);
    });

    it('doit calculer l\'âge correct (anniversaire demain = -1 an)', () => {
        const today = new Date();
        const birth = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate() + 1);
        expect(calculateAge(birth)).toBe(19);
    });

    // Cas limites et Erreurs (Coverage lines 16-21)
    it('doit rejeter si le paramètre est manquant (null/undefined)', () => {
        expect(() => calculateAge(null)).toThrow("Le paramètre date de naissance est requis");
        expect(() => calculateAge(undefined)).toThrow("Le paramètre date de naissance est requis");
    });

    it('doit rejeter si le paramètre n\'est pas un objet Date (ex: string)', () => {
        expect(() => calculateAge("2000-01-01")).toThrow("Le format de la date est invalide");
        expect(() => calculateAge(123456789)).toThrow("Le format de la date est invalide");
    });

    it('doit rejeter si la date est invalide (Invalid Date)', () => {
        const invalidDate = new Date("ceci n'est pas une date");
        expect(() => calculateAge(invalidDate)).toThrow("La date fournie n'est pas une date valide");
    });

    it('doit rejeter si la date est dans le futur', () => {
        const today = new Date();
        const futureDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
        expect(() => calculateAge(futureDate)).toThrow("La date de naissance ne peut pas être dans le futur");
    });
});

// ==========================================
// 2. AGE VALIDATION (Règles métier)
// ==========================================
describe('Validator - isValidAge', () => {
    it('doit retourner true si majeur', () => {
        const today = new Date();
        const major = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
        expect(isValidAge(major)).toBe(true);
    });

    it('doit throw une erreur si mineur', () => {
        const today = new Date();
        const minor = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate());
        expect(() => isValidAge(minor)).toThrow("Vous devez être majeur");
    });
});

// ==========================================
// 3. ZIP CODE VALIDATION
// ==========================================
describe('Validator - isValidZipCode', () => {
    // Cas passant
    it('doit valider un code postal correct', () => {
        expect(isValidZipCode("75001")).toBe(true);
    });

    // Cas d'erreurs (Coverage lines 57-58)
    it('doit rejeter si manquant (null/undefined)', () => {
        expect(() => isValidZipCode(null)).toThrow("Le code postal est requis");
        expect(() => isValidZipCode(undefined)).toThrow("Le code postal est requis");
    });

    it('doit rejeter si ce n\'est pas une chaine (ex: number)', () => {
        expect(() => isValidZipCode(75001)).toThrow("Le code postal doit être une chaîne de caractères");
    });

    it('doit rejeter si la longueur est incorrecte', () => {
        expect(() => isValidZipCode("75")).toThrow("Le code postal doit contenir exactement 5 chiffres");
    });

    it('doit rejeter si contient des lettres', () => {
        expect(() => isValidZipCode("75A01")).toThrow("Le code postal ne doit contenir que des chiffres");
    });
});

// ==========================================
// 4. NAME VALIDATION
// ==========================================
describe('Validator - isValidName', () => {
    // Cas passant
    it('doit valider un nom correct', () => {
        expect(isValidName("Jean-Pierre")).toBe(true);
    });

    // Cas d'erreurs (Coverage line 70 et alentours)
    it('doit rejeter si manquant (null/undefined)', () => {
        expect(() => isValidName(null)).toThrow("Le nom est requis");
        expect(() => isValidName(undefined)).toThrow("Le nom est requis");
    });

    it('doit rejeter si ce n\'est pas une string (ex: number)', () => {
        expect(() => isValidName(123)).toThrow("Le nom doit être une chaîne de caractères");
    });

    it('doit rejeter une chaine vide', () => {
        expect(() => isValidName("   ")).toThrow("Le nom est requis");
    });

    it('doit rejeter les caractères spéciaux (XSS)', () => {
        expect(() => isValidName("<script>")).toThrow("Le nom ne doit contenir que des lettres");
        expect(() => isValidName("Nom123")).toThrow("Le nom ne doit contenir que des lettres");
    });
});

// ==========================================
// 5. EMAIL VALIDATION
// ==========================================
describe('Validator - isValidEmail', () => {
    // Cas passant
    it('doit valider un email correct', () => {
        expect(isValidEmail("test@ynov.com")).toBe(true);
    });

    // Cas d'erreurs (Coverage lines 87-88)
    it('doit rejeter si manquant (null/undefined)', () => {
        expect(() => isValidEmail(null)).toThrow("L'email est requis");
        expect(() => isValidEmail(undefined)).toThrow("L'email est requis");
    });

    it('doit rejeter si chaine vide', () => {
        expect(() => isValidEmail("  ")).toThrow("L'email est requis");
    });

    it('doit rejeter si ce n\'est pas une string (ex: number)', () => {
        expect(() => isValidEmail(12345)).toThrow("L'email doit être une chaîne de caractères");
    });

    it('doit rejeter un format invalide', () => {
        expect(() => isValidEmail("test.com")).toThrow("L'email doit être valide");
        expect(() => isValidEmail("test@")).toThrow("L'email doit être valide");
    });
});

// ==========================================
// 6. GLOBAL PROFILE (Coverage final)
// ==========================================
describe('Validator - isValidProfile', () => {
    const today = new Date();

    it('doit retourner TRUE pour un profil valide', () => {
        const validProfile = {
            name: "Jean",
            email: "jean@test.com",
            zipCode: "75001",
            birthDate: new Date(today.getFullYear() - 20, 0, 1)
        };
        expect(isValidProfile(validProfile)).toBe(true);
    });

    it('doit retourner FALSE si un champ est invalide', () => {
        const invalidProfile = {
            name: "Jean",
            email: "invalide", // Erreur ici
            zipCode: "75001",
            birthDate: new Date(today.getFullYear() - 20, 0, 1)
        };
        expect(isValidProfile(invalidProfile)).toBe(false);
    });

    it('doit retourner FALSE si l\'input n\'est pas un objet', () => {
        expect(isValidProfile(null)).toBe(false);
        expect(isValidProfile("string")).toBe(false);
    });
});