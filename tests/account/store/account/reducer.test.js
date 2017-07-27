import { AccountActions, AccountReducer } from '../../../../app/js/account/store/account'

const initialState = {
  accountCreated: false,
  promptedForEmail: false,
  encryptedBackupPhrase: null,
  identityAccount: {
    addresses: [],
    keypairs: []
  },
  bitcoinAccount: {
    addresses: [],
    balances: { total: 0.0 }
  },
  coreWallet: {
    address: null,
    balance: 0.0,
    withdrawal: {
      inProgress: false,
      error: null,
      recipient: null,
      success: false
    }
  },
  connectedStorageAtLeastOnce: false,
  viewedRecoveryCode: false
}

describe('Account Store: AccountReducer', () => {
  it('should return the proper initial state', () => {
    assert.deepEqual(
      AccountReducer(undefined, {}),
      initialState)
  })

  it('should calculate the next bitcoin address', () => {
    const initialState = {
      identityAccount: {
        publicKeychain: 'xpub69qePe4LJAcLtQvdginvTYNoFPzm2kZNzCbwY62X31Grxw85RQVnQ81npSRtEGuGF8x9jQGE2sMTmLn2AA8kXwNdiiqgS74muDeDjivLVwR',
        addresses: ['1D6WztrjTkKkrcGBL1pqfCJFnCbmQtjPh6'],
        addressIndex: 0
      },
      bitcoinAccount: {
        publicKeychain: 'xpub6DPVcgkLNGyJ658Zd77XVCtKMAcyNWyGwtzxfzTt2XMhMnc6pkYQXru3BSFHbe4wErGeWtZ8WEVnf74ev7ypn6aFysKGcT3AJ1LrGG2ZDwJ',
        addresses: ['16KyES12ATkeM8DNbdTAWFtAPQFNXsFaB1'],
        balances: { total: 0.0 },
        addressIndex: 0
      }
    }
    const action = AccountActions.newBitcoinAddress()

    const expectedState = {
         "bitcoinAccount": {
           "addressIndex": 1,
           "addresses": [
             "16KyES12ATkeM8DNbdTAWFtAPQFNXsFaB1",
             "1K2GerUJeysnNYJEB9nZPykPmuAwKpNc9k"
           ],
           "balances": {
             "total": 0
           },
           "publicKeychain": "xpub6DPVcgkLNGyJ658Zd77XVCtKMAcyNWyGwtzxfzTt2XMhMnc6pkYQXru3BSFHbe4wErGeWtZ8WEVnf74ev7ypn6aFysKGcT3AJ1LrGG2ZDwJ",
         },
         "identityAccount": {
           "addressIndex": 0,
           "addresses": [
             "1D6WztrjTkKkrcGBL1pqfCJFnCbmQtjPh6"
           ],
           "publicKeychain": "xpub69qePe4LJAcLtQvdginvTYNoFPzm2kZNzCbwY62X31Grxw85RQVnQ81npSRtEGuGF8x9jQGE2sMTmLn2AA8kXwNdiiqgS74muDeDjivLVwR"
         }
       }

    const actualState = AccountReducer(initialState, action)

    assert.deepEqual(actualState,
      expectedState)
  })

  it('should indicated backup phrase has been displayed', () => {
    const action = AccountActions.updateViewedRecoveryCode()
    const actualState = AccountReducer(initialState, action)
    assert(actualState.viewedRecoveryCode, true)
  })

  it('increment the identity address index', () => {
    const initialState = {
      identityAccount: {
        addressIndex: 0
      }
    }

    const action = AccountActions.incrementIdentityAddressIndex()

    const expectedState = {
      identityAccount: {
        addressIndex: 1
      }
    }

    const actualState = AccountReducer(initialState, action)

    assert.deepEqual(actualState,
      expectedState)
  })
})
