import { encrypt } from '../../src/encryption/encrypt'
import { decrypt } from '../../src/encryption/decrypt'

test('should encrypt and decrypt', async () => {
  const phrase = 'vivid oxygen neutral wheat find thumb cigar wheel board kiwi portion business'
  const password = 'supersecret'
  const encryptedText = await encrypt(Buffer.from(phrase), password)
  // expect(encryptedTextBuffer).toBeTruthy()
  // const encryptedText = encryptedTextBuffer.toString('hex')
  const plainTextBuffer = await decrypt(Buffer.from(encryptedText, 'hex'), password)
  expect(plainTextBuffer.toString()).toEqual(phrase)
})
