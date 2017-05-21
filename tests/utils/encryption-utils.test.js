import { encrypt, decrypt } from '../../app/js/utils/encryption-utils'

describe('encryption-utils', () => {
  beforeEach(() => {
  })

  afterEach(() => {
  })

  describe('encrypt & decrypt', () => {
    it('should encrypt & decrypt the phrase', () => {
      const phrase = 'testing 1 2 3'
      const password = 'supersecret'
      return encrypt(new Buffer(phrase), password)
      .then((encryptedTextBuffer) => {
        assert(encryptedTextBuffer)
        const encryptedText = encryptedTextBuffer.toString('hex')
        return decrypt(new Buffer(encryptedText, 'hex'), password)
        .then((plaintextBuffer) => {
          assert(plaintextBuffer)
          assert.equal(plaintextBuffer.toString(), phrase)
        })
      })
    }).timeout(5000) // encryption & decryption are slow
  })
})
