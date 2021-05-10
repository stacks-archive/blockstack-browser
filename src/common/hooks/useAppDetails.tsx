import { useRecoilValue } from 'recoil';
import { authRequestState } from '@store/onboarding';

export const useAppDetails = () => {
  const { appName: name, appIcon: icon, appURL: url } = useRecoilValue(authRequestState);
  return { name, icon, url };
};
