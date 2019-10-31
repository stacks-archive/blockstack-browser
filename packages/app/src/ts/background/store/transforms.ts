import Wallet, { ConstructorOptions } from 'blockstack-keychain/lib-esm/wallet'
import { createTransform } from 'redux-persist'

interface OutboundState {
  [key: string]: any
  currentWallet: null | ConstructorOptions
}

export const WalletTransform = createTransform(
  inboundState => {
    return { ...inboundState }
  },
  (outboundState: OutboundState) => {
    if (outboundState.currentWallet) {
      const currentWallet: ConstructorOptions = outboundState.currentWallet
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
