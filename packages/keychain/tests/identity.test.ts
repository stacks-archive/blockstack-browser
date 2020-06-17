import './setup';
import { makeECPrivateKey, getPublicKeyFromPrivate } from 'blockstack/lib/keys';
import { decryptPrivateKey } from 'blockstack/lib/auth/authMessages';
import { decodeToken } from 'jsontokens';
import { getIdentity, profileResponse } from './helpers';
import { ecPairToAddress } from 'blockstack';
import { ECPair } from 'bitcoinjs-lib';
import { getAddress } from '../src';
import { TransactionVersion } from '@blockstack/stacks-transactions';

interface Decoded {
  [key: string]: any;
}

test('generates an auth response', async () => {
  const identity = await getIdentity();
  const appDomain = 'https://banter.pub';
  const gaiaUrl = 'https://hub.blockstack.org';
  const transitPrivateKey = makeECPrivateKey();
  const transitPublicKey = getPublicKeyFromPrivate(transitPrivateKey);

  fetchMock.once(JSON.stringify({ read_url_prefix: 'https://gaia.blockstack.org/hub/' }));

  const authResponse = await identity.makeAuthResponse({ appDomain, gaiaUrl, transitPublicKey });
  const decoded = decodeToken(authResponse);
  const { payload } = decoded as Decoded;
  expect(payload.profile_url).toEqual(
    `https://gaia.blockstack.org/hub/${identity.address}/profile.json`
  );
  const appPrivateKey = await decryptPrivateKey(transitPrivateKey, payload.private_key);
  const expectedKey = '6f8b6a170f8b2ee57df5ead49b0f4c8acde05f9e1c4c6ef8223d6a42fabfa314';
  expect(appPrivateKey).toEqual(expectedKey);
});

test('adds to apps in profile if publish_data scope', async () => {
  fetchMock
    .once(JSON.stringify({}), { status: 404 }) // wallet config
    .once(JSON.stringify({}), { status: 404 }) // username lookup
    .once(JSON.stringify({}), { status: 404 }) // profile lookup
    .once(JSON.stringify({ read_url_prefix: 'https://gaia.blockstack.org/hub/' }))
    .once(JSON.stringify({}), { status: 404 })
    .once(JSON.stringify({ read_url_prefix: 'https://gaia.blockstack.org/hub/' }))
    .once(JSON.stringify({ read_url_prefix: 'https://gaia.blockstack.org/hub/' }))
    .once(JSON.stringify({}));
  const identity = await getIdentity();
  const appDomain = 'https://banter.pub';
  const gaiaUrl = 'https://hub.blockstack.org';
  const transitPrivateKey = makeECPrivateKey();
  const transitPublicKey = getPublicKeyFromPrivate(transitPrivateKey);

  const authResponse = await identity.makeAuthResponse({
    appDomain,
    gaiaUrl,
    transitPublicKey,
    scopes: ['publish_data'],
  });
  const decoded = decodeToken(authResponse);
  const { payload } = decoded as Decoded;
  expect(payload.profile.apps['https://banter.pub']).not.toBeFalsy();
  const profile = JSON.parse(fetchMock.mock.calls[7][1].body);
  const { apps, appsMeta } = profile[0].decodedToken.payload.claim;
  expect(apps[appDomain]).not.toBeFalsy();
  const appPrivateKey = await decryptPrivateKey(transitPrivateKey, payload.private_key);
  const challengeSigner = ECPair.fromPrivateKey(Buffer.from(appPrivateKey as string, 'hex'));
  const expectedDomain = `https://gaia.blockstack.org/hub/${ecPairToAddress(challengeSigner)}/`;
  expect(apps[appDomain]).toEqual(expectedDomain);
  expect(appsMeta[appDomain]).not.toBeFalsy();
  expect(appsMeta[appDomain].storage).toEqual(expectedDomain);
  expect(appsMeta[appDomain].publicKey).toEqual(challengeSigner.publicKey.toString('hex'));
});

test('generates an app private key', async () => {
  const expectedKey = '6f8b6a170f8b2ee57df5ead49b0f4c8acde05f9e1c4c6ef8223d6a42fabfa314';
  const identity = await getIdentity();
  const appPrivateKey = identity.appPrivateKey('https://banter.pub');
  expect(appPrivateKey).toEqual(expectedKey);
});

test('generates an app private key for a different seed', async () => {
  const identity = await getIdentity(
    'monster toilet shoe giggle welcome coyote enact glass copy era shed foam'
  );
  const appPrivateKey = identity.appPrivateKey('https://banter.pub');
  expect(appPrivateKey).toEqual('a7bf3ecf0dd68a23a6621c39780d6cae3776240251a7988fed9ecfda2699ffe8');
});

test('gets default profile URL', async () => {
  const identity = await getIdentity();
  const gaiaUrl = 'https://gaia.blockstack.org/hub/';
  expect(await identity.profileUrl(gaiaUrl)).toEqual(
    'https://gaia.blockstack.org/hub/1JeTQ5cQjsD57YGcsVFhwT7iuQUXJR6BSk/profile.json'
  );
});

describe('refresh', () => {
  test('can fetch names for an identity', async () => {
    const identity = await getIdentity();

    fetchMock.once(JSON.stringify({ names: ['myname.id'] }));
    fetchMock.once(JSON.stringify(profileResponse));

    await identity.refresh();
    expect(identity.defaultUsername).toEqual('myname.id');
    expect(identity.usernames).toEqual(['myname.id']);
  });

  test('can fetch multiple usernames', async () => {
    const identity = await getIdentity();

    fetchMock.once(JSON.stringify({ names: ['myname.id', 'second.id'] }));
    fetchMock.once(JSON.stringify(profileResponse));

    await identity.refresh();
    expect(identity.defaultUsername).toEqual('myname.id');
    expect(identity.usernames).toEqual(['myname.id', 'second.id']);
  });

  test('doesnt throw is no names found', async () => {
    const identity = await getIdentity();

    fetchMock.once(JSON.stringify({ error: 'Invalid address' }));
    fetchMock.once(JSON.stringify(profileResponse));

    await identity.refresh();
    expect(identity.defaultUsername).toEqual(undefined);
  });

  test('can fetch profiles', async () => {
    const identity = await getIdentity();

    fetchMock.once(JSON.stringify({ error: 'Invalid address' }));
    fetchMock.once(JSON.stringify(profileResponse));

    await identity.refresh();
    expect(identity.profile).toBeTruthy();
    expect(identity.profile?.apps).toBeTruthy();
    expect(identity.profile?.name).toBeFalsy();
  });
});
