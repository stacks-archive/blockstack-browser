import { useSelector } from 'react-redux';
import { selectAppName, selectAppIcon } from '@store/onboarding/selectors';

export const useAppDetails = () => {
  const name = useSelector(selectAppName);
  const icon = useSelector(selectAppIcon);

  return { name, icon };
};
