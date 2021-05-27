import { ExtensionMethods, InternalMethods, Message } from '@content-scripts/message-types';

/**
 * Vault <-> Background Script
 */
export type VaultMessage<M extends ExtensionMethods, P> = Omit<Message<M, P>, 'source'>;

export type GetWallet = VaultMessage<InternalMethods.getWallet, undefined>;
export type MakeWallet = VaultMessage<InternalMethods.makeWallet, undefined>;
export type StoreSeed = VaultMessage<
  InternalMethods.storeSeed,
  { secretKey: string; password?: string }
>;
export type CreateNewAccount = VaultMessage<InternalMethods.createNewAccount, undefined>;
export type SignOut = VaultMessage<InternalMethods.signOut, undefined>;
export type SetPassword = VaultMessage<InternalMethods.setPassword, string>;
export type UnlockWallet = VaultMessage<InternalMethods.unlockWallet, string>;
export type LockWallet = VaultMessage<InternalMethods.lockWallet, undefined>;
export type SwitchAccount = VaultMessage<InternalMethods.switchAccount, number>;

export type VaultActions =
  | GetWallet
  | MakeWallet
  | StoreSeed
  | CreateNewAccount
  | SignOut
  | SetPassword
  | UnlockWallet
  | SwitchAccount
  | LockWallet;
