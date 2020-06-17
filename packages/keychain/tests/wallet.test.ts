import './setup';
import Wallet, { WalletConfig, ConfigApp } from '../src/wallet';
import { decrypt } from '../src/encryption/decrypt';
import { ECPair, bip32 } from 'bitcoinjs-lib';
import { decryptContent, encryptContent, getPublicKeyFromPrivate } from 'blockstack';
import { DEFAULT_GAIA_HUB } from '../src/utils/gaia';
import { mnemonicToSeed } from 'bip39';
import { ChainID } from '@blockstack/stacks-transactions';

describe('Restoring a wallet', () => {
  test('restores an existing wallet and keychain', async () => {
    // const store = mockStore({});
    const password = 'password';
    const backupPhrase =
      'sound idle panel often situate develop unit text design antenna ' +
      'vendor screen opinion balcony share trigger accuse scatter visa uniform brass ' +
      'update opinion media';
    const bitcoinPublicKeychain =
      'xpub6Br2scNTh9Luk2VPebfEvjbWWC5WhvxpxgK8ap2qhYTS4xvZu' +
      '8Y3G1npmx8DdvwUdCbtNb7qNLyTChKMbY8dThLV5Zvdq9AojQjxrM6gTC8';
    const identityPublicKeychain =
      'xpub6B6tCCb8T5eXUKVYUoppmSi5KhNRboRJUwqHavxdvQTncfmB' +
      'NFCX4Nq9w8DsfuS6AYPpBYRuS3dcUuyF8mQtwEydAEN3A4Cx6HDy58jpKEb';
    const firstBitcoinAddress = '112FogMTesWmLzkWbtKrSg3p9LK6Lucn4s';
    const identityAddresses = ['1JeTQ5cQjsD57YGcsVFhwT7iuQUXJR6BSk'];

    const identityKeypairs = [
      {
        key: 'a29c3e73dba79ab0f84cb792bafd65ec71f243ebe67a7ebd842ef5cdce3b21eb',
        keyID: '03e93ae65d6675061a167c34b8321bef87594468e9b2dd19c05a67a7b4caefa017',
        address: '1JeTQ5cQjsD57YGcsVFhwT7iuQUXJR6BSk',
        appsNodeKey:
          'xprvA1y4zBndD83n6PWgVH6ivkTpNQ2WU1UGPg9hWa2q8sCANa7YrYMZFHWMhrbpsarx' +
          'XMuQRa4jtaT2YXugwsKrjFgn765tUHu9XjyiDFEjB7f',
        salt: 'c15619adafe7e75a195a1a2b5788ca42e585a3fd181ae2ff009c6089de54ed9e',
        stxNodeKey:
          'xprvA1y4zBndD83nNNFWE1UiWpmc9hpPuk8xjPNwb2j341txeJmCHe8VWT7VKS6FcgnCtbuBP2kzyW34ESdJtJ81AQxCbr9cmQsUHHZ8dtyTxCy',
      },
    ];

    const wallet = await Wallet.restore(password, backupPhrase, ChainID.Mainnet);
    expect(wallet.bitcoinPublicKeychain).toEqual(bitcoinPublicKeychain);
    expect(wallet.identityPublicKeychain).toEqual(identityPublicKeychain);
    expect(wallet.firstBitcoinAddress).toEqual(firstBitcoinAddress);
    expect(wallet.identityAddresses).toEqual(identityAddresses);
    expect(wallet.identityKeypairs).toEqual(identityKeypairs);
    expect(wallet.identities.length).toEqual(1);
    const [identity] = wallet.identities;
    expect(identity.address).toEqual(identityAddresses[0]);
    expect(identity.keyPair).toEqual(identityKeypairs[0]);
  });

  test('generates and restores the same wallet', async () => {
    const password = 'password';
    const generated = await Wallet.generate(password, ChainID.Testnet);

    const encryptedBackupPhrase = generated.encryptedBackupPhrase;

    const plainTextBuffer = await decrypt(Buffer.from(encryptedBackupPhrase, 'hex'), password);

    const backupPhrase = plainTextBuffer.toString();

    const restored = await Wallet.restore(password, backupPhrase, ChainID.Mainnet);

    expect(restored.identityPublicKeychain).toEqual(generated.identityPublicKeychain);
  });

  test('generates 24-word seed phrase', async () => {
    const pass = 'password';
    const wallet = await Wallet.generateStrong(pass, ChainID.Testnet);
    const encryptedBackupPhrase = wallet.encryptedBackupPhrase;
    const plainTextBuffer = await decrypt(Buffer.from(encryptedBackupPhrase, 'hex'), pass);
    const backupPhrase = plainTextBuffer.toString();
    expect(backupPhrase.split(' ').length).toEqual(24);
  });

  test('generates a config private key', async () => {
    const wallet = await Wallet.generate('password', ChainID.Testnet);
    expect(wallet.configPrivateKey).not.toBeFalsy();
    const node = ECPair.fromPrivateKey(Buffer.from(wallet.configPrivateKey, 'hex'));
    expect(node.privateKey).not.toBeFalsy();
  });
});

test('returns null if no config in gaia', async () => {
  fetchMock
    .once(
      JSON.stringify({
        read_url_prefix: 'https://gaia.blockstack.org/hub/',
        challenge_text: '["gaiahub","0","gaia-0","blockstack_storage_please_sign"]',
        latest_auth_version: 'v1',
      })
    )
    .once('', { status: 404 });
  const wallet = await Wallet.generate('password', ChainID.Testnet);
  const hubConfig = await wallet.createGaiaConfig('https://gaia.blockstack.org');
  const config = await wallet.fetchConfig(hubConfig);
  expect(config).toBeFalsy();
  expect(wallet.walletConfig).toBeFalsy();
  expect(fetchMock.mock.calls.length).toEqual(2);
});

test('returns config if present', async () => {
  const stubConfig: WalletConfig = {
    identities: [
      {
        username: 'hankstoever.id',
        address: '',
        apps: {
          'http://localhost:3000': {
            origin: 'http://localhost:3000',
            scopes: ['read_write'],
            name: 'Tester',
            appIcon: 'http://example.com/icon.png',
            lastLoginAt: new Date().getTime(),
          },
        },
      },
    ],
  };

  const wallet = await Wallet.generate('password', ChainID.Testnet);
  const publicKey = getPublicKeyFromPrivate(wallet.configPrivateKey);
  const encrypted = await encryptContent(JSON.stringify(stubConfig), { publicKey });

  fetchMock
    .once(
      JSON.stringify({
        read_url_prefix: 'https://gaia.blockstack.org/hub/',
        challenge_text: '["gaiahub","0","gaia-0","blockstack_storage_please_sign"]',
        latest_auth_version: 'v1',
      })
    )
    .once(encrypted);

  const hubConfig = await wallet.createGaiaConfig('https://gaia.blockstack.org');
  const config = await wallet.fetchConfig(hubConfig);
  expect(config).not.toBeFalsy();
  if (!config) {
    throw 'Must have config present';
  }
  expect(config.identities.length).toEqual(1);
  const identity = config.identities[0];
  expect(identity.apps['http://localhost:3000']).toEqual(
    stubConfig.identities[0].apps['http://localhost:3000']
  );
});

test('creates a config', async () => {
  fetchMock
    .once(
      JSON.stringify({
        read_url_prefix: 'https://gaia.blockstack.org/hub/',
        challenge_text: '["gaiahub","0","gaia-0","blockstack_storage_please_sign"]',
        latest_auth_version: 'v1',
      })
    )
    .once('', { status: 404 })
    .once(JSON.stringify({ publicUrl: 'asdf' }));
  const wallet = await Wallet.generate('password', ChainID.Testnet);
  const hubConfig = await wallet.createGaiaConfig('https://gaia.blockstack.org');
  const config = await wallet.getOrCreateConfig({ gaiaConfig: hubConfig });
  expect(Object.keys(config.identities[0].apps).length).toEqual(0);
  const { body } = fetchMock.mock.calls[2][1];
  const decrypted = (await decryptContent(body, { privateKey: wallet.configPrivateKey })) as string;
  expect(JSON.parse(decrypted)).toEqual(config);
});

test('updates wallet config', async () => {
  fetchMock
    .once(
      JSON.stringify({
        read_url_prefix: 'https://gaia.blockstack.org/hub/',
        challenge_text: '["gaiahub","0","gaia-0","blockstack_storage_please_sign"]',
        latest_auth_version: 'v1',
      })
    )
    .once('', { status: 404 })
    .once(JSON.stringify({ publicUrl: 'asdf' }))
    .once(JSON.stringify({ publicUrl: 'asdf' }));

  const wallet = await Wallet.generate('password', ChainID.Testnet);
  const gaiaConfig = await wallet.createGaiaConfig('https://gaia.blockstack.org');
  await wallet.getOrCreateConfig({ gaiaConfig });
  const app: ConfigApp = {
    origin: 'http://localhost:5000',
    scopes: ['read_write'],
    lastLoginAt: new Date().getTime(),
    name: 'Tester',
    appIcon: 'asdf',
  };
  await wallet.updateConfigWithAuth({
    identityIndex: 0,
    app,
    gaiaConfig,
  });
  expect(fetchMock.mock.calls.length).toEqual(4);
  const body = JSON.parse(fetchMock.mock.calls[3][1].body);
  const decrypted = (await decryptContent(JSON.stringify(body), {
    privateKey: wallet.configPrivateKey,
  })) as string;
  const config = JSON.parse(decrypted);
  expect(config).toEqual(wallet.walletConfig);
});

test('updates config for reusing id warning', async () => {
  fetchMock
    .once(
      JSON.stringify({
        read_url_prefix: 'https://gaia.blockstack.org/hub/',
        challenge_text: '["gaiahub","0","gaia-0","blockstack_storage_please_sign"]',
        latest_auth_version: 'v1',
      })
    )
    .once('', { status: 404 })
    .once(JSON.stringify({ publicUrl: 'asdf' }))
    .once(JSON.stringify({ publicUrl: 'asdf' }));

  const wallet = await Wallet.generate('password', ChainID.Testnet);
  const gaiaConfig = await wallet.createGaiaConfig('https://gaia.blockstack.org');
  await wallet.getOrCreateConfig({ gaiaConfig });
  expect(wallet.walletConfig?.hideWarningForReusingIdentity).toBeFalsy();
  await wallet.updateConfigForReuseWarning({ gaiaConfig });
  expect(wallet.walletConfig?.hideWarningForReusingIdentity).toBeTruthy();
  expect(fetchMock.mock.calls.length).toEqual(4);
  const body = JSON.parse(fetchMock.mock.calls[3][1].body);
  const decrypted = (await decryptContent(JSON.stringify(body), {
    privateKey: wallet.configPrivateKey,
  })) as string;
  const config = JSON.parse(decrypted);
  expect(config.hideWarningForReusingIdentity).toBeTruthy();
});

test('restoreIdentities', async () => {
  const wallet = await Wallet.generate('password', ChainID.Testnet);

  const stubConfig: WalletConfig = {
    identities: [
      {
        username: 'hankstoever.id',
        address: '',
        apps: {},
      },
      {
        username: 'hankstoever2.id',
        address: '',
        apps: {},
      },
      {
        username: 'hankstoever3.id',
        address: '',
        apps: {},
      },
    ],
  };

  const publicKey = getPublicKeyFromPrivate(wallet.configPrivateKey);
  const encrypted = await encryptContent(JSON.stringify(stubConfig), { publicKey });
  fetchMock.once(encrypted);

  const plainTextBuffer = await decrypt(
    Buffer.from(wallet.encryptedBackupPhrase, 'hex'),
    'password'
  );
  const seed = await mnemonicToSeed(plainTextBuffer);
  const rootNode = bip32.fromSeed(seed);
  await wallet.restoreIdentities({ gaiaReadURL: DEFAULT_GAIA_HUB, rootNode });
  expect(wallet.identities.length).toEqual(3);
  expect(wallet.identities[0].defaultUsername).toEqual('hankstoever.id');
  expect(wallet.identities[1].defaultUsername).toEqual('hankstoever2.id');
  expect(wallet.identities[2].defaultUsername).toEqual('hankstoever3.id');
});
