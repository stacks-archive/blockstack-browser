import { useAtomValue } from 'jotai/utils';
import { PopupContainer } from '@components/popup/container';
import { Header } from '@components/header';
import { Box, Button, CodeBlock, color, Stack } from '@stacks/ui';
import { Prism } from '@common/clarity-prism';
import React from 'react';
import { errorStackTraceState } from '@store/ui';
import { ErrorBoundary, FallbackProps } from '@features/errors/error-boundary';
import { Title } from '@components/typography';
import { openGithubIssue, useErrorHandler } from '@features/errors/utils';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const value = useAtomValue(errorStackTraceState);
  return (
    <PopupContainer header={<Header />}>
      <Stack spacing="extra-loose" flexGrow={1}>
        <Title fontSize={3}>Something went wrong</Title>
        <Box className="error-codeblock" maxWidth="100vw" overflow="hidden">
          {value && (
            <CodeBlock
              maxWidth="100%"
              flexShrink={1}
              overflow="auto"
              maxHeight="305px"
              border="4px solid"
              borderColor={color('border')}
              borderRadius="12px"
              backgroundColor="ink.1000"
              width="100%"
              code={value as string}
              language="bash"
              Prism={Prism as any}
            />
          )}
        </Box>
        <Stack mt="auto" spacing="base">
          <Button onClick={resetErrorBoundary}>Reload extension</Button>
          <Button
            mode="tertiary"
            onClick={() => openGithubIssue({ message: error.message, stackTrace: value })}
          >
            Report issue on GitHub
          </Button>
        </Stack>
      </Stack>
    </PopupContainer>
  );
}

export const AppErrorBoundary: React.FC = ({ children }) => {
  const handleOnError = useErrorHandler();
  return (
    <ErrorBoundary
      onReset={() => {
        window.location.reload();
      }}
      FallbackComponent={ErrorFallback}
      onError={handleOnError}
    >
      {children}
    </ErrorBoundary>
  );
};
