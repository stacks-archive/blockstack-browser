import {
  showNetworksStore,
  accountDrawerStep,
  showAccountsStore,
  showSettingsStore,
} from '@store/ui';
import { useRecoilState } from 'recoil';

export const useDrawers = () => {
  const [accountStep, setAccountStep] = useRecoilState(accountDrawerStep);
  const [showAccounts, setShowAccounts] = useRecoilState(showAccountsStore);
  const [showNetworks, setShowNetworks] = useRecoilState(showNetworksStore);
  const [showSettings, setShowSettings] = useRecoilState(showSettingsStore);

  return {
    accountStep,
    setAccountStep,
    showAccounts,
    setShowAccounts,
    showNetworks,
    setShowNetworks,
    showSettings,
    setShowSettings,
  };
};
