describe('Sign in', () => {
  const key = 'reward sword own useless extend upset wife combine route fan misery promote'
  it('restores a Blockstack ID', () => {
    cy.visit('/')

    // The force: true object is needed as sometimes
    // Cypress reports that the target element is 
    // invisible (height = 0 and width = 0)
    cy.get('a > div').contains('existing ID').click({force: true})

    cy.get('textarea[name="recoveryKey"]').type(key)

    cy.get('button').click()

    cy.get('input[name="password"]').type('abcd1234')

    cy.get('input[name="passwordConfirm"]').type('abcd1234')

    cy.get('button').click()

    cy.get('input[name="email"]').type('fake@email.comj')

    cy.get('button').click()

    cy.contains('Restoring')

    // Use cy.wait() to allow time for page to load
    // This should be replaced with a promise
    // https://stackoverflow.com/questions/47299968/cypress-with-systemjs
    cy.wait(10000)
    cy.get('h2').contains('temporary_new_testing_id')

    cy.get('div').contains('Go to Blockstack').click({force: true})
  })
})
