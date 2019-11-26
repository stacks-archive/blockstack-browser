import { Wallet } from '@blockstack/keychain'

const ctx: Worker = self as any

ctx.onmessage = async event => {
  const { password, seed }: { password: string; seed: string } = event.data
  console.log(event.data)
  const wallet = await Wallet.restore(password, seed)
  ctx.postMessage(wallet)
}
