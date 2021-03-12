import React from 'react';
import { Flex, useEventListener, IconButton, color, transition } from '@stacks/ui';
import { IconX } from '@tabler/icons';
import useOnClickOutside from '@common/hooks/use-onclickoutside';
import { Title } from '@components/typography';

export interface BaseDrawerProps {
  showing: boolean;
  title?: string;
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
      <Flex
        flexDirection="column"
        flexGrow={0}
        ref={ref}
        opacity={showing ? 1 : 0}
        transform={showing ? 'none' : 'translateY(35px)'}
        transition={showing ? transition + ' 0.1s' : transition}
        transitionDuration="0.4s"
        style={{ willChange: 'transform, opacity' }}
        width="100%"
        bg="white"
        borderTopLeftRadius="24px"
        borderTopRightRadius="24px"
        position="relative"
        mt="auto"
        maxHeight="calc(100vh - 24px)"
      >
        <Flex
          pb="base"
          justifyContent="space-between"
          alignItems="center"
          pt="extra-loose"
          px="extra-loose"
        >
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
        <Flex maxHeight="100%" flexGrow={1} overflowY="auto" flexDirection="column">
          {children}
        </Flex>
      </Flex>
    </Flex>
  );
};
