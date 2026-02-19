describe('Navigation et gestion des inscriptions (E2E)', () => {

  // ==========================================
  // SCÉNARIO 1 : NOMINAL (SUCCÈS)
  // ==========================================
  it('Scénario Nominal : Ajout d\'un nouvel utilisateur avec succès', () => {

    // 1. Navigation vers l'Accueil (/)
    cy.visit('/', {
      onBeforeLoad: (window) => {
        window.localStorage.clear() // On démarre avec une base vierge
      }
    })

    // 2. Vérifier "0 utilisateur(s) inscrit(s)" et liste vide
    cy.get('[data-cy="counter"]').should('contain', '0 utilisateur(s) inscrit(s)')
    cy.get('[data-cy="user-list"]').should('not.exist') // La liste (<ul>) ne doit pas être affichée

    // 3. Clic/Navigation vers le Formulaire (/register)
    cy.get('[data-cy="nav-register"]').click()
    cy.url().should('include', '/register') // Vérifie qu'on a bien changé de page

    // 4. Ajout d'un nouvel utilisateur valide
    cy.get('[data-cy="input-lastName"]').type('Dupont')
    cy.get('[data-cy="input-firstName"]').type('Jean')
    cy.get('[data-cy="input-email"]').type('jean.dupont@test.com')
    cy.get('[data-cy="input-birthDate"]').type('1990-01-01')
    cy.get('[data-cy="input-zipCode"]').type('75000')
    cy.get('[data-cy="input-city"]').type('Paris')

    cy.get('[data-cy="submit-btn"]').click()

    // 5. Redirection automatique vers l'Accueil et vérification des données
    cy.url().should('eq', Cypress.config().baseUrl + '/') // S'assure qu'on est de retour sur l'accueil
    cy.get('[data-cy="counter"]').should('contain', '1 utilisateur(s) inscrit(s)')
    cy.get('[data-cy="user-list"]').should('contain', 'Jean Dupont') // Vérifie la présence dans la liste
  })


  // ==========================================
  // SCÉNARIO 2 : ERREUR
  // ==========================================
  it('Scénario d\'Erreur : Tentative d\'ajout invalide et maintien de l\'état', () => {

    // 1. Partant de l'état précédent (1 inscrit)
    cy.visit('/', {
      onBeforeLoad: (window) => {
        const fakeUser = [{
          lastName: 'Existant',
          firstName: 'Utilisateur',
          email: 'test@test.com',
          birthDate: '1980-01-01',
          zipCode: '12345',
          city: 'Lyon'
        }]
        window.localStorage.setItem('users', JSON.stringify(fakeUser))
      }
    })

    // Vérification de l'état initial
    cy.get('[data-cy="counter"]').should('contain', '1 utilisateur(s) inscrit(s)')

    // 2. Navigation vers le Formulaire
    cy.get('[data-cy="nav-register"]').click()

    // 3. Tentative d'ajout invalide -> Vérifier l'erreur affichée
    // On tape un email invalide puis on clique ailleurs (blur) pour déclencher l'affichage de l'erreur
    cy.get('[data-cy="input-email"]').type('email-invalide').blur()

    // On vérifie que le message d'erreur rouge apparaît bien
    cy.get('[data-cy="error-email"]').should('be.visible').and('not.be.empty')

    // On vérifie que le bouton est bien bloqué pour empêcher la soumission
    cy.get('[data-cy="submit-btn"]').should('be.disabled')

    // 4. Retour vers l'Accueil
    // Puisque le bouton est bloqué, l'utilisateur décide d'annuler et de retourner à l'accueil
    cy.visit('/')

    // 5. Vérifier "Toujours 1 utilisateur inscrit" et la liste inchangée
    cy.get('[data-cy="counter"]').should('contain', '1 utilisateur(s) inscrit(s)')
    cy.get('[data-cy="user-list"]').should('contain', 'Utilisateur Existant')
    cy.get('[data-cy="user-list"]').should('not.contain', 'email-invalide') // On s'assure que la mauvaise donnée n'est pas là
  })

})