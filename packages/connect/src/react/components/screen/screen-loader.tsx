import React from 'react';

import { Flex, Box, Spinner } from '@blockstack/ui';

interface ScreenLoaderProps {
  isLoading?: boolean;
}

export const ScreenLoader: React.FC<ScreenLoaderProps> = ({ isLoading }) => (
  <Flex
    align="center"
    justify="center"
    position="absolute"
    top={0}
    left={0}
    width="100%"
    height="100%"
    bg={`rgba(255,255,255,${isLoading ? 0.6 : 0})`}
    borderBottomLeftRadius="6px"
    borderBottomRightRadius="6px"
    zIndex={99}
    transition="250ms all"
    style={{ pointerEvents: isLoading ? 'unset' : 'none' }}
    opacity={isLoading ? 1 : 0}
  >
    <Box transition="500ms all" transform={isLoading ? 'none' : 'translateY(10px)'}>
      <Spinner size="xl" thickness="3px" color="blue" />
    </Box>
  </Flex>
);
