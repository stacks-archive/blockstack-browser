import { encryptMnemonic } from 'blockstack/lib/encryption/wallet'

/**
 * Encrypt a raw mnemonic phrase to be password protected
 * @param phrase - Raw mnemonic phrase
 * @param password - Password to encrypt mnemonic with
 * @return The encrypted phrase
 * */
export async function encrypt(phrase: string, password: string): Promise<Buffer> {
  const result = await encryptMnemonic(phrase, password)
  return result
}
