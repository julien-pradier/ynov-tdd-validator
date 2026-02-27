"use strict";

var _validator = require("./validator.js");
// ==========================================
// 1. CALCULATE AGE (La logique pure)
// ==========================================
describe('Validator - calculateAge (Unit)', () => {
  it('doit calculer l\'âge correct (anniversaire passé)', () => {
    const today = new Date();
    const birth = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate());
    expect((0, _validator.calculateAge)(birth)).toBe(20);
  });
  it('doit calculer l\'âge correct (anniversaire demain = -1 an)', () => {
    const today = new Date();
    const birth = new Date(today.getFullYear() - 20, today.getMonth(), today.getDate() + 1);
    expect((0, _validator.calculateAge)(birth)).toBe(19);
  });

  // Cas limites et Erreurs (Coverage lines 16-21)
  it('doit rejeter si le paramètre est manquant (null/undefined)', () => {
    expect(() => (0, _validator.calculateAge)(null)).toThrow("Le paramètre date de naissance est requis");
    expect(() => (0, _validator.calculateAge)(undefined)).toThrow("Le paramètre date de naissance est requis");
  });
  it('doit rejeter si le paramètre n\'est pas un objet Date (ex: string)', () => {
    expect(() => (0, _validator.calculateAge)("2000-01-01")).toThrow("Le format de la date est invalide");
    expect(() => (0, _validator.calculateAge)(123456789)).toThrow("Le format de la date est invalide");
  });
  it('doit rejeter si la date est invalide (Invalid Date)', () => {
    const invalidDate = new Date("ceci n'est pas une date");
    expect(() => (0, _validator.calculateAge)(invalidDate)).toThrow("La date fournie n'est pas une date valide");
  });
  it('doit rejeter si la date est dans le futur', () => {
    const today = new Date();
    const futureDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
    expect(() => (0, _validator.calculateAge)(futureDate)).toThrow("La date de naissance ne peut pas être dans le futur");
  });
});

// ==========================================
// 2. AGE VALIDATION (Règles métier)
// ==========================================
describe('Validator - isValidAge', () => {
  it('doit retourner true si majeur', () => {
    const today = new Date();
    const major = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    expect((0, _validator.isValidAge)(major)).toBe(true);
  });
  it('doit throw une erreur si mineur', () => {
    const today = new Date();
    const minor = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate());
    expect(() => (0, _validator.isValidAge)(minor)).toThrow("Vous devez être majeur");
  });
});

// ==========================================
// 3. ZIP CODE VALIDATION
// ==========================================
describe('Validator - isValidZipCode', () => {
  it('doit valider un code postal correct', () => {
    expect((0, _validator.isValidZipCode)("75001")).toBe(true);
  });

  // Cas d'erreurs (Coverage lines 57-58)
  it('doit rejeter si manquant (null/undefined)', () => {
    expect(() => (0, _validator.isValidZipCode)(null)).toThrow("Le code postal est requis");
    expect(() => (0, _validator.isValidZipCode)(undefined)).toThrow("Le code postal est requis");
  });
  it('doit rejeter si ce n\'est pas une chaine (ex: number)', () => {
    expect(() => (0, _validator.isValidZipCode)(75001)).toThrow("Le code postal doit être une chaîne de caractères");
  });
  it('doit rejeter si la longueur est incorrecte', () => {
    expect(() => (0, _validator.isValidZipCode)("75")).toThrow("Le code postal doit contenir exactement 5 chiffres");
  });
  it('doit rejeter si contient des lettres', () => {
    expect(() => (0, _validator.isValidZipCode)("75A01")).toThrow("Le code postal ne doit contenir que des chiffres");
  });
});

// ==========================================
// 4. NAME VALIDATION
// ==========================================
describe('Validator - isValidName', () => {
  it('doit valider un nom correct', () => {
    expect((0, _validator.isValidName)("Jean-Pierre")).toBe(true);
  });

  // Cas d'erreurs (Coverage line 70 et alentours)
  it('doit rejeter si manquant (null/undefined)', () => {
    expect(() => (0, _validator.isValidName)(null)).toThrow("Le nom est requis");
    expect(() => (0, _validator.isValidName)(undefined)).toThrow("Le nom est requis");
  });
  it('doit rejeter si ce n\'est pas une string (ex: number)', () => {
    expect(() => (0, _validator.isValidName)(123)).toThrow("Le nom doit être une chaîne de caractères");
  });
  it('doit rejeter une chaine vide', () => {
    expect(() => (0, _validator.isValidName)("   ")).toThrow("Le nom est requis");
  });
  it('doit rejeter les caractères spéciaux (XSS)', () => {
    expect(() => (0, _validator.isValidName)("<script>")).toThrow("Le nom ne doit contenir que des lettres");
    expect(() => (0, _validator.isValidName)("Nom123")).toThrow("Le nom ne doit contenir que des lettres");
  });
});

// ==========================================
// 5. EMAIL VALIDATION
// ==========================================
describe('Validator - isValidEmail', () => {
  it('doit valider un email correct', () => {
    expect((0, _validator.isValidEmail)("test@ynov.com")).toBe(true);
  });

  // Cas d'erreurs (Coverage lines 87-88)
  it('doit rejeter si manquant (null/undefined)', () => {
    expect(() => (0, _validator.isValidEmail)(null)).toThrow("L'email est requis");
    expect(() => (0, _validator.isValidEmail)(undefined)).toThrow("L'email est requis");
  });
  it('doit rejeter si chaine vide', () => {
    expect(() => (0, _validator.isValidEmail)("  ")).toThrow("L'email est requis");
  });
  it('doit rejeter si ce n\'est pas une string (ex: number)', () => {
    expect(() => (0, _validator.isValidEmail)(12345)).toThrow("L'email doit être une chaîne de caractères");
  });
  it('doit rejeter un format invalide', () => {
    expect(() => (0, _validator.isValidEmail)("test.com")).toThrow("L'email doit être valide");
    expect(() => (0, _validator.isValidEmail)("test@")).toThrow("L'email doit être valide");
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
    expect((0, _validator.isValidProfile)(validProfile)).toBe(true);
  });
  it('doit retourner FALSE si un champ est invalide', () => {
    const invalidProfile = {
      name: "Jean",
      email: "invalide",
      // Erreur ici
      zipCode: "75001",
      birthDate: new Date(today.getFullYear() - 20, 0, 1)
    };
    expect((0, _validator.isValidProfile)(invalidProfile)).toBe(false);
  });
  it('doit retourner FALSE si l\'input n\'est pas un objet', () => {
    expect((0, _validator.isValidProfile)(null)).toBe(false);
    expect((0, _validator.isValidProfile)("string")).toBe(false);
  });
});