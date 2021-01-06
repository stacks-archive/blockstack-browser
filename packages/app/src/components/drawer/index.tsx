import React from 'react';
import { Box, Flex } from '@stacks/ui';
import useOnClickOutside from 'use-onclickoutside';

const transition = '0.2s all ease-in-out';
export interface BaseDrawerProps {
  showing: boolean;
  close: () => void;
}
export const BaseDrawer: React.FC<BaseDrawerProps> = ({ showing, close, children }) => {
  const ref = React.useRef(null);

  useOnClickOutside(ref, () => {
    if (showing) {
      close();
    }
  });

  return (
    <Flex
      bg={`rgba(0,0,0,0.${showing ? 4 : 0})`}
      transition={transition}
      position="fixed"
      height="100%"
      pt="loose"
      width="100%"
      alignItems="flex-end"
      dir="column"
      zIndex={1000}
      style={{
        pointerEvents: !showing ? 'none' : 'unset',
        userSelect: !showing ? 'none' : 'unset',
        willChange: 'background',
      }}
    >
      <Box flexGrow={1} />
      <Box
        ref={ref}
        opacity={showing ? 1 : 0}
        transform={showing ? 'none' : 'translateY(35px)'}
        transition={showing ? transition + ' 0.1s' : transition}
        style={{ willChange: 'transform, opacity' }}
        width="100%"
        bg="white"
        py={6}
        borderTopLeftRadius="24px"
        borderTopRightRadius="24px"
        overflowY="scroll"
      >
        {children}
      </Box>
    </Flex>
  );
};
