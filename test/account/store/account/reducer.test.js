import AccountActions from '../../../../app/js/account/store/account/actions'
import AccountReducer, { AccountInitialState } from '../../../../app/js/account/store/account/reducer'
import {
  CREATE_ACCOUNT,
  RECOVERY_CODE_VERIFIED,
  DELETE_ACCOUNT,
  UPDATE_CORE_ADDRESS,
  UPDATE_CORE_BALANCE,
  UPDATE_BACKUP_PHRASE,
  UPDATE_BALANCES,
  RESET_CORE_BALANCE_WITHDRAWAL,
  WITHDRAWING_CORE_BALANCE,
  WITHDRAW_CORE_BALANCE_SUCCESS,
  WITHDRAW_CORE_BALANCE_ERROR,
  PROMPTED_FOR_EMAIL,
  NEW_IDENTITY_ADDRESS,
  CONNECTED_STORAGE
} from '../../../../app/js/account/store/account/types'

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

  describe('processes CREATE_ACCOUNT action', () => {
    const encryptedBackupPhrase = 'fakeEncryptedBackupPhrase'
    const identityPublicKeychain = 'fakeIdentityPublicKeychain'
    const identityAddresses = 'fakeIdentityAddresses'
    const identityKeypairs = 'fakeIdentityKeypairs'
    const bitcoinPublicKeychain = 'fakeBitcoinPublicKeychain'
    const firstBitcoinAddress = 'fakeFirstBitcoinAddress'
    const action = {
      type: CREATE_ACCOUNT,
      encryptedBackupPhrase,
      identityPublicKeychain,
      identityAddresses,
      identityKeypairs,
      bitcoinPublicKeychain,
      firstBitcoinAddress
    }
    const actualState = AccountReducer(undefined, action)

    it('by setting accountCreated to true', () =>
      assert.equal(actualState.accountCreated, true)
    )

    it('by setting encryptedBackupPhrase as provided by action.encryptedBackupPhrase', () =>
      assert.equal(actualState.encryptedBackupPhrase, encryptedBackupPhrase)
    )

    it('by setting identityAccount.publicKeychain as provided by action.identityPublicKeychain', () =>
      assert.equal(actualState.identityAccount.publicKeychain, identityPublicKeychain)
    )

    it('by setting identityAccount.addresses as provided by action.identityAddresses', () =>
      assert.equal(actualState.identityAccount.addresses, identityAddresses)
    )

    it('by setting identityAccount.keypairs as provided by action.identityKeypairs', () =>
      assert.equal(actualState.identityAccount.keypairs, identityKeypairs)
    )

    it('by setting identityAccount.addressIndex to 0', () =>
      assert.equal(actualState.identityAccount.addressIndex, 0)
    )

    it('by setting bitcoinAccount.publicKeychain as provided by action.bitcoinPublicKeychain', () =>
      assert.equal(actualState.bitcoinAccount.publicKeychain, bitcoinPublicKeychain)
    )

    it('by setting bitcoinAccount.addresses as provided by action.firstBitcoinAddress', () =>
      assert.equal(actualState.bitcoinAccount.addresses, firstBitcoinAddress)
    )

    it('by setting bitcoinAccount.addressIndex to 0', () =>
      assert.equal(actualState.bitcoinAccount.addressIndex, 0)
    )

    it('by setting bitcoinAccount.balances to state.bitcoinAccount.balances', () =>
      assert.equal(actualState.bitcoinAccount.balances, AccountInitialState.bitcoinAccount.balances)
    )
  })

  describe('processes RECOVERY_CODE_VERIFIED action', () => {
    const action = {
      type: RECOVERY_CODE_VERIFIED
    }
    const actualState = AccountReducer(undefined, action)

    it('by setting recoveryCodeVerified to true', () =>
      assert.equal(actualState.recoveryCodeVerified, true)
    )
  })

  describe('processes DELETE_ACCOUNT action', () => {
    const action = {
      type: DELETE_ACCOUNT
    }
    const actualState = AccountReducer(undefined, action)

    it('by setting accountCreated to false', () =>
      assert.equal(actualState.accountCreated, false)
    )

    it('by setting encryptedBackupPhrase to null', () =>
      assert.equal(actualState.encryptedBackupPhrase, null)
    )
  })

  describe('processes UPDATE_CORE_ADDRESS action', () => {
    const coreWalletAddress = 'fakeCoreWalletAddress'
    const action = {
      type: UPDATE_CORE_ADDRESS,
      coreWalletAddress
    }
    const actualState = AccountReducer(undefined, action)

    it('by setting coreWallet.address to provided coreWalletAddress', () =>
      assert.equal(actualState.coreWallet.address, coreWalletAddress)
    )
  })

  describe('processes UPDATE_CORE_BALANCE action', () => {
    const coreWalletBalance = 'fakeCoreWalletBalance'
    const action = {
      type: UPDATE_CORE_BALANCE,
      coreWalletBalance
    }
    const actualState = AccountReducer(undefined, action)

    it('by setting coreWallet.balance to provided coreWalletBalance', () =>
      assert.equal(actualState.coreWallet.balance, coreWalletBalance)
    )
  })

  describe('processes UPDATE_BACKUP_PHRASE action', () => {
    const encryptedBackupPhrase = 'fakeEncryptedBackupPhrase'
    const action = {
      type: UPDATE_BACKUP_PHRASE,
      encryptedBackupPhrase
    }
    const actualState = AccountReducer(undefined, action)

    it('by setting encryptedBackupPhrase to provided encryptedBackupPhrase', () =>
      assert.equal(actualState.encryptedBackupPhrase, encryptedBackupPhrase)
    )
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

  describe('processes UPDATE_BALANCES action', () => {
    const balances = 'fakeBalances'
    const action = {
      type: UPDATE_BALANCES,
      balances
    }
    const actualState = AccountReducer(undefined, action)

    it('by setting bitcoinAccount.balances to provided balances', () =>
      assert.equal(actualState.bitcoinAccount.balances, balances)
    )

    it('by leaving bitcoinAccount.publicKeychain unchanged', () =>
      assert.equal(actualState.bitcoinAccount.publicKeychain,
        AccountInitialState.bitcoinAccount.publicKeychain)
    )

    it('by leaving bitcoinAccount.addresses unchanged', () =>
      assert.equal(actualState.bitcoinAccount.addresses,
        AccountInitialState.bitcoinAccount.addresses)
    )
  })

  describe('processes RESET_CORE_BALANCE_WITHDRAWAL action', () => {
    const action = {
      type: RESET_CORE_BALANCE_WITHDRAWAL
    }
    const actualState = AccountReducer(undefined, action)

    it('by setting coreWallet.withdrawal.inProgress to false', () =>
      assert.equal(actualState.coreWallet.withdrawal.inProgress, false)
    )

    it('by setting coreWallet.withdrawal.error to null', () =>
      assert.equal(actualState.coreWallet.withdrawal.error, null)
    )

    it('by setting coreWallet.withdrawal.success to false', () =>
      assert.equal(actualState.coreWallet.withdrawal.success, false)
    )

    it('by setting coreWallet.withdrawal.recipientAddress to null', () =>
      assert.equal(actualState.coreWallet.withdrawal.recipientAddress, null)
    )
  })

  describe('processes WITHDRAWING_CORE_BALANCE action', () => {
    const recipientAddress = 'fakeRecipientAddress'
    const action = {
      type: WITHDRAWING_CORE_BALANCE,
      recipientAddress
    }
    const actualState = AccountReducer(undefined, action)

    it('by setting coreWallet.withdrawal.inProgress to true', () =>
      assert.equal(actualState.coreWallet.withdrawal.inProgress, true)
    )

    it('by setting coreWallet.withdrawal.error to null', () =>
      assert.equal(actualState.coreWallet.withdrawal.error, null)
    )

    it('by setting coreWallet.withdrawal.success to false', () =>
      assert.equal(actualState.coreWallet.withdrawal.success, false)
    )

    it('by setting coreWallet.withdrawal.recipientAddress to provivded recipientAddress', () =>
      assert.equal(actualState.coreWallet.withdrawal.recipientAddress, recipientAddress)
    )
  })

  describe('processes WITHDRAW_CORE_BALANCE_SUCCESS action', () => {
    const action = {
      type: WITHDRAW_CORE_BALANCE_SUCCESS
    }
    const actualState = AccountReducer(undefined, action)

    it('by setting coreWallet.withdrawal.inProgress to false', () =>
      assert.equal(actualState.coreWallet.withdrawal.inProgress, false)
    )

    it('by setting coreWallet.withdrawal.success to true', () =>
      assert.equal(actualState.coreWallet.withdrawal.success, true)
    )
  })

  describe('processes WITHDRAW_CORE_BALANCE_ERROR action', () => {
    const error = new Error()
    const action = {
      type: WITHDRAW_CORE_BALANCE_ERROR,
      error
    }
    const actualState = AccountReducer(undefined, action)

    it('by setting coreWallet.withdrawal.inProgress to false', () =>
      assert.equal(actualState.coreWallet.withdrawal.inProgress, false)
    )

    it('by setting coreWallet.withdrawal.success to false', () =>
      assert.equal(actualState.coreWallet.withdrawal.success, false)
    )

    it('by setting coreWallet.withdrawal.error to provided error', () =>
      assert.equal(actualState.coreWallet.withdrawal.error, error)
    )
  })

  describe('processes PROMPTED_FOR_EMAIL action', () => {
    const email = 'nico.id@example.com'
    const action = {
      type: PROMPTED_FOR_EMAIL,
      email
    }
    const actualState = AccountReducer(undefined, action)

    it('by setting promptedForEmail to true', () =>
      assert.equal(actualState.promptedForEmail, true)
    )

    it('by setting email to provided email', () =>
      assert.equal(actualState.email, email)
    )
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

  describe('processes NEW_IDENTITY_ADDRESS action', () => {
    const address = 'fakeAddress'
    const keypair = {
      address
    }
    const action = {
      type: NEW_IDENTITY_ADDRESS,
      keypair
    }
    const actualState = AccountReducer(undefined, action)

    it('by adding the provided keypair.address to identityAccount.addresses', () =>
      assert.deepEqual(actualState.identityAccount.addresses, [
        ...AccountInitialState.identityAccount.addresses,
        address
      ])
    )

    it('by adding the provided keypair to identityAccount.keypairs', () =>
      assert.deepEqual(actualState.identityAccount.keypairs, [
        ...AccountInitialState.identityAccount.keypairs,
        keypair
      ])
    )
  })

  describe('processes CONNECTED_STORAGE action', () => {
    const action = {
      type: CONNECTED_STORAGE
    }
    const actualState = AccountReducer({identityAccount: {}}, action)

    it('by setting connectedStorageAtLeastOnce to true', () =>
      assert.equal(actualState.connectedStorageAtLeastOnce, true)
    )
  })
})
