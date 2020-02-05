import Wallet from './wallet'
export { default as Wallet } from './wallet'
export { decrypt } from './encryption/decrypt'
export { encrypt } from './encryption/encrypt'
export * from './profiles'
export * from './identity'

export default {
  Wallet,
}
