import React from 'react'

export interface ModalContextTypes {
  isOpen: boolean
  doOpenModal?: () => void
  doCloseModal?: () => void
}
export interface ModalProps {
  isOpen: boolean
  footerComponent?: React.ReactNode
  headerComponent?: React.ReactNode
  noAnimation?: boolean
}
export interface WrapperComponentProps {
  component?: React.ReactNode
}
