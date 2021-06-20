import React, { useCallback } from 'react';

import { BaseDrawer } from '.';
import { useAtom, WritableAtom } from 'jotai';

interface ControlledDrawerProps {
  /** The atom used to represent the visibility state of this drawer */
  state: WritableAtom<boolean, boolean>;
  /** An optional callback that is fired _after_ visibility has been turned off. */
  close?: () => void;
  title: string;
}

/**
 * `ControlledDrawer` is a wrapper around our `BaseDrawer` component.
 * It expects an atom to be used that manages the visibility of this drawer.
 */
export const ControlledDrawer: React.FC<ControlledDrawerProps> = ({
  state,
  close: _close,
  title,
  children,
}) => {
  const [isShowing, setShowing] = useAtom(state);
  const close = useCallback(() => {
    setShowing(false);
    _close?.();
  }, [setShowing, _close]);

  return (
    <BaseDrawer title={title} isShowing={isShowing} onClose={close}>
      {children}
    </BaseDrawer>
  );
};
