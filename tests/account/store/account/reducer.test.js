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
  }
}

describe('Account Store: AccountReducer', () => {
  it('should return the proper initial state', () => {
    assert.deepEqual(
      AccountReducer(undefined, {}),
      initialState)
  })
})
