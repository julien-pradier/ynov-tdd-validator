/* global cy */

import registerCypressGrep from '@cypress/grep'
registerCypressGrep()

describe('Navigation et gestion des inscriptions (E2E Réel)', () => {

  it('Scénario Nominal : Ajout d\'un nouvel utilisateur avec succès', () => {
    cy.visit('/');

    cy.get('body').should('be.visible');

    cy.contains(/inscrire/i).click();
    cy.url().should('include', '/register');

    const uniqueEmail = `jean.dupont.${Date.now()}@test.com`;

    cy.get('input[type="text"]').eq(0).type('Dupont');
    cy.get('input[type="text"]').eq(1).type('Jean');
    cy.get('input[type="email"]').type(uniqueEmail);
    cy.get('input[type="date"]').type('1990-01-01');
    cy.get('input[type="text"]').eq(2).type('75000');
    cy.get('input[type="text"]').eq(3).type('Paris');

    cy.get('button[type="submit"]').click();

    cy.url().should('not.include', '/register');
  });

  it('Scénario d\'Erreur : Tentative d\'ajout invalide', () => {
    cy.visit('/register');
    cy.get('input[type="email"]').type('email-invalide').blur();
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('Scénario d\'Erreur Métier : Affichage du message si l\'email existe déjà (400)', { tags: '@erreur500' }, () => {
    const existingEmail = `existant.reel.${Date.now()}@test.com`;

    cy.visit('/register');

    cy.get('input[type="text"]').eq(0).type('Doe');
    cy.get('input[type="text"]').eq(1).type('John');
    cy.get('input[type="email"]').type(existingEmail);
    cy.get('input[type="date"]').type('1990-01-01');
    cy.get('input[type="text"]').eq(2).type('75000');
    cy.get('input[type="text"]').eq(3).type('Paris');

    cy.get('button[type="submit"]').click();
    cy.wait(1000);

    cy.visit('/register');
    cy.get('input[type="text"]').eq(0).type('Smith');
    cy.get('input[type="text"]').eq(1).type('Jane');
    cy.get('input[type="email"]').type(existingEmail);
    cy.get('input[type="date"]').type('1995-05-05');
    cy.get('input[type="text"]').eq(2).type('69000');
    cy.get('input[type="text"]').eq(3).type('Lyon');

    cy.get('button[type="submit"]').click();
    cy.wait(1000);

    cy.url().should('include', '/register');
  });

});