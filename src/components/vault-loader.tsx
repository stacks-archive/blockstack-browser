import React, { useEffect } from 'react';
import { useVaultMessenger } from '@common/hooks/use-vault-messenger';

export const VaultLoader: React.FC = () => {
  const { getWallet } = useVaultMessenger();
  useEffect(() => {
    void getWallet();
  }, [getWallet]);
  return null;
};
