import { tabState } from '@store/ui';
import { useAtom } from 'jotai';

export function useHomeTabs() {
  const [activeTab, setActiveTab] = useAtom(tabState('HOME_TABS'));

  const setActiveTabBalances = () => setActiveTab(0);
  const setActiveTabActivity = () => setActiveTab(1);
  return {
    activeTab,
    setActiveTab,
    setActiveTabBalances,
    setActiveTabActivity,
  };
}
