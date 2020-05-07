import React, { useCallback } from 'react';
import { Box } from '../box';

import { Toast as ToastComponent } from './toast';
import { useFlipList } from '../hooks';

import { ToasterProps } from './types';

export const Toaster = ({ toasts, removeToast }: ToasterProps) => {
  const { itemRef, remove } = useFlipList();

  const onClear = useCallback(
    (id: string) => {
      remove(id, () => {
        removeToast(id);
      });
    },
    [remove, removeToast]
  );

  return (
    <Box position="fixed" width="100%" bottom={0}>
      {toasts.map(({ id, ...rest }) => (
        <Box key={id}>
          <ToastComponent ref={itemRef(id)} id={id} onClear={onClear} {...rest} />
        </Box>
      ))}
    </Box>
  );
};
