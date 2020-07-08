import { ChainID } from '@blockstack/stacks-transactions';
import { BIP32Interface } from 'bitcoinjs-lib';

import { deriveStxAddressChain } from '../../src/address-derivation';
import { deriveRootKeychainFromMnemonic } from '../../src/mnemonic';

describe('deriveStxAddressChain()', () => {
  test('it returns mainnet derived keys, pt. 1', async () => {
    const phrase =
      'humble ramp winner eagle stumble follow gravity roast receive quote buddy start demise issue egg jewel return hurdle ball blind pulse physical uncle room';
    const deriveStxMainnetAddressChain = deriveStxAddressChain(ChainID.Mainnet);
    const rootNode = await deriveRootKeychainFromMnemonic(phrase);
    const result = deriveStxMainnetAddressChain(rootNode);
    expect(result.privateKey).toEqual(
      '2d088f14028baf5d0b4a8df8ec9faeb8f6f011f8f26d70c8d8abc04a204e3beb01'
    );
  });

  test('it returns mainnet derived keys, pt. 2', async () => {
    const phrase =
      'oblige boat easily source clip remind steel hockey nut arrow swallow keep run fragile fresh river expire stay monster black defy box fiber wave';
    const deriveStxMainnetAddressChain = deriveStxAddressChain(ChainID.Mainnet);
    const rootNode = await deriveRootKeychainFromMnemonic(phrase);
    const result = deriveStxMainnetAddressChain(rootNode);
    expect(result.privateKey).toEqual(
      'd7c71a427b8a9ed870c9552f67beadc2710dbee7f29a0cf6cfd1dd96a703bf1801'
    );
    expect(result.address).toEqual('SP2JSAXXTH90R04677F6JDS5D4DXWNW4T3KWNFDR5');
  });

  describe('it behaves according to CLI library for mainnet', () => {
    const phrase =
      'parade vacant kitten museum voice shift tell embrace security page praise cloud stove canal sketch huge ignore cotton island hand wall blush empower movie';
    const deriveStxTestnetAddressChain = deriveStxAddressChain(ChainID.Mainnet);
    let rootNode: BIP32Interface;
    let result: ReturnType<typeof deriveStxTestnetAddressChain>;

    beforeEach(async () => {
      rootNode = await deriveRootKeychainFromMnemonic(phrase);
      result = deriveStxTestnetAddressChain(rootNode);
    });

    test('private key is derive accurately for cli  mainnet', () => {
      expect(result.privateKey).toEqual(
        '4587afc14878fd97aa01032bfae21ab01ae9a087abeecc7d867d39393e22ce2101'
      );
    });

    test('address is derived accurately for cli mainnet', () => {
      expect(result.address).toEqual('SP398525PZNCJTPNM6K4NW0T40YXJFEZ9DEQR12TR');
    });
  });

  //
  // This test should pass if testnet key derivation is
  // supposed to use derivation path `m/44'/5757'/0'/0/0`,
  describe(`should pass if testnet should use derivation path "m/44'/5757'/0'/0/0"`, () => {
    const phrase =
      'decorate confirm shoulder gain develop name tone source potato march maple company blanket discover ship clown virus broccoli room adapt praise oak west canoe';
    const deriveStxTestnetAddressChain = deriveStxAddressChain(ChainID.Testnet);
    let rootNode: BIP32Interface;
    let result: ReturnType<typeof deriveStxTestnetAddressChain>;

    beforeEach(async () => {
      rootNode = await deriveRootKeychainFromMnemonic(phrase);
      result = deriveStxTestnetAddressChain(rootNode);
    });

    test('private key is derive accurately for cli  testnet', () => {
      expect(result.privateKey).toEqual(
        'cbaa7cbb821fdd17077fa24529803d351eb038fd6ec8eb14fc92344dbb244da901'
      );
    });

    test('address is derived accurately for cli testnet', () => {
      expect(result.address).toEqual('ST8SHKQXP59D65B1X0PHDHTWMKKPM94N9A2RNXE6');
    });
  });

  //
  // This test should pass if testnet key derivation is
  // supposed to use derivation path `m/44'/1'/0'/0/0`,
  // describe(`should pass if testnet should use derivation path "m/44'/1'/0'/0/0"`, () => {
  //   const phrase =
  //     'trumpet hole school slim beauty advance evoke chapter random broom account twice state panel grant unfair empower spy asset depend acquire potato scatter atom';
  //   const deriveStxTestnetAddressChain = deriveStxAddressChain(ChainID.Testnet);
  //   let rootNode: BIP32Interface;
  //   let result: ReturnType<typeof deriveStxTestnetAddressChain>;

  //   beforeEach(async () => {
  //     rootNode = await deriveRootKeychainFromMnemonic(phrase);
  //     result = deriveStxTestnetAddressChain(rootNode);
  //   });

  //   test('private key is derive accurately for cli  testnet', () => {
  //     expect(result.privateKey).toEqual(
  //       '65d49e09d57c07951b34cdac6b4ef6bdb8ee18ac7884c31a6876b086e7131b2d01'
  //     );
  //   });

  //   test('address is derived accurately for cli testnet', () => {
  //     expect(result.address).toEqual('ST1MED1C7R0V4FAZBAEF3FPD3JVHBP000FKTTG64T');
  //   });
  // });
});
