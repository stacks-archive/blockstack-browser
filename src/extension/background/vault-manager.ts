import { gaiaUrl } from '@common/constants';
import { MessageFromApp, Methods } from '@extension/message-types';
import {
  createWalletGaiaConfig,
  decrypt,
  encrypt,
  generateNewAccount,
  generateSecretKey,
  generateWallet,
  restoreWalletAccounts,
  updateWalletConfig,
  Wallet as SDKWallet,
} from '@stacks/wallet-sdk';
import { DEFAULT_PASSWORD } from '@store/onboarding/types';
import argon2, { ArgonType } from 'argon2-browser';

/**
 * Manage a wallet instance, stored in memory in the background script
 */
export interface Vault {
  encryptedSecretKey?: string;
  salt?: string;
  secretKey?: string;
  wallet?: SDKWallet;
  currentAccountIndex?: number;
  hasSetPassword: boolean;
}

const encryptedKeyIdentifier = 'stacks-wallet-encrypted-key' as const;
const hasSetPasswordIdentifier = 'stacks-wallet-has-set-password' as const;
const saltIdentifier = 'stacks-wallet-salt' as const;

const defaultVault: Vault = {
  encryptedSecretKey: undefined,
  hasSetPassword: false,
  salt: undefined,
} as const;

function getHasSetPassword() {
  const persisted = localStorage.getItem(hasSetPasswordIdentifier);
  if (persisted !== null) {
    return JSON.parse(persisted);
  }
  return false;
}

let vault: Vault = {
  ...defaultVault,
  encryptedSecretKey: localStorage.getItem(encryptedKeyIdentifier) || undefined,
  hasSetPassword: getHasSetPassword(),
  salt: localStorage.getItem(saltIdentifier) || undefined,
};

export const getVault = () => {
  return vault;
};

function persistOptional(storageKey: string, value?: string) {
  if (value) {
    localStorage.setItem(storageKey, value);
  } else {
    localStorage.removeItem(storageKey);
  }
}

export const vaultMessageHandler = async (message: MessageFromApp) => {
  vault = await vaultReducer(message);
  persistOptional(encryptedKeyIdentifier, vault.encryptedSecretKey);
  persistOptional(saltIdentifier, vault.salt);
  localStorage.setItem(hasSetPasswordIdentifier, JSON.stringify(vault.hasSetPassword));
  return vault;
};

export function generateRandomHexString() {
  const size = 16;
  const randomValues = [...crypto.getRandomValues(new Uint8Array(size))];
  return randomValues.map(val => ('00' + val.toString(16)).slice(-2)).join('');
}

async function storeSeed(secretKey: string, password?: string): Promise<Vault> {
  const pw = password || DEFAULT_PASSWORD;
  const generatedWallet = await generateWallet({
    secretKey,
    password: pw,
  });
  const _wallet = await restoreWalletAccounts({
    wallet: generatedWallet,
    gaiaHubUrl: gaiaUrl,
  });
  const hasSetPassword = password !== undefined;
  return {
    ...vault,
    wallet: _wallet,
    secretKey,
    encryptedSecretKey: vault.encryptedSecretKey,
    currentAccountIndex: 0,
    hasSetPassword,
  };
}

async function generateHash({ password, salt }: { password: string; salt: string }) {
  const argonHash = await argon2.hash({
    pass: password,
    salt,
    hashLen: 48,
    time: 44,
    mem: 1024 * 32,
    type: ArgonType.Argon2id,
  });
  return argonHash.hashHex;
}

async function encryptMnemonic({ secretKey, password }: { secretKey: string; password: string }) {
  const salt = generateRandomHexString();
  const argonHash = await generateHash({ password, salt });
  const encryptedBuffer = await encrypt(secretKey, argonHash);
  return {
    salt,
    encryptedSecretKey: encryptedBuffer.toString('hex'),
  };
}

/**
 * Decrypt an encrypted secret key. If no salt is present, then this encrypted key was
 * generated before introducing Argon2 hashing. If that is true, then
 * decrypt the secret key and re-encrypt it using an Argon2 hashed password.
 */
async function decryptMnemonic({
  encryptedSecretKey,
  password,
  salt,
}: {
  encryptedSecretKey: string;
  password: string;
  salt?: string;
}): Promise<{
  encryptedSecretKey: string;
  salt: string;
  secretKey: string;
}> {
  if (salt) {
    const pw = await generateHash({ password, salt });
    const secretKey = await decrypt(Buffer.from(encryptedSecretKey, 'hex'), pw);
    return {
      secretKey,
      encryptedSecretKey,
      salt,
    };
  } else {
    // if there is no salt, decrypt the secret key, then re-encrypt with an argon2 hash
    const secretKey = await decrypt(Buffer.from(encryptedSecretKey, 'hex'), password);
    const newEncryptedKey = await encryptMnemonic({ secretKey, password });
    return {
      secretKey,
      encryptedSecretKey: newEncryptedKey.encryptedSecretKey,
      salt: newEncryptedKey.salt,
    };
  }
}

// Ensure that TS will flag unhandled messages,
// and will throw at runtime
function throwUnhandledMethod(message: never): never;
function throwUnhandledMethod(message: MessageFromApp) {
  throw new Error(`Unhandled message: ${JSON.stringify(message, null, 2)}`);
}

export const vaultReducer = async (message: MessageFromApp): Promise<Vault> => {
  switch (message.method) {
    case Methods.walletRequest:
      return {
        ...vault,
      };
    case Methods.makeWallet: {
      const secretKey = generateSecretKey(256);
      const _wallet = await generateWallet({ secretKey, password: DEFAULT_PASSWORD });
      return {
        ...vault,
        secretKey,
        wallet: _wallet,
        currentAccountIndex: 0,
      };
    }
    case Methods.storeSeed: {
      const { secretKey, password } = message.payload;
      return storeSeed(secretKey, password);
    }
    case Methods.createNewAccount: {
      const { secretKey, wallet } = vault;
      if (!secretKey || !wallet) {
        throw 'Unable to create a new account - not logged in.';
      }
      const newWallet = generateNewAccount(wallet);
      const updateConfig = async () => {
        const gaiaHubConfig = await createWalletGaiaConfig({ gaiaHubUrl: gaiaUrl, wallet });
        await updateWalletConfig({
          wallet: newWallet,
          gaiaHubConfig,
        });
      };
      await updateConfig();
      return {
        ...vault,
        wallet: newWallet,
        currentAccountIndex: newWallet.accounts.length - 1,
      };
    }
    case Methods.signOut: {
      return {
        ...defaultVault,
      };
    }
    case Methods.setPassword: {
      const { payload: password } = message;
      const { secretKey } = vault;
      if (!secretKey) {
        throw new Error('Cannot set password - not logged in.');
      }
      const { encryptedSecretKey, salt } = await encryptMnemonic({ secretKey, password });
      return {
        ...vault,
        encryptedSecretKey,
        salt,
        hasSetPassword: true,
      };
    }
    case Methods.unlockWallet: {
      const { payload: password } = message;
      const { encryptedSecretKey, salt } = vault;
      if (!encryptedSecretKey) {
        throw new Error('Unable to unlock - logged out.');
      }
      const decryptedData = await decryptMnemonic({
        encryptedSecretKey,
        password,
        salt,
      });
      const newVault = await storeSeed(decryptedData.secretKey, password);
      return {
        ...newVault,
        salt: decryptedData.salt,
        encryptedSecretKey: decryptedData.encryptedSecretKey,
      };
    }
    case Methods.lockWallet: {
      return {
        ...vault,
        wallet: undefined,
        secretKey: undefined,
      };
    }
    case Methods.switchAccount: {
      const { wallet } = vault;
      const newIndex = message.payload;
      const accountNumber = (newIndex as number) + 1;
      if (!wallet || wallet.accounts.length < accountNumber) {
        throw new Error(
          `Cannot switch to account ${accountNumber}, only ${wallet?.accounts.length} accounts.`
        );
      }
      return {
        ...vault,
        currentAccountIndex: newIndex,
      };
    }
    default:
      throwUnhandledMethod(message);
  }
};
