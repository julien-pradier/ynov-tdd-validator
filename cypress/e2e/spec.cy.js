describe('Scénario : Ajout d\'un utilisateur', () => {
  it('Remplit le formulaire et enregistre un nouvel utilisateur', () => {
    
    cy.visit('/')

    cy.get('input[name="lastName"]').type('Dupont')
    cy.get('input[name="firstName"]').type('Jean')
    cy.get('input[name="email"]').type('jean.dupont@test.com')
    cy.get('input[name="birthDate"]').type('1990-01-01')
    cy.get('input[name="zipCode"]').type('75000')
    cy.get('input[name="city"]').type('Paris')

    cy.contains('Envoyer').click()

    cy.contains('Formulaire sauvegardé avec succès !')
    
  })
})
