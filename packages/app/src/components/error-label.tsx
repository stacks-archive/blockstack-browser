import React from 'react';
import { Flex, Box } from '@blockstack/ui';

import { ExclamationMark } from './icons/exclamation-mark';

export const ErrorLabel: React.FC = ({ children }) => (
  <Flex mt={3}>
    <Box mr={2} mt={0.5}>
      <ExclamationMark />
    </Box>
    <Box mr={5}>{children}</Box>
  </Flex>
);
