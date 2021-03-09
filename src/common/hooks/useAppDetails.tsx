import { useSelector } from 'react-redux';
import { selectAppName, selectFullAppIcon, selectAppURL } from '@store/onboarding/selectors';

export const useAppDetails = () => {
  const name = useSelector(selectAppName);
  const icon = useSelector(selectFullAppIcon);
  const url = useSelector(selectAppURL);

  return { name, icon, url };
};
