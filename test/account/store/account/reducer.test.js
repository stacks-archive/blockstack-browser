import AccountActions from '../../../../app/js/account/store/account/actions'
import AccountReducer, { AccountInitialState } from '../../../../app/js/account/store/account/reducer'

const BITCOIN_ACCOUNT_KEYCHAIN =
  'xpub6DPVcgkLNGyJ658Zd77XVCtKMAcyNWyGwtzxfzTt2XMhMnc6pkYQXru' +
  '3BSFHbe4wErGeWtZ8WEVnf74ev7ypn6aFysKGcT3AJ1LrGG2ZDwJ'
const IDENTITY_ACCOUNT_KEYCHAIN =
  'xpub69qePe4LJAcLtQvdginvTYNoFPzm2kZNzCbwY62X31Grxw85RQVnQ8' +
  '1npSRtEGuGF8x9jQGE2sMTmLn2AA8kXwNdiiqgS74muDeDjivLVwR'

let initialState = AccountInitialState

describe('Account Store: AccountReducer', () => {
  it('should return the proper initial state', () => {
    assert.deepEqual(AccountReducer(undefined, {}), initialState)
  })

  it('should calculate the next bitcoin address', () => {
    initialState = {
      identityAccount: {
        publicKeychain: IDENTITY_ACCOUNT_KEYCHAIN,
        addresses: ['1D6WztrjTkKkrcGBL1pqfCJFnCbmQtjPh6'],
        addressIndex: 0
      },
      bitcoinAccount: {
        publicKeychain: BITCOIN_ACCOUNT_KEYCHAIN,
        addresses: ['16KyES12ATkeM8DNbdTAWFtAPQFNXsFaB1'],
        balances: { total: 0.0 },
        addressIndex: 0
      }
    }
    const action = AccountActions.newBitcoinAddress()
    const expectedState = {
      bitcoinAccount: {
        addressIndex: 1,
        addresses: [
          '16KyES12ATkeM8DNbdTAWFtAPQFNXsFaB1',
          '1K2GerUJeysnNYJEB9nZPykPmuAwKpNc9k'
        ],
        balances: {
          total: 0
        },
        publicKeychain: BITCOIN_ACCOUNT_KEYCHAIN
      },
      identityAccount: {
        addressIndex: 0,
        addresses: ['1D6WztrjTkKkrcGBL1pqfCJFnCbmQtjPh6'],
        publicKeychain: IDENTITY_ACCOUNT_KEYCHAIN
      }
    }

    const actualState = AccountReducer(initialState, action)

    assert.deepEqual(actualState, expectedState)
  })

  it('should indicated backup phrase has been displayed', () => {
    const action = AccountActions.updateViewedRecoveryCode()
    const actualState = AccountReducer(initialState, action)

    assert(actualState.viewedRecoveryCode, true)
  })

  it('increment the identity address index', () => {
    initialState = {
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

    assert.deepEqual(actualState, expectedState)
  })
})
