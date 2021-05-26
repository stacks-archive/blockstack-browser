import { useAuthRequest } from '@common/hooks/auth/use-auth-request';

export const useAppDetails = () => {
  const { appName: name, appIcon: icon, appURL: url } = useAuthRequest();
  return { name, icon, url };
};
