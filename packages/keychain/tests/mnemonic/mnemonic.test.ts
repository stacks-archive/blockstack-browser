import {
  generateEncryptedMnemonicRootKeychain,
  deriveRootKeychainFromMnemonic,
} from '../../src/mnemonic';
import { decrypt } from '../../src/encryption/decrypt';

describe('generateEncryptedMnemonicRootKeychain()', () => {
  test('both 12 and 24 word phrases are returned', async () => {
    const password = '427706da374f435f959283de93652375';
    const twelveWorder = await generateEncryptedMnemonicRootKeychain(password, 128);
    const twentyFourWorder = await generateEncryptedMnemonicRootKeychain(password, 256);

    const twelveWordDecrypted = await decrypt(twelveWorder.encryptedMnemonicPhrase, password);
    const twentyFourWordDecrypted = await decrypt(
      twentyFourWorder.encryptedMnemonicPhrase,
      password
    );

    expect(twelveWordDecrypted.split(' ').length).toEqual(12);
    expect(twentyFourWordDecrypted.split(' ').length).toEqual(24);
  });
});

describe('restoreKeychainFromMnemonic()', () => {
  test('it restores keychain from a seed', async () => {
    const password = '6bd8106ff1704446ba11e31ff3b0ce8b';
    const phrase =
      'eternal army wreck noodle click shock include orchard jungle only middle forget idle pulse give empower iron curtain silent blush blossom chef animal sphere';

    const rootNode = await deriveRootKeychainFromMnemonic(phrase);
    expect(rootNode.privateKey?.toString('hex')).toEqual(
      'a1ce135a6a63ba49c9d118bbc5b9f501d6a36feb45f810576781955b9a57d3b2'
    );
  });
});
