import { Wallet } from '@blockstack/keychain'
import { createTransform } from 'redux-persist'

interface OutboundState {
  [key: string]: any
  currentWallet: null | Wallet
}

export const WalletTransform = createTransform(
  inboundState => {
    return { ...inboundState }
  },
  (outboundState: OutboundState) => {
    if (outboundState.currentWallet) {
      const currentWallet = outboundState.currentWallet
      return {
        ...outboundState,
        currentWallet: new Wallet(currentWallet)
      }
    }
    return {
      ...outboundState
    }
  },
  { whitelist: ['wallet'] }
)
