import React, { useCallback } from 'react';
import { useAppState } from '@common/hooks/use-app-state';
import { State } from '@components/app-state/types';

export const useMobileMenuState = () => {
  const { setState, mobileMenu: isOpen } = useAppState();

  const handleToggle = useCallback(
    () => setState((s: State) => ({ ...s, mobileMenu: !s.mobileMenu })),
    [isOpen]
  );
  const handleClose = useCallback(
    () => isOpen && setState((s: State) => ({ ...s, mobileMenu: false })),
    [isOpen]
  );
  const handleOpen = useCallback(
    () => !isOpen && setState((s: State) => ({ ...s, mobileMenu: true })),
    [isOpen]
  );
  return {
    isOpen,
    setOpen: setState,
    handleToggle,
    handleClose,
    handleOpen,
  };
};
