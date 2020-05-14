import React, { useCallback, useMemo, useRef } from 'react';
import ReachAlert from '@reach/alert';
import { useRect } from '@reach/rect';
import { useId } from '@reach/auto-id';

import { Transition } from '../transition';
import { Stack } from '../stack';
import { Box, BoxProps } from '../box';
import { Flex } from '../flex';
import { Text } from '../text';
import { ExclamationMarkCircleIcon, CheckmarkCircleIcon, CloseIcon } from '../icons';

import { useTimeout } from '../hooks';

import { ActionProps, ToastAction, ToastProps } from './types';
import { useHover, useFocus } from 'use-events';
import { transition } from '../theme/theme';

const toneToIcon = {
  critical: ExclamationMarkCircleIcon,
  positive: CheckmarkCircleIcon,
  none: () => null,
};

const Action = ({ label, onClick, removeToast, ...rest }: ActionProps) => {
  const handleClick = useCallback(() => {
    removeToast();
    onClick();
  }, [removeToast, onClick]);

  return (
    <Box
      _hover={{
        cursor: 'pointer',
        textDecoration: 'underline',
      }}
      onClick={handleClick}
      aria-hidden
      {...rest}
    >
      <Text>{label}</Text>
    </Box>
  );
};

const getCustomProps = (props: ToastProps['toastProps'] = {}) => {
  return {
    message: {
      color: 'ink',
      ...props?.message,
    },
    description: {
      color: 'ink.600',
      ...props?.description,
    },
    toast: {
      background: 'white',
      borderColor: 'inherit',
      boxShadow: 'high',
      ...props?.toast,
    },
    icon: {
      ...props?.icon,
      color: {
        critical: 'red',
        positive: 'green',
        ...props?.icon?.color,
      },
    },
    close: {
      color: 'ink.600',
      ...props?.close,
    },
    action: {
      color: 'blue',
      fontSize: '14px',
      ...props?.action,
    },
  };
};

const CloseButton = ({ onClick, ...rest }: any) => {
  const [hover, bind] = useHover();
  const [focus, focusBind] = useFocus();
  return (
    <Flex
      position="relative"
      justify="center"
      cursor={hover ? 'pointer' : 'unset'}
      onClick={onClick}
      {...bind}
      {...rest}
    >
      <Box
        ml="tight"
        mt="extra-tight"
        opacity={hover ? 1 : 0.5}
        as="button"
        role="button"
        aria-label="Close popup"
        title="Close"
        style={{
          outline: 'none',
        }}
        position="relative"
        zIndex={99}
        transition={transition}
        {...focusBind}
      >
        <CloseIcon size="12px" />
      </Box>
      <Box
        size="24px"
        bg="currentColor"
        borderRadius="100%"
        position="absolute"
        left="-50%"
        top="-50%"
        opacity={hover ? 0.1 : 0}
        transform="translate3d(12px, 6px, 0)"
        transition={transition}
        boxShadow={focus ? 'focus' : 'unset'}
      />
    </Flex>
  );
};

const Description: React.FC<BoxProps> = ({ children, ...rest }) => (
  <Text
    fontSize="14px"
    style={{
      wordBreak: 'break-word',
    }}
    display="block"
    {...rest}
  >
    {children}
  </Text>
);

const Message: React.FC<BoxProps> = ({ children, ...rest }) => (
  <Text fontWeight="600" display="block" {...rest}>
    {children}
  </Text>
);

const ToastContent = ({
  styles = {},
  message,
  description,
  action,
  remove,
  ...rest
}: {
  styles: ToastProps['toastProps'];
  message: string;
  description?: string;
  action?: ToastAction;
  remove: () => void;
}) =>
  description ? (
    <Stack spacing="tight" {...rest}>
      <Message {...styles?.message}>{message}</Message>
      {description ? <Description {...styles?.description}>{description}</Description> : null}
      {action ? (
        <Action key={action.label} removeToast={remove} {...action} {...styles.action} />
      ) : null}
    </Stack>
  ) : (
    <Stack spacing="tight" {...rest}>
      <Message {...styles?.message}>{message}</Message>
      {action ? (
        <Action key={action.label} removeToast={remove} {...action} {...styles.action} />
      ) : null}
    </Stack>
  );

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ id: propsId, message, description, tone = 'none', onClear, action, toastProps = {} }, ref) => {
    const id = useId(propsId) as string;
    const styles = useMemo(() => getCustomProps(toastProps), [toastProps]);
    const remove = useCallback(() => onClear(id), [onClear, id]);
    const toastRef = useRef<HTMLDivElement>(null);
    const rect = useRect(toastRef);
    const [show, setShow] = React.useState(true);

    const height = rect?.height ?? 0;

    const onExit = () => {
      if (!show) {
        onClear(id);
      }
    };

    const onClose = React.useCallback(() => {
      setShow(false);
    }, []);

    const { stopTimeout, startTimeout } = useTimeout({
      duration: 7200,
      onTimeout: onClose,
    });

    const animationStyles = {
      init: {
        opacity: 0,
        height: 0,
        transform: 'scale(1)',
      },
      entered: {
        opacity: 1,
        height,
        transform: 'scale(1)',
      },
      exiting: {
        opacity: 0,
        height: 0,
        transform: 'scale(0.9)',
      },
    };

    const noIcon = tone === 'none';
    const Icon = toneToIcon[tone];

    return (
      <Transition styles={animationStyles} in={show} onExited={onExit} timeout={350}>
        {transitionStyles => (
          <Box
            onMouseEnter={stopTimeout}
            onMouseLeave={startTimeout}
            style={{
              willChange: 'transform, height, opacity',
              ...transitionStyles,
            }}
            ref={ref}
          >
            <Flex
              justify="center"
              as={ReachAlert}
              maxWidth="100%"
              pb="tight"
              px="tight"
              ref={toastRef}
            >
              <Box
                p="base"
                border="1px solid"
                borderColor="inherit"
                borderRadius="6px"
                maxWidth="100%"
                {...styles.toast}
                style={{
                  pointerEvents: 'all',
                }}
              >
                <Box position="relative">
                  <Flex align="flex-start">
                    {tone !== 'none' ? (
                      <Box
                        pt="extra-tight"
                        pr="tight"
                        {...styles?.icon}
                        color={styles.icon.color[tone]}
                      >
                        <Icon size="16px" />
                      </Box>
                    ) : null}

                    <Box pr={noIcon ? 'unset' : 'base'}>
                      <ToastContent
                        message={message}
                        description={description}
                        action={action}
                        styles={styles}
                        remove={remove}
                      />
                    </Box>

                    <CloseButton onClick={onClose} />
                  </Flex>
                </Box>
              </Box>
            </Flex>
          </Box>
        )}
      </Transition>
    );
  }
);
