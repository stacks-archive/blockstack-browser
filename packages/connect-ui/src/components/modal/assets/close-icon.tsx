import { h } from '@stencil/core';

export const CloseIcon = ({ onClick }: { onClick: () => void }) => (
  <svg width={16} height={16} viewBox="0 0 16 16" onClick={onClick}>
    <path
      fill="#C1C3CC"
      d="M4.817 3.403a1 1 0 00-1.414 1.414L6.586 8l-3.183 3.183a1 1 0 001.414 1.415L8 9.415l3.183 3.183a1 1 0 101.415-1.415L9.415 8l3.183-3.183a1.002 1.002 0 00-.325-1.631 1 1 0 00-1.09.217L8 6.586 4.817 3.403z"
    />
  </svg>
);
