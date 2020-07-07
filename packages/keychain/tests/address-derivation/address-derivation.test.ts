import { ChainID } from '@blockstack/stacks-transactions';

import { deriveStxAddressChain } from '../../src/address-derivation';
import { deriveRootKeychainFromMnemonic } from '../../src/mnemonic';

const phrase =
  'humble ramp winner eagle stumble follow gravity roast receive quote buddy start demise issue egg jewel return hurdle ball blind pulse physical uncle room';

describe('deriveStxAddressChain()', () => {
  test('it returns mainnet derived keys', async () => {
    const deriveStxMainnetAddressChain = deriveStxAddressChain(ChainID.Mainnet);
    const rootNode = await deriveRootKeychainFromMnemonic(phrase);
    const result = deriveStxMainnetAddressChain(rootNode);
    expect(result.privateKey).toEqual(
      '2d088f14028baf5d0b4a8df8ec9faeb8f6f011f8f26d70c8d8abc04a204e3beb01'
    );
  });

  test('it returns testnet derived keys', async () => {
    const deriveStxTestnetAddressChain = deriveStxAddressChain(ChainID.Testnet);
    const rootNode = await deriveRootKeychainFromMnemonic(phrase);
    const result = deriveStxTestnetAddressChain(rootNode);
    expect(result.privateKey).toEqual(
      '4cf240ef1e9b467c64b196b6ff3d24d9709f287f667939056fbcfc54e4a1642901'
    );
  });
});
