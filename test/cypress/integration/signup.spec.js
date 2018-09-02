describe('Sign up', () => {

  it('shows HomeScreenPage', () => {
    cy.visit('/')

    cy.contains('Home')
  })

  it('create new Blockstack ID workflow', () => {
    cy.visit('/')

    cy.get('div').contains('Create a new Blockstack ID').click()

    cy.contains('What is your email address?')

    cy.get('input[type="email"]').type('fake@email.com')

    cy.get('button').click()

    cy.get('h2').contains('Create a password')

    cy.get('input[name="password"]').type('abcd1234')

    cy.get('input[name="passwordConfirm"]').type('abcd1234')

    cy.get('button').click()

    cy.contains('Register a username')

    // TODO: mock out function call to register a username
  })
})
