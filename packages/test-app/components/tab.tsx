import React from 'react';
import { Box, BoxProps } from '@blockstack/ui';

export const InactiveTab: React.FC = ({ children }) => {
  return (
    <Box color="ink.400" mr={6} py={3} borderColor="white" borderBottomWidth="2px" cursor="pointer">
      {children}
    </Box>
  );
};

export const ActiveTab: React.FC = ({ children }) => {
  return (
    <Box color="ink.900" mr={6} py={3} borderColor="blue" borderBottomWidth="2px" cursor="pointer">
      {children}
    </Box>
  );
};

interface TabProps extends BoxProps {
  active: boolean;
}

export const Tab: React.FC<TabProps> = ({ active, ...rest }) => {
  if (active) {
    return <ActiveTab {...rest} />;
  }
  return <InactiveTab {...rest} />;
};
