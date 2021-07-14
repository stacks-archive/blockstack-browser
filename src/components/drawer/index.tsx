import React, { useRef, useCallback, memo } from 'react';
import { Flex, useEventListener, IconButton, color, transition } from '@stacks/ui';
import { FiX as IconX } from 'react-icons/fi';
import useOnClickOutside from '@common/hooks/use-onclickoutside';
import { Title } from '@components/typography';

export interface BaseDrawerProps {
  isShowing: boolean;
  title?: string;
  onClose: () => void;
}

function useDrawer(isShowing: boolean, onClose: () => void) {
  const ref = useRef(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (isShowing && e.key === 'Escape') {
        onClose();
      }
    },
    [onClose, isShowing]
  );

  useOnClickOutside(ref, isShowing ? onClose : null);
  useEventListener('keydown', handleKeyDown);

  return ref;
}

const DrawerHeader = memo(
  ({
    title,
    onClose,
  }: {
    title: BaseDrawerProps['title'];
    onClose: BaseDrawerProps['onClose'];
  }) => {
    return (
      <Flex
        pb="base"
        justifyContent="space-between"
        alignItems="center"
        pt="extra-loose"
        px="extra-loose"
      >
        {title && (
          <Title fontSize="20px" lineHeight="28px">
            {title}
          </Title>
        )}
        <IconButton
          transform="translateX(8px)"
          size="36px"
          iconSize="20px"
          onClick={onClose}
          color={color('text-caption')}
          _hover={{
            color: color('text-title'),
          }}
          icon={IconX}
        />
      </Flex>
    );
  }
);

export const BaseDrawer: React.FC<BaseDrawerProps> = memo(props => {
  const { title, isShowing, onClose, children } = props;
  const ref = useDrawer(isShowing, onClose);
  return (
    <Flex
      bg={`rgba(0,0,0,0.${isShowing ? 4 : 0})`}
      transition={transition}
      position="fixed"
      height="100%"
      pt="loose"
      width="100%"
      alignItems="flex-end"
      flexDirection="column"
      zIndex={1000}
      style={{
        pointerEvents: !isShowing ? 'none' : 'unset',
        userSelect: !isShowing ? 'none' : 'unset',
        willChange: 'background',
      }}
    >
      <Flex
        flexDirection="column"
        flexGrow={0}
        ref={ref}
        opacity={isShowing ? 1 : 0}
        transform={isShowing ? 'none' : 'translateY(35px)'}
        transition={isShowing ? transition + ' 0.1s' : transition}
        transitionDuration="0.4s"
        willChange="transform, opacity"
        width="100%"
        bg="white"
        borderTopLeftRadius="24px"
        borderTopRightRadius="24px"
        position="relative"
        mt="auto"
        maxHeight="calc(100vh - 24px)"
      >
        <DrawerHeader title={title} onClose={onClose} />
        <Flex maxHeight="100%" flexGrow={1} overflowY="auto" flexDirection="column">
          <React.Suspense fallback={<></>}>{children}</React.Suspense>
        </Flex>
      </Flex>
    </Flex>
  );
});
