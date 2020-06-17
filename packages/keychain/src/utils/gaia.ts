import { TokenSigner, Json } from 'jsontokens';
import { getPublicKeyFromPrivate } from 'blockstack/lib/keys';
import { randomBytes } from 'blockstack/lib/encryption/cryptoRandom';
import { ecPairToAddress, hexStringToECPair } from 'blockstack';
import { GaiaHubConfig } from 'blockstack/lib/storage/hub';

export const DEFAULT_GAIA_HUB = 'https://gaia.blockstack.org/hub/';

interface HubInfo {
  challenge_text?: string;
  read_url_prefix: string;
}

export const getHubInfo = async (hubUrl: string) => {
  const response = await fetch(`${hubUrl}/hub_info`);
  const data: HubInfo = await response.json();
  return data;
};

export const getHubPrefix = async (hubUrl: string) => {
  const { read_url_prefix } = await getHubInfo(hubUrl);
  return read_url_prefix;
};

export const makeGaiaAssociationToken = (
  secretKeyHex: string,
  childPublicKeyHex: string
): string => {
  const LIFETIME_SECONDS = 365 * 24 * 3600;
  const signerKeyHex = secretKeyHex.slice(0, 64);
  const compressedPublicKeyHex = getPublicKeyFromPrivate(signerKeyHex);
  const salt = randomBytes(16).toString('hex');
  const payload = {
    childToAssociate: childPublicKeyHex,
    iss: compressedPublicKeyHex,
    exp: LIFETIME_SECONDS + new Date().getTime() / 1000,
    iat: Date.now() / 1000,
    salt,
  };

  const tokenSigner = new TokenSigner('ES256K', signerKeyHex);
  const token = tokenSigner.sign(payload);
  return token;
};

interface ConnectToGaiaOptions {
  hubInfo: HubInfo;
  privateKey: string;
  gaiaHubUrl: string;
}

export const connectToGaiaHubWithConfig = ({
  hubInfo,
  privateKey,
  gaiaHubUrl,
}: ConnectToGaiaOptions): GaiaHubConfig => {
  const readURL = hubInfo.read_url_prefix;
  const token = makeGaiaAuthToken({ hubInfo, privateKey, gaiaHubUrl });
  const address = ecPairToAddress(
    hexStringToECPair(privateKey + (privateKey.length === 64 ? '01' : ''))
  );
  return {
    url_prefix: readURL,
    max_file_upload_size_megabytes: 100,
    address,
    token,
    server: gaiaHubUrl,
  };
};

interface ReadOnlyGaiaConfigOptions {
  readURL: string;
  privateKey: string;
}

/**
 * When you already know the Gaia read URL, make a Gaia config that doesn't have to fetch `/hub_info`
 */
export const makeReadOnlyGaiaConfig = ({
  readURL,
  privateKey,
}: ReadOnlyGaiaConfigOptions): GaiaHubConfig => {
  const address = ecPairToAddress(
    hexStringToECPair(privateKey + (privateKey.length === 64 ? '01' : ''))
  );
  return {
    url_prefix: readURL,
    max_file_upload_size_megabytes: 100,
    address,
    token: 'not_used',
    server: 'not_used',
  };
};

interface GaiaAuthPayload {
  gaiaHubUrl: string;
  iss: string;
  salt: string;
  [key: string]: Json;
}

const makeGaiaAuthToken = ({ hubInfo, privateKey, gaiaHubUrl }: ConnectToGaiaOptions) => {
  const challengeText = hubInfo.challenge_text;
  const iss = getPublicKeyFromPrivate(privateKey);

  const salt = randomBytes(16).toString('hex');
  const payload: GaiaAuthPayload = {
    gaiaHubUrl,
    iss,
    salt,
  };
  if (challengeText) {
    payload.gaiaChallenge = challengeText;
  }
  const token = new TokenSigner('ES256K', privateKey).sign(payload);
  return `v1:${token}`;
};

export const uploadToGaiaHub = async (
  filename: string,
  contents: Blob | Buffer | ArrayBufferView | string,
  hubConfig: GaiaHubConfig
): Promise<string> => {
  const contentType = 'application/json';

  const response = await fetch(`${hubConfig.server}/store/${hubConfig.address}/${filename}`, {
    method: 'POST',
    headers: {
      'Content-Type': contentType,
      Authorization: `bearer ${hubConfig.token}`,
    },
    body: contents,
    referrer: 'no-referrer',
    referrerPolicy: 'no-referrer',
  });
  const { publicURL } = await response.json();
  return publicURL;
};
