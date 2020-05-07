import React, { useCallback, useMemo } from 'react';

import { Stack } from '../stack';
import { Box } from '../box';
import { Flex } from '../flex';
import { Text } from '../text';
import { ExclamationMarkCircleIcon, CheckmarkCircleIcon, CloseIcon } from '../icons';

import { useTimeout } from '../hooks';

import { ActionProps, ToastProps } from './types';
import { useHover } from 'use-events';
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
      />
    </Flex>
  );
};

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ id, message, description, tone = 'none', onClear, action, toastProps = {} }, ref) => {
    const styles = useMemo(() => getCustomProps(toastProps), [toastProps]);
    const remove = useCallback(() => onClear(id), [onClear, id]);

    const { stopTimeout, startTimeout } = useTimeout({
      duration: 8000000,
      onTimeout: remove,
    });

    const noIcon = tone === 'none';
    const Icon = toneToIcon[tone];

    const content = description ? (
      <Stack spacing="tight">
        <Box>
          <Text fontWeight="600" {...styles.message}>
            {message}
          </Text>
        </Box>
        {description ? (
          <Box>
            <Text
              fontSize="14px"
              style={{
                wordBreak: 'break-word',
              }}
              {...styles.description}
            >
              {description}
            </Text>
          </Box>
        ) : null}
        {action ? (
          <Action key={action.label} removeToast={remove} {...action} {...styles.action} />
        ) : null}
      </Stack>
    ) : (
      <Stack spacing="tight">
        <Box>
          <Text {...styles.message}>{message}</Text>
        </Box>
        {action ? (
          <Action key={action.label} removeToast={remove} {...action} {...styles.action} />
        ) : null}
      </Stack>
    );

    return (
      <Flex
        justify="center"
        role="alert"
        ref={ref}
        onMouseEnter={stopTimeout}
        onMouseLeave={startTimeout}
        maxWidth="100%"
        pb="tight"
        px="tight"
      >
        <Box
          p="base"
          border="1px solid"
          borderColor="inherit"
          borderRadius="6px"
          maxWidth="100%"
          {...styles.toast}
        >
          <Box position="relative">
            <Flex align="flex-start">
              {tone !== 'none' ? (
                <Box pt="extra-tight" pr="tight" {...styles?.icon} color={styles.icon.color[tone]}>
                  <Icon size="16px" />
                </Box>
              ) : null}

              <Box pr={noIcon ? 'unset' : 'base'}>{content}</Box>

              <CloseButton onClick={remove} />
            </Flex>
            <Box paddingLeft="tight" position="absolute" left={0} top={0} bottom={0} />
          </Box>
        </Box>
      </Flex>
    );
  }
);
