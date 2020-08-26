import { h } from '@stencil/core';
import { state, Screens } from '../../../store';

export const ChevronIcon = () => {
  return (
    <svg
      width="16px"
      height="16px"
      viewBox="0 0 16 16"
      style={{ transform: `rotate(90deg)` }}
      onClick={() => (state.screen = Screens.INTRO)}
    >
      <path
        fill={'currentColor'}
        d="M4.7 7.367l3.3 3.3 3.3-3.3-.943-.943L8 8.78 5.643 6.424l-.943.943z"
      />
    </svg>
  );
};
