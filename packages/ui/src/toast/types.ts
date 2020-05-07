import { BoxProps } from '../box';

interface IconProps extends Omit<BoxProps, 'color'> {
  color?: {
    critical?: BoxProps['color'];
    positive?: BoxProps['color'];
  };
}

interface ToastStyleProps {
  message?: BoxProps;
  description?: BoxProps;
  toast?: BoxProps;
  icon?: IconProps;
  close?: BoxProps;
  action?: Omit<BoxProps, 'onClick'>;
}

export interface ToastAction extends Omit<BoxProps, 'onClick'> {
  label: string;
  onClick: () => void;
}

export interface ActionProps extends ToastAction {
  removeToast: () => void;
}

type Tone = 'positive' | 'critical' | 'none';

export interface ToastType {
  id: string;
  tone?: Tone;
  message: string;
  description?: string;
  action?: ToastAction;
  toastProps?: ToastStyleProps;
}

export interface ToastProps extends ToastType {
  onClear: (id: string) => void;
}

export interface ToasterProps {
  toasts: ToastType[];
  removeToast: (id: string) => void;
}
