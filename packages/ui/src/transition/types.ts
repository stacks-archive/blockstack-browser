import {
  EndHandler,
  EnterHandler,
  ExitHandler,
  TransitionProps as TProps,
  UNMOUNTED,
  EXITED,
  ENTERING,
  ENTERED,
  EXITING,
} from 'react-transition-group/Transition';

export type TransitionStatus =
  | typeof ENTERING
  | typeof ENTERED
  | typeof EXITING
  | typeof EXITED
  | typeof UNMOUNTED;

export interface TransitionProps {
  in?: boolean;
  addEndListener?: EndHandler;
  onEnter?: EnterHandler;
  onEntering?: EnterHandler;
  onEntered?: EnterHandler;
  onExit?: ExitHandler;
  onExiting?: ExitHandler;
  onExited?: ExitHandler;
  unmountOnExit?: boolean;
  timeout?: TProps['timeout'];
  transition?: string;
  children: (styles: React.CSSProperties) => React.ReactNode;
  styles: TransitionStyles;
}

export type TransitionStyleState = 'init' | TransitionStatus;

export type TransitionStyles = {
  [K in TransitionStyleState]?: React.CSSProperties;
};

export type Placement = 'left' | 'right' | 'bottom' | 'top';

interface Timeout {
  timeout?: number;
}

export interface ScaleSettings extends Timeout {
  initialScale?: number;
}

export interface SlideSettings extends Timeout {
  initialOffset?: string;
  placement?: Placement;
}

export type SlideProps = Omit<TransitionProps, 'styles' | 'timeout'> & SlideSettings;
export type ScaleFadeProps = Omit<TransitionProps, 'styles' | 'timeout'> & ScaleSettings;
export type SlideFadeProps = Omit<TransitionProps, 'styles' | 'timeout'> & SlideSettings;
export type FadeProps = Omit<TransitionProps, 'styles' | 'timeout'> & Timeout;
