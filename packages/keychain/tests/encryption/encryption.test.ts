import { encrypt } from '../../src/encryption/encrypt'
import { decrypt } from '../../src/encryption/decrypt'

test('should encrypt and decrypt', async () => {
  const phrase = 'vivid oxygen neutral wheat find thumb cigar wheel board kiwi portion business'
  const password = 'supersecret'
  const encryptedText = await encrypt(phrase, password)
  const plainTextBuffer = await decrypt(encryptedText, password)
  expect(plainTextBuffer).toEqual(phrase)
})
