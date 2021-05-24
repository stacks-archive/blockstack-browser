import { accountNameState } from '@store/names';
import { useLoadable } from '@common/hooks/use-loadable';
import { useCurrentAccount } from '@common/hooks/use-current-account';

export function useAccountNames() {
  return useLoadable(accountNameState);
}

export function useAccountDisplayName() {
  const names = useAccountNames();
  const account = useCurrentAccount();
  if (!account || typeof account?.index !== 'number') return 'Account';
  return names.value?.[account.index]?.names?.[0] || `Account ${account?.index + 1}`;
}
