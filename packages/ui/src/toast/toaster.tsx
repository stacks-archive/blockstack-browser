import React, { useCallback } from 'react';
import { Box } from '../box';
import { Flex } from '../flex';

import { Toast as ToastComponent } from './toast';

import { ToasterProps } from './types';

export const Toaster = ({ toasts, removeToast, ...rest }: ToasterProps) => {
  const onClear = useCallback(
    (id: string) => {
      removeToast(id);
    },
    [removeToast]
  );

  return (
    <Flex
      align="center"
      justify="flex-end"
      flexDirection="column"
      position="fixed"
      width="100%"
      height="100vh"
      bottom={0}
      zIndex={9999999}
      style={{ pointerEvents: 'none' }}
      {...rest}
    >
      {toasts.map(({ id, ...rest }) => (
        <Box key={id}>
          <ToastComponent id={id} onClear={onClear} {...rest} />
        </Box>
      ))}
    </Flex>
  );
};
