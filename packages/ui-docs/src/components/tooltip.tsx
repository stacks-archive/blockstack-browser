import * as React from 'react';
import { color } from '@blockstack/ui';
import { useTooltip, TooltipPopup } from '@reach/tooltip';

const centered = (triggerRect: any, tooltipRect: any) => {
  if (typeof window === 'undefined') return { left: 0, top: 0 };
  const triggerCenter = triggerRect.left + triggerRect.width / 2;
  const left = triggerCenter - tooltipRect.width / 2;
  const maxLeft = window.innerWidth - tooltipRect.width - 2;
  return {
    left: Math.min(Math.max(2, left), maxLeft) + window.scrollX,
    top: triggerRect.bottom + 8 + window.scrollY,
  };
};

export const Tooltip = ({ children, label, 'aria-label': ariaLabel }: any) => {
  const [trigger, tooltip] = useTooltip();

  const { onMouseDown, ...triggerProps } = trigger;
  return (
    <>
      {React.cloneElement(children, triggerProps)}
      <TooltipPopup
        {...tooltip}
        label={label}
        aria-label={ariaLabel}
        style={{
          position: 'absolute',
          zIndex: 99999,
          background: color('invert'),
          color: color('bg'),
          border: 'none',
          borderRadius: '3px',
          padding: '0.5em 1em',
          fontSize: '12px',
        }}
        position={centered}
      />
    </>
  );
};
