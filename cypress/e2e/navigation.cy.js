/* global cy */

describe('Navigation et gestion des inscriptions (E2E Réel)', () => {

  it('Scénario Nominal : Ajout d\'un nouvel utilisateur avec succès', () => {
    cy.intercept('GET', '**/users').as('initialLoad');
    cy.visit('/');
    
    cy.wait('@initialLoad').then((interception) => {
      const initialCount = interception.response.body.utilisateurs.length;

      cy.contains(`${initialCount} utilisateur(s) inscrit(s)`, { timeout: 10000 });

      cy.contains("Aller s'inscrire").click();
      cy.url().should('include', '/register');

      const uniqueEmail = `jean.dupont.${Date.now()}@test.com`;

      cy.get('[data-cy="input-lastName"]').type('Dupont');
      cy.get('[data-cy="input-firstName"]').type('Jean');
      cy.get('[data-cy="input-email"]').type(uniqueEmail);
      cy.get('[data-cy="input-birthDate"]').type('1990-01-01');
      cy.get('[data-cy="input-zipCode"]').type('75000');
      cy.get('[data-cy="input-city"]').type('Paris');

      cy.intercept('POST', '**/users').as('postUser');
      cy.get('[data-cy="submit-btn"]').click();
      cy.wait('@postUser');

      cy.url().should('not.include', '/register');
      
      // On vérifie que le compteur a bien été incrémenté de 1
      cy.contains(`${initialCount + 1} utilisateur(s) inscrit(s)`, { timeout: 10000 });
      cy.contains('Jean Dupont', { timeout: 10000 });
    });
  });

  it('Scénario d\'Erreur : Tentative d\'ajout invalide (Validation Frontend)', () => {
    cy.visit('/register');

    cy.get('[data-cy="input-email"]').type('email-invalide').blur();
    cy.get('[data-cy="error-email"]').should('be.visible').and('not.be.empty');
    cy.get('[data-cy="submit-btn"]').should('be.disabled');
  });

  it('Scénario d\'Erreur Métier : Affichage du message si l\'email existe déjà (400)', () => {
    const existingEmail = `existant.reel.${Date.now()}@test.com`;

    cy.visit('/register');
    cy.get('[data-cy="input-lastName"]').type('Doe');
    cy.get('[data-cy="input-firstName"]').type('John');
    cy.get('[data-cy="input-email"]').type(existingEmail);
    cy.get('[data-cy="input-birthDate"]').type('1990-01-01');
    cy.get('[data-cy="input-zipCode"]').type('75000');
    cy.get('[data-cy="input-city"]').type('Paris');

    cy.intercept('POST', '**/users').as('postFirstUser');
    cy.get('[data-cy="submit-btn"]').click();
    cy.wait('@postFirstUser').its('response.statusCode').should('be.oneOf', [200, 201]);
    
    cy.url().should('not.include', '/register');

    cy.visit('/register');
    cy.get('[data-cy="input-lastName"]').type('Smith');
    cy.get('[data-cy="input-firstName"]').type('Jane');
    cy.get('[data-cy="input-email"]').type(existingEmail);
    cy.get('[data-cy="input-birthDate"]').type('1995-05-05');
    cy.get('[data-cy="input-zipCode"]').type('69000');
    cy.get('[data-cy="input-city"]').type('Lyon');

    cy.intercept('POST', '**/users').as('postSecondUser');
    cy.get('[data-cy="submit-btn"]').click();
    cy.wait('@postSecondUser').its('response.statusCode').should('eq', 400);

    cy.contains('Cet email existe déjà.', { timeout: 10000 }).should('be.visible');
    cy.url().should('include', '/register');
  });

});
