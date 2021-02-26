import { Flex, FlexProps } from '@stacks/ui';
import React from 'react';

export const SpaceBetween: React.FC<FlexProps> = props => (
  <Flex alignItems="center" justifyContent="space-between" {...props} />
);
