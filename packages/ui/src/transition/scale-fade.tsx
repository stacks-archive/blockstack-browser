import * as React from 'react';
import { Transition } from './base';
import { ScaleFadeProps } from './types';

const getTransitionStyles = (initialScale: ScaleFadeProps['initialScale']) => ({
  init: {
    opacity: 0,
    transform: `scale(${initialScale})`,
  },
  entered: {
    opacity: 1,
    transform: 'scale(1)',
  },
  exiting: {
    opacity: 0,
    transform: `scale(${initialScale})`,
  },
});

export const ScaleFade = ({ initialScale = 0.9, timeout = 300, ...rest }: ScaleFadeProps) => (
  <Transition
    styles={React.useMemo(() => getTransitionStyles(initialScale), [initialScale])}
    transition={`all ${timeout}ms cubic-bezier(0.45, 0, 0.40, 1)`}
    timeout={{ enter: 50, exit: timeout }}
    unmountOnExit
    {...rest}
  />
);
