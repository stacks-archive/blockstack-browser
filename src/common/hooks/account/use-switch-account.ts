import { useWallet } from '@common/hooks/use-wallet';
import { useRecoilState, useRecoilValue } from 'recoil';
import { hasSwitchedAccountsState, transactionAccountIndexState } from '@store/accounts';
import { useCallback } from 'react';
import { transactionNetworkVersionState } from '@store/transactions';

const TIMEOUT = 350;

export const useSwitchAccount = (callback?: () => void) => {
  const { wallet, currentAccountIndex, doSwitchAccount } = useWallet();
  const txIndex = useRecoilValue(transactionAccountIndexState);
  const transactionVersion = useRecoilValue(transactionNetworkVersionState);
  const [hasSwitched, setHasSwitched] = useRecoilState(hasSwitchedAccountsState);

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

  const accounts = wallet?.accounts || [];
  const getIsActive = (index: number) =>
    typeof txIndex === 'number' && !hasSwitched ? index === txIndex : index === currentAccountIndex;

  return { accounts, handleSwitchAccount, getIsActive, transactionVersion };
};
