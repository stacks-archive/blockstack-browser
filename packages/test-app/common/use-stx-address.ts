import { useContext } from 'react';
import { AppContext } from '@common/context';

export const useSTXAddress = (): string | undefined => {
  const { userData } = useContext(AppContext);
  return userData?.profile?.stxAddress?.testnet as string;
};
