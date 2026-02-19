describe('Navigation et gestion des inscriptions (E2E)', () => {

  // ==========================================
  // SCÉNARIO 1 : NOMINAL (SUCCÈS)
  // ==========================================
  it('Scénario Nominal : Ajout d\'un nouvel utilisateur avec succès', () => {

    cy.visit('/', {
      onBeforeLoad: (window) => {
        window.localStorage.clear() // On démarre avec une base vierge
      }
    })

    cy.get('[data-cy="counter"]').should('contain', '0 utilisateur(s) inscrit(s)')
    cy.get('[data-cy="user-list"]').should('not.exist') // La liste (<ul>) ne doit pas être affichée

    cy.contains("Aller s'inscrire").click()
    cy.url().should('include', '/register') // Vérifie qu'on a bien changé de page

    cy.get('[data-cy="input-lastName"]').type('Dupont')
    cy.get('[data-cy="input-firstName"]').type('Jean')
    cy.get('[data-cy="input-email"]').type('jean.dupont@test.com')
    cy.get('[data-cy="input-birthDate"]').type('1990-01-01')
    cy.get('[data-cy="input-zipCode"]').type('75000')
    cy.get('[data-cy="input-city"]').type('Paris')

    cy.get('[data-cy="submit-btn"]').click()


    cy.url().should('not.include', '/register')
    
    cy.contains('1 utilisateur(s) inscrit(s)')
    cy.contains('Jean Dupont') // Vérifie la présence dans la liste
  })


  // ==========================================
  // SCÉNARIO 2 : ERREUR
  // ==========================================
  it('Scénario d\'Erreur : Tentative d\'ajout invalide et maintien de l\'état', () => {

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

    cy.contains('1 utilisateur(s) inscrit(s)')

    cy.contains("Aller s'inscrire").click()

    cy.get('[data-cy="input-email"]').type('email-invalide').blur()

    cy.get('[data-cy="error-email"]').should('be.visible').and('not.be.empty')

    cy.get('[data-cy="submit-btn"]').should('be.disabled')

    cy.visit('/')

    cy.contains('1 utilisateur(s) inscrit(s)')
    cy.contains('Utilisateur Existant')
    cy.get('body').should('not.contain', 'email-invalide') // On s'assure que la mauvaise donnée n'est pas là
  })

})
