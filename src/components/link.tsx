import React, { useCallback } from 'react';
import { Text, BoxProps, color } from '@stacks/ui';

export type LinkProps = BoxProps;

export const buildEnterKeyEvent = (onClick: () => void) => {
  return useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' && onClick) {
        onClick();
      }
    },
    [onClick]
  );
};

export const Link: React.FC<BoxProps> = ({
  _hover = {},
  children,
  fontSize = '12px',
  onClick,
  ...rest
}) => (
  <Text
    _hover={{ textDecoration: 'underline', cursor: 'pointer', ..._hover }}
    fontSize={fontSize}
    color={color('brand')}
    onKeyPress={buildEnterKeyEvent(onClick as any)}
    onClick={onClick}
    tabIndex={0}
    {...rest}
  >
    {children}
  </Text>
);
