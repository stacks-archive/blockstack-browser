import { CREATE_WALLET, CREATE_ACCOUNT, GENERATE_ADDRESS } from '../actions/keychain'
import { PrivateKeychain } from 'keychain-manager'
delete global._bitcore

const initialState = {
  encryptedMnemonic: null,
  accounts: []
}

export default function Identities(state = initialState, action) {
  switch (action.type) {
    case CREATE_WALLET:
      return Object.assign({}, state, {
        encryptedMnemonic: action.encryptedMnemonic,
        accounts: [
          { nextAddressIndex: 0 }
        ]
      })
    case CREATE_ACCOUNT:
      const newAccount = { nextAddressIndex: 0 }
      return Object.assign({}, state, {
        accounts: [
          ...state.accounts,
          newAccount
        ]
      })
    case GENERATE_ADDRESS:
      return Object.assign({}, state, {
        accounts: [
          ...state.accounts.slice(0, action.accountIndex),
          {
            nextAddressIndex: state.accounts[action.accountIndex].nextAddressIndex + 1
          },
          ...state.accounts.slice(action.accountIndex + 1)
        ]
      })
    default:
      return state
  }
}
