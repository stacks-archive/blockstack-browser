import { encrypt, decrypt } from '../../app/js/utils/encryption-utils'

describe('encryption-utils', () => {
  beforeEach(() => {
  })

  afterEach(() => {
  })

  describe('encrypt & decrypt', () => {
    it('should encrypt & decrypt the phrase', () => {
      const phrase = 'vivid oxygen neutral wheat find thumb cigar wheel board kiwi portion business'
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
    })
  })

  describe('decrypt legacy', () => {
    it('should decrypt legacy encryption', () => {
      const legacyCiphertext = '1c94d7de0000000304d583f007c71e6e5fef354c046e8c64b1adebd6904dcb' +
        '007a1222f07313643873455ab2a3ab3819e99d518cc7d33c18bde02494aa74efc35a8970b2007b2fc715f' +
        '6067cee27f5c92d020b1806b0444994aab80050a6732131d2947a51bacb3952fb9286124b3c2b3196ff7e' +
        'dce66dee0dbd9eb59558e0044bddb3a78f48a66cf8d78bb46bb472bd2d5ec420c831fc384293252459524' +
        'ee2d668869f33c586a94467d0ce8671260f4cc2e87140c873b6ca79fb86c6d77d134d7beb2018845a9e71' +
        'e6c7ecdedacd8a676f1f873c5f9c708cc6070642d44d2505aa9cdba26c50ad6f8d3e547fb0cba710a7f7b' +
        'e54ff7ea7e98a809ddee5ef85f6f259b3a17a8d8dbaac618b80fe266a1e63ec19e476bee9177b51894e'
      const password = 'supersecret'
      const phrase = 'vivid oxygen neutral wheat find thumb cigar wheel board kiwi portion business'
      return decrypt(new Buffer(legacyCiphertext, 'hex'), password)
        .then((plaintextBuffer) => {
          assert(plaintextBuffer)
          assert.equal(plaintextBuffer.toString(), phrase)
        })
    })
  })
})
