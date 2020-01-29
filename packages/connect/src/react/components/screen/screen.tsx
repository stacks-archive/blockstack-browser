import React from 'react';

import { Stack, BoxProps, StackProps } from '@blockstack/ui';
import { ScreenLoader } from './screen-loader';

interface ScreenBodyProps extends BoxProps, StackProps {
  noMinHeight?: boolean;
  isLoading?: boolean;
}

export const Screen: React.FC<ScreenBodyProps> = ({
  isInline,
  spacing = 4,
  align,
  justify,
  shouldWrapChildren,
  noMinHeight,
  isLoading,
  children,
  ...rest
}) => (
  <>
    <ScreenLoader isLoading={isLoading} />
    <Stack
      width="100%"
      flexDirection="column"
      letterSpacing="tighter"
      minHeight={noMinHeight ? undefined : ['calc(100vh - 57px)', 'unset']}
      style={{ pointerEvents: isLoading ? 'none' : 'unset' }}
      spacing={spacing}
      isInline={isInline}
      align={align}
      justify={justify}
      shouldWrapChildren={shouldWrapChildren}
      pb={6}
      {...rest}
    >
      {children}
    </Stack>
  </>
);
