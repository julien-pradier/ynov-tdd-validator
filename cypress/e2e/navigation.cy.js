/* global cy */

describe('Navigation et gestion des inscriptions (E2E)', () => {

  // ==========================================
  // SCÉNARIO 1 : NOMINAL (SUCCÈS)
  // ==========================================
  it('Scénario Nominal : Ajout d\'un nouvel utilisateur avec succès', () => {

    // On intercepte le GET initial (liste vide)
    cy.intercept('GET', '**/users', {
      statusCode: 200,
      body: []
    }).as('apiGetUsers');

    cy.visit('/');

    cy.get('[data-cy="counter"]').should('contain', '0 utilisateur(s) inscrit(s)');

    cy.contains("Aller s'inscrire").click();
    cy.url().should('include', '/register');

    // CORRECTION DU MOCK : On renvoie firstName et lastName pour correspondre à l'état React
    cy.intercept('POST', '**/users', {
      statusCode: 201,
      body: {
        id: 11,
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@test.com'
      }
    }).as('apiRegister');

    cy.get('[data-cy="input-lastName"]').type('Dupont');
    cy.get('[data-cy="input-firstName"]').type('Jean');
    cy.get('[data-cy="input-email"]').type('jean.dupont@test.com');
    cy.get('[data-cy="input-birthDate"]').type('1990-01-01');
    cy.get('[data-cy="input-zipCode"]').type('75000');
    cy.get('[data-cy="input-city"]').type('Paris');

    cy.get('[data-cy="submit-btn"]').click();

    cy.wait('@apiRegister');

    // Vérification du retour à l'accueil et de la mise à jour du compteur
    cy.url().should('not.include', '/register');
    cy.contains('1 utilisateur(s) inscrit(s)');
    cy.contains('Jean Dupont');
  });


  // ==========================================
  // SCÉNARIO 2 : ERREUR DE VALIDATION FRONTEND
  // ==========================================
  it('Scénario d\'Erreur : Tentative d\'ajout invalide (Validation Frontend)', () => {

    // Ici le mock GET utilise 'name' car App.js le split automatiquement au montage
    cy.intercept('GET', '**/users', {
      statusCode: 200,
      body: [{
        id: 1,
        name: 'Utilisateur Existant',
        email: 'test@test.com',
        address: { zipcode: '12345', city: 'Lyon' }
      }]
    }).as('apiGetUsers');

    cy.visit('/');

    cy.contains('1 utilisateur(s) inscrit(s)');
    cy.contains("Aller s'inscrire").click();

    // On teste un email invalide
    cy.get('[data-cy="input-email"]').type('email-invalide').blur();
    cy.get('[data-cy="error-email"]').should('be.visible').and('not.be.empty');
    cy.get('[data-cy="submit-btn"]').should('be.disabled');

    // Retour à l'accueil pour vérifier que rien n'a bougé
    cy.visit('/');
    cy.contains('1 utilisateur(s) inscrit(s)');
    cy.get('body').should('not.contain', 'email-invalide');
  });

  // ==========================================
  // SCÉNARIO 3 : ERREUR MÉTIER (400 - EMAIL DÉJÀ PRIS)
  // ==========================================
  it('Scénario d\'Erreur Métier : Affichage du message si l\'email existe déjà (400)', () => {

    cy.intercept('GET', '**/users', { statusCode: 200, body: [] });
    cy.visit('/register');

    // On simule l'erreur 400 renvoyée par le serveur
    cy.intercept('POST', '**/users', {
      statusCode: 400,
      body: { message: "Email already exists" }
    }).as('apiError400');

    cy.get('[data-cy="input-lastName"]').type('Doe');
    cy.get('[data-cy="input-firstName"]').type('John');
    cy.get('[data-cy="input-email"]').type('existant@test.com');
    cy.get('[data-cy="input-birthDate"]').type('1990-01-01');
    cy.get('[data-cy="input-zipCode"]').type('75000');
    cy.get('[data-cy="input-city"]').type('Paris');

    cy.get('[data-cy="submit-btn"]').click();
    cy.wait('@apiError400');

    // On vérifie que le message spécifique du back s'affiche
    cy.contains('Cet email existe déjà.').should('be.visible');
    cy.url().should('include', '/register');
  });

  // ==========================================
  // SCÉNARIO 4 : ERREUR RÉSEAU (API EN PANNE - 500)
  // ==========================================
  it('Scénario d\'Erreur Réseau : Affichage du message en cas de panne serveur (500)', () => {

    cy.intercept('GET', '**/users', { statusCode: 200, body: [] });
    cy.visit('/register');

    cy.intercept('POST', '**/users', {
      statusCode: 500,
      body: { message: "Internal Server Error" }
    }).as('apiError500');

    cy.get('[data-cy="input-lastName"]').type('Doe');
    cy.get('[data-cy="input-firstName"]').type('John');
    cy.get('[data-cy="input-email"]').type('john.doe@test.com');
    cy.get('[data-cy="input-birthDate"]').type('1990-01-01');
    cy.get('[data-cy="input-zipCode"]').type('75000');
    cy.get('[data-cy="input-city"]').type('Paris');

    cy.get('[data-cy="submit-btn"]').click();
    cy.wait('@apiError500');

    cy.contains('Une erreur réseau est survenue. Veuillez réessayer.').should('be.visible');
    cy.url().should('include', '/register');
  });

});