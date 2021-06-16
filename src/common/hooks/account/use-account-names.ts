import { accountNameState } from '@store/accounts/names';
import { Account } from '@stacks/wallet-sdk';
import { useCurrentAccount } from '@common/hooks/account/use-current-account';
import { cleanUsername } from '@common/utils';
import { useAtomValue } from 'jotai/utils';
import { useMemo } from 'react';

export function useAccountNames() {
  const atom = useMemo(() => accountNameState, []);
  return useAtomValue(atom);
}

export function useAccountDisplayName(__account?: Account) {
  const names = useAccountNames();
  const _account = useCurrentAccount();
  const account = __account || _account;
  if (!account || typeof account?.index !== 'number') return 'Account';
  return (
    names?.[account.index]?.names?.[0] ||
    (account?.username && cleanUsername(account.username)) ||
    `Account ${account?.index + 1}`
  );
}
