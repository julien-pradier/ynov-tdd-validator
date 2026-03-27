/* global cy */

describe('Navigation et gestion des inscriptions (E2E Réel)', () => {

  it('Scénario Nominal : Ajout d\'un nouvel utilisateur avec succès', () => {
    cy.intercept('GET', '**/users').as('getUsers');
    cy.visit('/');
    cy.wait('@getUsers').its('response.statusCode').should('eq', 200);

    cy.get('body').should('be.visible');
    cy.contains(/inscrire/i).click();
    cy.url().should('include', '/register');

    const uniqueEmail = `jean.dupont.${Date.now()}@test.com`;

    cy.get('form').should('be.visible');
    cy.get('form input').eq(0).type('Dupont', { force: true });
    cy.get('form input').eq(1).type('Jean', { force: true });
    cy.get('form input').eq(2).type(uniqueEmail, { force: true });
    cy.get('form input').eq(3).type('1990-01-01', { force: true });
    cy.get('form input').eq(4).type('75000', { force: true });
    cy.get('form input').eq(5).type('Paris', { force: true });

    cy.intercept('POST', '**/users').as('postNewUser');
    cy.get('form button').click({ force: true });
    cy.wait('@postNewUser');
    
    cy.url().should('not.include', '/register');
  });

  it('Scénario d\'Erreur : Tentative d\'ajout invalide', () => {
    cy.visit('/register');
    cy.get('form').should('be.visible');
    cy.get('form input').eq(2).type('email-invalide', { force: true }).blur({ force: true });
    cy.get('form button').should('be.disabled');
  });

  it('Scénario d\'Erreur Métier : Affichage du message si l\'email existe déjà (400)', { tags: '@erreur500' }, () => {
    const existingEmail = `existant.reel.${Date.now()}@test.com`;

    cy.visit('/register');
    cy.get('form').should('be.visible');

    cy.get('form input').eq(0).type('Doe', { force: true });
    cy.get('form input').eq(1).type('John', { force: true });
    cy.get('form input').eq(2).type(existingEmail, { force: true });
    cy.get('form input').eq(3).type('1990-01-01', { force: true });
    cy.get('form input').eq(4).type('75000', { force: true });
    cy.get('form input').eq(5).type('Paris', { force: true });

    cy.intercept('POST', '**/users').as('postFirstUser');
    cy.get('form button').click({ force: true });
    cy.wait('@postFirstUser');

    cy.visit('/register');
    cy.get('form').should('be.visible');

    cy.get('form input').eq(0).type('Smith', { force: true });
    cy.get('form input').eq(1).type('Jane', { force: true });
    cy.get('form input').eq(2).type(existingEmail, { force: true });
    cy.get('form input').eq(3).type('1995-05-05', { force: true });
    cy.get('form input').eq(4).type('69000', { force: true });
    cy.get('form input').eq(5).type('Lyon', { force: true });

    cy.intercept('POST', '**/users').as('postSecondUser');
    cy.get('form button').click({ force: true });
    cy.wait('@postSecondUser').its('response.statusCode').should('eq', 400); // Optionnel mais recommandé : vérifier le code d'erreur

    cy.url().should('include', '/register');
  });

});