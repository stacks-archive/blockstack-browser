import React from 'react';

import { Flex, BoxProps } from '@blockstack/ui';
import { PX } from '../../common';

interface ScreenFooterProps extends BoxProps {}

export const ScreenFooter: React.FC<ScreenFooterProps> = ({ children, ...rest }) => (
  <Flex
    mx={PX}
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
