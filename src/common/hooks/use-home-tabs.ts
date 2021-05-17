import { useRecoilState } from 'recoil';
import { tabState } from '@store/ui';

export function useHomeTabs() {
  const [activeTab, setActiveTab] = useRecoilState(tabState('HOME_TABS'));

  const setActiveTabBalances = () => setActiveTab(0);
  const setActiveTabActivity = () => setActiveTab(1);
  return {
    activeTab,
    setActiveTab,
    setActiveTabBalances,
    setActiveTabActivity,
  };
}
