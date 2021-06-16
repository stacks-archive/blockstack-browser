import { useWallet } from '@common/hooks/use-wallet';
import { hasSwitchedAccountsState, transactionAccountIndexState } from '@store/accounts';
import { useCallback } from 'react';
import { transactionNetworkVersionState } from '@store/transactions';
import { useAtomValue } from 'jotai/utils';
import { useAtom } from 'jotai';
import { useCurrentAccount } from '@common/hooks/account/use-current-account';

const TIMEOUT = 350;

export const useSwitchAccount = (callback?: () => void) => {
  const { doSwitchAccount } = useWallet();
  const currentAccount = useCurrentAccount();
  const txIndex = useAtomValue(transactionAccountIndexState);
  const transactionVersion = useAtomValue(transactionNetworkVersionState);
  const [hasSwitched, setHasSwitched] = useAtom(hasSwitchedAccountsState);

  const handleSwitchAccount = useCallback(
    async index => {
      if (typeof txIndex === 'number') setHasSwitched(true);
      await doSwitchAccount(index);
      if (callback) {
        window.setTimeout(() => {
          callback();
        }, TIMEOUT);
      }
    },
    [txIndex, setHasSwitched, doSwitchAccount, callback]
  );

  const getIsActive = useCallback(
    (index: number) =>
      typeof txIndex === 'number' && !hasSwitched
        ? index === txIndex
        : index === currentAccount?.index,
    [txIndex, hasSwitched, currentAccount]
  );

  return { handleSwitchAccount, getIsActive, transactionVersion };
};
