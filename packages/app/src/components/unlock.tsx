import React, { useState, useCallback } from 'react';
import { useWallet } from '@common/hooks/use-wallet';
import { Box, Button, Text, Input } from '@stacks/ui';
import { PopupContainer } from './popup/container';
import { buildEnterKeyEvent } from './link';
import { ErrorLabel } from './error-label';

export const Unlock: React.FC = () => {
  const { doUnlockWallet } = useWallet();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      await doUnlockWallet(password);
    } catch (error) {
      console.error(error);
      setError('The password you entered is invalid.');
    }
    setLoading(false);
  }, [doUnlockWallet, password]);

  return (
    <PopupContainer>
      <Box width="100%" mt="loose">
        <Text textStyle="body.large" display="block">
          Enter your password you used on this device to unlock your wallet.
        </Text>
      </Box>
      <Box mt="loose" width="100%">
        <Input
          placeholder="Set a password"
          width="100%"
          autoFocus
          type="password"
          value={password}
          data-test="set-password"
          onChange={(e: React.FormEvent<HTMLInputElement>) => setPassword(e.currentTarget.value)}
          onKeyUp={buildEnterKeyEvent(submit)}
        />
      </Box>
      {error && (
        <Box>
          <ErrorLabel>
            <Text textStyle="caption">{error}</Text>
          </ErrorLabel>
        </Box>
      )}
      <Box flexGrow={1} />
      <Box>
        <Button
          width="100%"
          isLoading={loading}
          isDisabled={loading}
          onClick={submit}
          data-test="set-password-done"
        >
          Unlock
        </Button>
      </Box>
    </PopupContainer>
  );
};
