import { useContext } from 'react';
import { ConnectContext } from '../components/connect/context';

const useAppDetails = () => {
  const { authOptions } = useContext(ConnectContext);
  if (!authOptions.appDetails) {
    throw new Error('This must be used within the ConnectProvider component.');
  }
  return authOptions.appDetails;
};

export { useAppDetails };
