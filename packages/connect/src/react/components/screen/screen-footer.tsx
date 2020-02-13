import React from 'react';

import { Flex, BoxProps } from '@blockstack/ui';

interface ScreenFooterProps extends BoxProps {}

export const ScreenFooter: React.FC<ScreenFooterProps> = ({ children, ...rest }) => (
  <Flex
    mx={6}
    flex={1}
    fontSize={['12px', '14px']}
    color="ink.600"
    fontWeight="medium"
    justify="space-between"
    {...rest}
  >
    {children}
  </Flex>
);
