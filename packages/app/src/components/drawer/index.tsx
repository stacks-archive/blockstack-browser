import React from 'react';
import { Box, Flex, useEventListener, IconButton, color } from '@stacks/ui';
import { IconX } from '@tabler/icons';
import useOnClickOutside from 'use-onclickoutside';
import { Title } from '@components/typography';

const transition = '0.2s all ease-in-out';

export interface BaseDrawerProps {
  showing: boolean;
  title: string;
  close: () => void;
}

export const BaseDrawer: React.FC<BaseDrawerProps> = ({ title, showing, close, children }) => {
  const ref = React.useRef(null);

  useOnClickOutside(ref, () => {
    if (showing) {
      close();
    }
  });

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (showing && e.key === 'Escape') {
        close();
      }
    },
    [close, showing]
  );

  useEventListener('keydown', handleKeyDown);

  return (
    <Flex
      bg={`rgba(0,0,0,0.${showing ? 4 : 0})`}
      transition={transition}
      position="fixed"
      height="100%"
      pt="loose"
      width="100%"
      alignItems="flex-end"
      flexDirection="column"
      zIndex={1000}
      style={{
        pointerEvents: !showing ? 'none' : 'unset',
        userSelect: !showing ? 'none' : 'unset',
        willChange: 'background',
      }}
    >
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
        overflowY="auto"
        position="relative"
        mt="auto"
      >
        <Flex pb="base" justifyContent="space-between" alignItems="center" px="loose">
          {title ? (
            <Title fontSize="20px" lineHeight="28px">
              {title}
            </Title>
          ) : null}
          <IconButton
            transform="translateX(8px)"
            size="36px"
            iconSize="20px"
            onClick={close}
            color={color('text-caption')}
            _hover={{
              color: color('text-title'),
            }}
            icon={IconX}
          />
        </Flex>
        {children}
      </Box>
    </Flex>
  );
};
