import { isValidAge, isValidZipCode, isValidName, isValidEmail } from "./validator.js";

// --- AGE VALIDATION ---
describe('Validator - Age Validation', () => {

    it('doit valider (return true) si la personne a exactement 18 ans', () => {
        const today = new Date();
        const majorPerson = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
        expect(isValidAge(majorPerson)).toBe(true);
    });

    it('doit valider si la personne a plus de 18 ans', () => {
        const adult = new Date("2000-01-01");
        expect(isValidAge(adult)).toBe(true);
    });

    it('doit renvoyer une erreur si la personne est mineure', () => {
        const today = new Date();
        const minorPerson = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate() + 1);
        expect(() => isValidAge(minorPerson)).toThrow("Vous devez être majeur");
    });

    it('doit renvoyer une erreur si le paramètre est manquant ou invalide', () => {
        expect(() => isValidAge(null)).toThrow("Le paramètre date de naissance est requis");
        expect(() => isValidAge("pas une date")).toThrow("Le format de la date est invalide");
    });

    it('doit renvoyer une erreur si la date est invalide', () => {
        const invalidDate = new Date("ceci n'est pas une date");
        expect(() => isValidAge(invalidDate)).toThrow("La date fournie n'est pas une date valide");
    });

    it('doit renvoyer une erreur si la date est dans le futur', () => {
        const today = new Date();
        const futureDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
        expect(() => isValidAge(futureDate)).toThrow("La date de naissance ne peut pas être dans le futur");
    });
});

// --- ZIP CODE VALIDATION ---
describe('Validator - Zip Code Validation', () => {
    it('doit valider un code postal correct', () => {
        expect(isValidZipCode("75001")).toBe(true);
        expect(isValidZipCode("06000")).toBe(true);
    });
    it('doit rejeter si le format n\'est pas une chaine', () => {
        expect(() => isValidZipCode(75001)).toThrow("Le code postal doit être une chaîne de caractères");
        expect(() => isValidZipCode(null)).toThrow("Le code postal est requis");
    });
    it('doit rejeter si la longueur n\'est pas de 5 caractères', () => {
        expect(() => isValidZipCode("75")).toThrow("Le code postal doit contenir exactement 5 chiffres");
        expect(() => isValidZipCode("750000")).toThrow("Le code postal doit contenir exactement 5 chiffres");
    });
    it('doit rejeter si contient des lettres', () => {
        expect(() => isValidZipCode("75A01")).toThrow("Le code postal ne doit contenir que des chiffres");
    });
});

// --- NAME VALIDATION ---
describe('Validator - Name Validation', () => {

    it('doit valider un nom classique', () => {
        expect(isValidName("Thomas")).toBe(true);
        expect(isValidName("Martin")).toBe(true);
    });

    it('doit valider un nom composé ou avec accents', () => {
        expect(isValidName("Jean-Pierre")).toBe(true);
        expect(isValidName("Hélène")).toBe(true);
    });

    it('doit valider un nom avec des espaces', () => {
        expect(isValidName("De Gaulle")).toBe(true);
    });

    it('doit rejeter un nom contenant des chiffres', () => {
        expect(() => isValidName("Thomas123")).toThrow("Le nom ne doit contenir que des lettres, accents, espaces ou tirets");
    });

    it('doit rejeter un nom contenant des caractères spéciaux', () => {
        expect(() => isValidName("Thomas!")).toThrow("Le nom ne doit contenir que des lettres, accents, espaces ou tirets");
    });

    it('doit rejeter formellement les tentatives d\'injection XSS (<script>)', () => {
        expect(() => isValidName("<script>alert('hack')</script>")).toThrow("Le nom ne doit contenir que des lettres, accents, espaces ou tirets");
    });

    it('doit rejeter les valeurs vides ou invalides', () => {
        expect(() => isValidName(null)).toThrow("Le nom est requis");
        expect(() => isValidName(undefined)).toThrow("Le nom est requis");
        expect(() => isValidName("")).toThrow("Le nom est requis");
        expect(() => isValidName(123)).toThrow("Le nom doit être une chaîne de caractères");
    });
});

// --- EMAIL VALIDATION ---
describe('Validator - Email Validation', () => {

    it('doit valider un email standard', () => {
        expect(isValidEmail("test@example.com")).toBe(true);
        expect(isValidEmail("prenom.nom@ynov.com")).toBe(true);
    });

    it('doit valider un email avec tiret ou chiffre', () => {
        expect(isValidEmail("test-123@sub.domain.org")).toBe(true);
    });

    it('doit rejeter un email sans @', () => {
        expect(() => isValidEmail("testexample.com")).toThrow("L'email doit être valide (ex: user@domain.com)");
    });

    it('doit rejeter un email sans extension ou domaine', () => {
        expect(() => isValidEmail("test@")).toThrow("L'email doit être valide (ex: user@domain.com)");
        expect(() => isValidEmail("test@domain")).toThrow("L'email doit être valide (ex: user@domain.com)");
    });

    // Edge Cases
    it('doit rejeter les valeurs nulles, vides ou non-string', () => {
        expect(() => isValidEmail(null)).toThrow("L'email est requis");
        expect(() => isValidEmail("")).toThrow("L'email est requis");
        expect(() => isValidEmail(12345)).toThrow("L'email doit être une chaîne de caractères");
        expect(() => isValidEmail("   ")).toThrow("L'email est requis");
    });
});