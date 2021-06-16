import { useAtom } from 'jotai';
import {
  showNetworksStore,
  accountDrawerStep,
  showAccountsStore,
  showSettingsStore,
} from '@store/ui';

export const useDrawers = () => {
  const [accountStep, setAccountStep] = useAtom(accountDrawerStep);
  const [showAccounts, setShowAccounts] = useAtom(showAccountsStore);
  const [showNetworks, setShowNetworks] = useAtom(showNetworksStore);
  const [showSettings, setShowSettings] = useAtom(showSettingsStore);

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
