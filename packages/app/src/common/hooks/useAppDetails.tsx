import { useSelector } from 'react-redux';
import { selectAppName, selectAppIcon, selectAppURL } from '@store/onboarding/selectors';

export const useAppDetails = () => {
  const name = useSelector(selectAppName);
  const icon = useSelector(selectAppIcon);
  const url = useSelector(selectAppURL);

  return { name, icon, url };
};
