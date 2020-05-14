import * as React from 'react';
import CSSTransition from 'react-transition-group/Transition';
import { TransitionStatus } from 'react-transition-group/Transition';
import { TransitionProps } from './types';

export const Transition = ({
  styles,
  in: inProp,
  timeout = 200,
  transition = `all ${timeout}ms cubic-bezier(0.23, 1, 0.32, 1)`,
  children,
  ...rest
}: TransitionProps) => {
  const computedStyle = (state: TransitionStatus) => ({
    ...styles.init,
    transition,
    ...styles[state],
  });
  return (
    <CSSTransition appear unmountOnExit in={inProp} timeout={timeout} {...rest}>
      {state => children(computedStyle(state))}
    </CSSTransition>
  );
};
