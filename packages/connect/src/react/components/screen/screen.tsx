import React from 'react';

import { Flex, BoxProps } from '@blockstack/ui';
import { ScreenLoader } from './screen-loader';

interface ScreenBodyProps extends BoxProps {
  noMinHeight?: boolean;
  isLoading?: boolean;
}

export const Screen: React.FC<ScreenBodyProps> = ({ noMinHeight, isLoading, children, ...rest }) => (
  <>
    <ScreenLoader isLoading={isLoading} />
    <Flex
      width="100%"
      flexDirection="column"
      letterSpacing="tighter"
      minHeight={noMinHeight ? undefined : ['calc(100vh - 57px)', 'unset']}
      style={{ pointerEvents: isLoading ? 'none' : 'unset' }}
      {...rest}
    >
      {children}
    </Flex>
  </>
);
