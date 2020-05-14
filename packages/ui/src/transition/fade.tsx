import * as React from 'react';
import { FadeProps, TransitionStyles } from './types';
import { Transition } from './base';

const styles: TransitionStyles = {
  init: { opacity: 0 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
};

export const Fade = ({ timeout = 250, ...rest }: FadeProps) => (
  <Transition
    transition={`all ${timeout}ms cubic-bezier(0.175, 0.885, 0.320, 1.175)`}
    styles={styles}
    timeout={{ enter: 50, exit: timeout }}
    {...rest}
  />
);
