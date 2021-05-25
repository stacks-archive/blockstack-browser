import { Box, BoxProps, color, Stack, StackProps } from '@stacks/ui';
import { Caption, Text } from '@components/typography';
import React, { memo } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

function ErrorButton({ variant, ...props }: { variant?: 'secondary' } & BoxProps) {
  return (
    <Caption
      as="button"
      border={0}
      borderRadius="12px"
      px="base"
      py="base"
      color={color('text-title')}
      bg={variant === 'secondary' ? 'transparent' : color('bg-4')}
      fontWeight={variant === 'secondary' ? 400 : 500}
      {...props}
    />
  );
}

export interface ErrorMessageProps extends StackProps {
  title: string;
  body: string | JSX.Element;
  actions?: {
    onClick: () => void;
    label: string;
    variant?: 'secondary';
  }[];
}

export const ErrorMessage = memo(({ title, body, actions, ...rest }: ErrorMessageProps) => {
  return (
    <Stack
      mt="loose"
      p="loose"
      borderRadius="12px"
      border="4px solid #FCEEED"
      spacing="extra-loose"
      color={color('feedback-error')}
      {...rest}
    >
      <Stack spacing="base-loose">
        <Stack alignItems="center" isInline>
          <Box strokeWidth={2} as={FiAlertTriangle} />
          <Text color="currentColor">{title}</Text>
        </Stack>
        <Caption color={color('text-body')}>{body}</Caption>
      </Stack>
      <Stack spacing="loose">
        {actions && (
          <Stack isInline flexWrap="wrap">
            {actions.map(action => (
              <ErrorButton
                flexGrow={1}
                borderRadius="12px"
                onClick={action.onClick}
                variant={action.variant}
              >
                {action.label}
              </ErrorButton>
            ))}
          </Stack>
        )}
        <ErrorButton
          p={0}
          flexGrow={1}
          borderRadius="12px"
          onClick={() => window.close()}
          variant="secondary"
        >
          Close window
        </ErrorButton>
      </Stack>
    </Stack>
  );
});
