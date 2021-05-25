import { useRecoilValue } from 'recoil';
import { currentAccountState, currentAccountStxAddressState } from '@store/accounts';

export function useCurrentAccount() {
  const accountInfo = useRecoilValue(currentAccountState);
  const stxAddress = useRecoilValue(currentAccountStxAddressState);
  return {
    ...accountInfo,
    stxAddress,
  };
}
