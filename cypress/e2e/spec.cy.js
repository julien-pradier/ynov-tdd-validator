describe('Fonctionnalité : Gestion des inscriptions', () => {

  // --- SCÉNARIO 1 ---
  it('Scénario 1 : Ajout d\'un nouvel utilisateur avec succès', () => {
    cy.visit('/', {
      onBeforeLoad: (window) => {
        window.localStorage.clear()
      }
    })
    
    cy.get('input[name="lastName"]').type('Dupont')
    cy.get('input[name="firstName"]').type('Jean')
    cy.get('input[name="email"]').type('jean.dupont@test.com')
    cy.get('input[name="birthDate"]').type('1990-01-01')
    cy.get('input[name="zipCode"]').type('75000')
    cy.get('input[name="city"]').type('Paris')

    cy.contains('Envoyer').click()

    cy.contains('Formulaire sauvegardé avec succès !')
  })

  // --- SCÉNARIO 2 ---
  it('Scénario 2 : Tentative d\'ajout avec erreur (champs manquants)', () => {
    cy.visit('/', {
      onBeforeLoad: (window) => {
        const fakeUser = {
          lastName: 'Existing',
          firstName: 'User',
          email: 'existing@test.com',
          birthDate: '1980-01-01',
          zipCode: '12345',
          city: 'OldCity'
        }
        window.localStorage.setItem('user_data', JSON.stringify(fakeUser))
      }
    })

    cy.get('input[name="lastName"]').type('Nouveau')
    cy.get('input[name="firstName"]').type('Test')

    cy.contains('Envoyer').should('be.disabled')

    cy.window().then((window) => {
      const storedUser = JSON.parse(window.localStorage.getItem('user_data'))
      expect(storedUser.lastName).to.equal('Existing')
    })
  })

  // --- SCÉNARIO 3 ---
  it('Scénario 3 : Vérification de la documentation JSDoc', () => {
    cy.visit('/ynov-tdd-validator/docs/')

    cy.contains('App').should('exist')
    cy.contains('validator').should('exist')
  })

})
