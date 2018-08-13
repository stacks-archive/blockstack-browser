describe('Sign up', () => {
  it('prompts to create a new Blockstack ID', () => {
    cy.visit('/')

    cy.contains('Create a new Blockstack ID')
  })
})
