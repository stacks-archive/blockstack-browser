import Wallet from '../src/wallet'

describe('Restoring a wallet', () => {
  test('restores an existing wallet and keychain', async () => {
    // const store = mockStore({});
    const password = 'password'
    const backupPhrase =      'sound idle panel often situate develop unit text design antenna '
      + 'vendor screen opinion balcony share trigger accuse scatter visa uniform brass '
      + 'update opinion media'
    const bitcoinPublicKeychain =      'xpub6Br2scNTh9Luk2VPebfEvjbWWC5WhvxpxgK8ap2qhYTS4xvZu'
      + '8Y3G1npmx8DdvwUdCbtNb7qNLyTChKMbY8dThLV5Zvdq9AojQjxrM6gTC8'
    const identityPublicKeychain =      'xpub6B6tCCb8T5eXUKVYUoppmSi5KhNRboRJUwqHavxdvQTncfmB'
      + 'NFCX4Nq9w8DsfuS6AYPpBYRuS3dcUuyF8mQtwEydAEN3A4Cx6HDy58jpKEb'
    const firstBitcoinAddress = '112FogMTesWmLzkWbtKrSg3p9LK6Lucn4s'
    const identityAddresses = ['1JeTQ5cQjsD57YGcsVFhwT7iuQUXJR6BSk']

    const identityKeypairs = [
      {
        key: 'a29c3e73dba79ab0f84cb792bafd65ec71f243ebe67a7ebd842ef5cdce3b21eb',
        keyID:
          '03e93ae65d6675061a167c34b8321bef87594468e9b2dd19c05a67a7b4caefa017',
        address: '1JeTQ5cQjsD57YGcsVFhwT7iuQUXJR6BSk',
        appsNodeKey:
          'xprvA1y4zBndD83n6PWgVH6ivkTpNQ2WU1UGPg9hWa2q8sCANa7YrYMZFHWMhrbpsarx'
          + 'XMuQRa4jtaT2YXugwsKrjFgn765tUHu9XjyiDFEjB7f',
        salt: 'c15619adafe7e75a195a1a2b5788ca42e585a3fd181ae2ff009c6089de54ed9e'
      }
    ]

    const wallet = await Wallet.restore(password, backupPhrase)
    expect(wallet.bitcoinPublicKeyChain).toEqual(bitcoinPublicKeychain)
    expect(wallet.identityPublicKeychain).toEqual(identityPublicKeychain)
    expect(wallet.firstBitcoinAddress).toEqual(firstBitcoinAddress)
    expect(wallet.identityAddresses).toEqual(identityAddresses)
    expect(wallet.identityKeypairs).toEqual(identityKeypairs)
  })
})
