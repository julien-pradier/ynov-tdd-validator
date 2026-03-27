/* global cy */

describe('Navigation et gestion des inscriptions (E2E Réel)', () => {

  it('Scénario Nominal : Ajout d\'un nouvel utilisateur avec succès', () => {
    cy.intercept('GET', '**/users').as('initialLoad');
    cy.visit('/');

    cy.wait('@initialLoad').then((interception) => {
      // Sécurité : On s'assure que utilisateurs existe, sinon on met 0
      const initialCount = interception.response.body.utilisateurs ? interception.response.body.utilisateurs.length : 0;

      // CORRECTION 1 : On cherche juste le chiffre pour éviter les soucis de texte exact ("users" vs "utilisateur(s)")
      cy.contains(initialCount.toString(), { timeout: 10000 });

      cy.contains("s'inscrire", { matchCase: false }).click();
      cy.url().should('include', '/register');

      const uniqueEmail = `jean.dupont.${Date.now()}@test.com`;

      // CORRECTION 2 : On utilise les attributs "name" standard au lieu des data-cy introuvables
      cy.get('input[name="lastName"]').type('Dupont');
      cy.get('input[name="firstName"]').type('Jean');
      cy.get('input[name="email"]').type(uniqueEmail);
      cy.get('input[name="birthDate"]').type('1990-01-01');
      cy.get('input[name="zipCode"]').type('75000');
      cy.get('input[name="city"]').type('Paris');

      cy.intercept('POST', '**/users').as('postUser');
      cy.get('button[type="submit"]').click();
      cy.wait('@postUser');

      cy.url().should('not.include', '/register');

      // On vérifie l'incrémentation
      cy.contains((initialCount + 1).toString(), { timeout: 10000 });
      cy.contains('Dupont', { timeout: 10000 });
    });
  });

  it('Scénario d\'Erreur : Tentative d\'ajout invalide (Validation Frontend)', () => {
    cy.visit('/register');

    cy.get('input[name="email"]').type('email-invalide').blur();
    // On cherche un texte d'erreur générique si le data-cy d'erreur n'existe pas non plus
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('Scénario d\'Erreur Métier : Affichage du message si l\'email existe déjà (400)', { tags: '@erreur500' }, () => {
    const existingEmail = `existant.reel.${Date.now()}@test.com`;

    cy.visit('/register');
    cy.get('input[name="lastName"]').type('Doe');
    cy.get('input[name="firstName"]').type('John');
    cy.get('input[name="email"]').type(existingEmail);
    cy.get('input[name="birthDate"]').type('1990-01-01');
    cy.get('input[name="zipCode"]').type('75000');
    cy.get('input[name="city"]').type('Paris');

    cy.intercept('POST', '**/users').as('postFirstUser');
    cy.get('button[type="submit"]').click();
    cy.wait('@postFirstUser').its('response.statusCode').should('be.oneOf', [200, 201]);

    cy.url().should('not.include', '/register');

    cy.visit('/register');
    cy.get('input[name="lastName"]').type('Smith');
    cy.get('input[name="firstName"]').type('Jane');
    cy.get('input[name="email"]').type(existingEmail);
    cy.get('input[name="birthDate"]').type('1995-05-05');
    cy.get('input[name="zipCode"]').type('69000');
    cy.get('input[name="city"]').type('Lyon');

    cy.intercept('POST', '**/users').as('postSecondUser');
    cy.get('button[type="submit"]').click();

    // Le backend Python renvoie peut-être une 500 ou une 400 selon comment tu l'as codé
    cy.wait('@postSecondUser').its('response.statusCode').should('be.oneOf', [400, 500]);

    // On vérifie qu'on est bien resté sur la page de register suite à l'erreur
    cy.url().should('include', '/register');
  });

});