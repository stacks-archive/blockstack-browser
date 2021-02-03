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
// import { WalletStore, walletStore } from '../storage';

/**
 * Manage a wallet instance, stored in memory in the background script
 */
export interface Vault {
  encryptedSecretKey?: string;
  secretKey?: string;
  wallet?: SDKWallet;
  currentAccountIndex?: number;
  hasSetPassword: boolean;
}

const encryptedKeyIdentifier = 'stacks-wallet-encrypted-key' as const;

const defaultVault: Vault = {
  encryptedSecretKey: undefined,
  hasSetPassword: false,
} as const;

let vault: Vault = {
  ...defaultVault,
  encryptedSecretKey: localStorage.getItem(encryptedKeyIdentifier) || undefined,
};

export const getVault = () => {
  return vault;
};

export const vaultMessageHandler = async (message: MessageFromApp) => {
  vault = await vaultReducer(message);
  if (vault.encryptedSecretKey) {
    localStorage.setItem(encryptedKeyIdentifier, vault.encryptedSecretKey);
  } else {
    localStorage.removeItem(encryptedKeyIdentifier);
  }
  return vault;
};

async function storeSeed(secretKey: string, password?: string): Promise<Vault> {
  const generatedWallet = await generateWallet({
    secretKey,
    password: password || DEFAULT_PASSWORD,
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
        encryptedSecretKey: _wallet.encryptedSecretKey,
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
      void updateConfig();
      return {
        ...vault,
        wallet,
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
      const encryptedBuffer = await encrypt(secretKey, password);
      return {
        ...vault,
        encryptedSecretKey: encryptedBuffer.toString('hex'),
        hasSetPassword: true,
      };
    }
    case Methods.unlockWallet: {
      const { payload: password } = message;
      const { encryptedSecretKey } = vault;
      if (!encryptedSecretKey) {
        throw new Error('Unable to unlock - logged out.');
      }
      const secretKey = await decrypt(Buffer.from(encryptedSecretKey, 'hex'), password);
      const newVault = await storeSeed(secretKey, password);
      return {
        ...newVault,
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
