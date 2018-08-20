describe('Sign up', () => {
  // With no backup phrase 
  it('prompts to create a new Blockstack ID', () => {
    cy.visit('/')

    cy.contains('Create a new Blockstack ID')
		cy.get()
  })

  var storageMock = (function () {
    var storage = {}
    return {
      setItem: function(key, value) {
        storage[key] = value
      },
      getItem: function(key) {
        return storage[key]
      }
    }
  })()
  // With a backup phrase
  it('shows HomeScreenPage', () => {
    Object.defineProperty(window, 'localStorage', {
      value: storageMock
    })
    window.localStorage.setItem('redux', {
    	"account": {
				"accountCreated": true,
				"encryptedBackupPhrase": "TBA"
			}
		})
    cy.visit('/')

    cy.contains('Home')
  })
})
