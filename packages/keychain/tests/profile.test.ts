import './setup';
import {
  signProfileForUpload,
  DEFAULT_PROFILE,
  registerSubdomain,
  Subdomains,
  registrars,
} from '../src/profiles';
import { getIdentity, getNewIdentity } from './helpers';
import { decodeToken, TokenVerifier } from 'jsontokens';
import { makeProfileZoneFile } from 'blockstack';

describe('signProfileForUpload', () => {
  it('should create a signed JSON string', async () => {
    const identity = await getIdentity();
    const signedJSON = signProfileForUpload(DEFAULT_PROFILE, identity.keyPair);
    const profile = JSON.parse(signedJSON);
    expect(profile.length).toEqual(1);
    const [data] = profile;
    expect(data.token).not.toBeFalsy();
    const { claim } = data.decodedToken.payload;
    expect(claim).toEqual(DEFAULT_PROFILE);
    const decoded = decodeToken(data.token);
    expect(decoded.payload).toEqual(data.decodedToken.payload);
    const verifier = new TokenVerifier('ES256K', data.decodedToken.payload.issuer.publicKey);
    expect(verifier.verify(data.token)).toBeTruthy();
  });
});

describe('registerSubdomain', () => {
  it('should register a test username', async () => {
    fetchMock
      .once(
        JSON.stringify({
          read_url_prefix: 'https://gaia.blockstack.org/hub/',
          challenge_text: '["gaiahub","0","gaia-0","blockstack_storage_please_sign"]',
          latest_auth_version: 'v1',
        })
      )
      .once(JSON.stringify({ publicURL: 'http://gaia.com/profile.json' }))
      .once(JSON.stringify({ success: true }));

    const identity = await getNewIdentity();
    await registerSubdomain({
      identity,
      gaiaHubUrl: 'http://gaia.com',
      username: 'tester',
      subdomain: Subdomains.TEST,
    });
    expect(identity.defaultUsername).toEqual('tester.test-personal.id');
    expect(identity.usernames).toEqual(['tester.test-personal.id']);
    expect(fetchMock.mock.calls.length).toEqual(3);
    const [registrarUrl, fetchOpts] = fetchMock.mock.calls[2];
    expect(registrarUrl).toEqual(registrars[Subdomains.TEST].registerUrl);
    expect(fetchOpts.method).toEqual('POST');
    const zoneFile = makeProfileZoneFile('tester.test-personal.id', 'http://gaia.com/profile.json');
    expect(JSON.parse(fetchOpts.body)).toEqual({
      name: 'tester',
      owner_address: identity.address,
      zonefile: zoneFile,
    });
  });
});
