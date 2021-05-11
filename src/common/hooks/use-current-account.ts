import { useRecoilValue } from 'recoil';
import { currentAccountStore, currentAccountStxAddressStore } from '@store/wallet';

export function useCurrentAccount() {
  const accountInfo = useRecoilValue(currentAccountStore);
  const stxAddress = useRecoilValue(currentAccountStxAddressStore);
  return {
    ...accountInfo,
    stxAddress,
  };
}
