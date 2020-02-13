import React from 'react';

import { Flex, FlexProps } from '@blockstack/ui';
import { ScreenLoader } from './screen-loader';

interface ScreenBodyProps extends FlexProps {
  noMinHeight?: boolean;
  isLoading?: boolean;
}

export const Screen: React.FC<ScreenBodyProps> = ({ noMinHeight, isLoading, children, ...rest }) => (
  <>
    <ScreenLoader isLoading={isLoading} />
    <Flex
      width="100%"
      flexDirection="column"
      minHeight={noMinHeight ? undefined : ['calc(100vh - 57px)', 'unset']}
      flex={1}
      style={{ pointerEvents: isLoading ? 'none' : 'unset' }}
      {...rest}
    >
      {children}
    </Flex>
  </>
);
