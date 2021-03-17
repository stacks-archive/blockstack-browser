import React, { useCallback } from 'react';
import { RecoilState, useRecoilState } from 'recoil';
import { BaseDrawer } from '.';

interface RecoilControlledDrawerProps {
  /** The Recoil atom used to represent the visibility state of this drawer */
  state: RecoilState<boolean>;
  /** An optional callback that is fired _after_ visibility has been turned off. */
  close?: () => void;
  title: string;
}

/**
 * `ControlledDrawer` is a wrapper around our `BaseDrawer` component.
 * It expects a recoil atom to be used that manages the visibility of this drawer.
 */
export const ControlledDrawer: React.FC<RecoilControlledDrawerProps> = ({
  state,
  close: _close,
  title,
  children,
}) => {
  const [showing, setShowing] = useRecoilState(state);
  const close = useCallback(() => {
    setShowing(false);
    _close?.();
  }, [setShowing, _close]);

  return (
    <BaseDrawer title={title} isShowing={showing} onClose={close}>
      {children}
    </BaseDrawer>
  );
};
