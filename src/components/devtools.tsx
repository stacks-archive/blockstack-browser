import React from 'react';
import { useAtomDevtools } from 'jotai/devtools';
import { walletState } from '@store/wallet';

export function Devtools() {
  useAtomDevtools(walletState);
  return null;
}
