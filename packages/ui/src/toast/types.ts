import { ReactNode } from 'react';
import { BoxProps } from '../box';
import { FlexProps } from '../flex';

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

export interface ToasterProps extends FlexProps {
  toasts: ToastType[];
  removeToast: (id: string) => void;
}

export interface ToastState {
  toasts: ToastType[];
}
export type AddToast = (toast: ToastType) => void;

export interface ToastProviderProps {
  children: ReactNode;
}
