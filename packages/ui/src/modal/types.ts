import React from 'react';
import { BoxProps } from '../box';

export interface ModalContextTypes {
  isOpen: boolean;
  doOpenModal?: () => void;
  doCloseModal?: () => void;
}
export interface ModalProps extends BoxProps {
  isOpen: boolean;
  footerComponent?: React.ReactNode;
  headerComponent?: React.ReactNode;
  noAnimation?: boolean;
  open?: () => void;
  close?: () => void;
}
export interface WrapperComponentProps {
  component?: React.ReactNode;
}
