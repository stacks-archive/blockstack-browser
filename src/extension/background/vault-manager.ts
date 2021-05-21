import {
  createWalletGaiaConfig,
  generateNewAccount,
  generateSecretKey,
  generateWallet,
  restoreWalletAccounts,
  updateWalletConfig,
  Wallet as SDKWallet,
} from '@stacks/wallet-sdk';

import { gaiaUrl } from '@common/constants';
import { VaultMessageFromApp, Methods } from '@extension/message-types';
import { decryptMnemonic, encryptMnemonic } from '@extension/crypto/mnemonic-encryption';
import { DEFAULT_PASSWORD } from '@store/types';

/**
 * Manage a wallet instance, stored in memory in the background script
 */
export interface InMemoryVault {
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

const defaultVault: InMemoryVault = {
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

let inMemoryVault: InMemoryVault = {
  ...defaultVault,
  encryptedSecretKey: localStorage.getItem(encryptedKeyIdentifier) || undefined,
  hasSetPassword: getHasSetPassword(),
  salt: localStorage.getItem(saltIdentifier) || undefined,
};

export const getVault = () => inMemoryVault;

function persistOptional(storageKey: string, value?: string) {
  if (value) {
    localStorage.setItem(storageKey, value);
  } else {
    localStorage.removeItem(storageKey);
  }
}

export async function vaultMessageHandler(message: VaultMessageFromApp) {
  inMemoryVault = await vaultReducer(message);
  persistOptional(encryptedKeyIdentifier, inMemoryVault.encryptedSecretKey);
  persistOptional(saltIdentifier, inMemoryVault.salt);
  localStorage.setItem(hasSetPasswordIdentifier, JSON.stringify(inMemoryVault.hasSetPassword));
  return inMemoryVault;
}

async function storeSeed(secretKey: string, password?: string): Promise<InMemoryVault> {
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
    ...inMemoryVault,
    wallet: _wallet,
    secretKey,
    encryptedSecretKey: inMemoryVault.encryptedSecretKey,
    currentAccountIndex: 0,
    hasSetPassword,
  };
}

// Ensure that TS will flag unhandled messages,
// and will throw at runtime
function throwUnhandledMethod(message: never): never;
function throwUnhandledMethod(message: VaultMessageFromApp) {
  throw new Error(`Unhandled message: ${JSON.stringify(message, null, 2)}`);
}

export const vaultReducer = async (message: VaultMessageFromApp): Promise<InMemoryVault> => {
  switch (message.method) {
    case Methods.walletRequest:
      return {
        ...inMemoryVault,
      };
    case Methods.makeWallet: {
      const secretKey = generateSecretKey(256);
      const _wallet = await generateWallet({ secretKey, password: DEFAULT_PASSWORD });
      return {
        ...inMemoryVault,
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
      const { secretKey, wallet } = inMemoryVault;
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
        ...inMemoryVault,
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
      const { secretKey } = inMemoryVault;
      if (!secretKey) {
        throw new Error('Cannot set password - not logged in.');
      }
      const { encryptedSecretKey, salt } = await encryptMnemonic({ secretKey, password });
      return {
        ...inMemoryVault,
        encryptedSecretKey,
        salt,
        hasSetPassword: true,
      };
    }
    case Methods.unlockWallet: {
      const { payload: password } = message;
      const { encryptedSecretKey, salt } = inMemoryVault;
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
        ...inMemoryVault,
        wallet: undefined,
        secretKey: undefined,
      };
    }
    case Methods.switchAccount: {
      const { wallet } = inMemoryVault;
      const newIndex = message.payload;
      const accountNumber = (newIndex as number) + 1;
      if (!wallet || wallet.accounts.length < accountNumber) {
        throw new Error(
          `Cannot switch to account ${accountNumber}, only ${wallet?.accounts.length} accounts.`
        );
      }
      return {
        ...inMemoryVault,
        currentAccountIndex: newIndex,
      };
    }
    default:
      throwUnhandledMethod(message);
  }
};
