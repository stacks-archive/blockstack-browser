import React from 'react';

import { Flex, FlexProps } from '@stacks/ui';
import { PX } from './spacing';

export const ScreenFooter: React.FC<FlexProps> = ({ children, ...rest }) => (
  <Flex
    mx={PX}
    flex={1}
    fontSize={['12px', '14px']}
    color="ink.600"
    fontWeight="medium"
    justifyContent="space-between"
    {...rest}
  >
    {children}
  </Flex>
);
