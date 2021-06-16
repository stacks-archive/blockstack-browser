import { color, Box, Stack, StackProps, useClipboard } from '@stacks/ui';
import { Caption } from '@components/typography';
import React, { memo } from 'react';
import { useCurrentAccount } from '@common/hooks/account/use-current-account';
import { Tooltip } from '@components/tooltip';
import { truncateMiddle } from '@stacks/ui-utils';
import { FiCopy } from 'react-icons/fi';
import { CurrentUserAvatar } from '@components/current-user/current-user-avatar';
import { CurrentUsername } from '@components/current-user/current-user-name';

const UserAddress = memo((props: StackProps) => {
  const currentAccount = useCurrentAccount();
  const { onCopy, hasCopied } = useClipboard(currentAccount?.address || '');
  return currentAccount ? (
    <Tooltip placement="right-end" label={hasCopied ? 'Copied!' : 'Copy address'}>
      <Stack isInline {...props}>
        <Caption>{truncateMiddle(currentAccount.address)}</Caption>

        <Box
          _hover={{ cursor: 'pointer' }}
          onClick={onCopy}
          size="12px"
          color={color('text-caption')}
          as={FiCopy}
        />
      </Stack>
    </Tooltip>
  ) : null;
});

export const UserAccount: React.FC<StackProps> = memo(props => {
  const currentAccount = useCurrentAccount();
  if (!currentAccount) {
    console.error('Error! Homepage rendered without account state, which should never happen.');
    return null;
  }
  return (
    <Stack spacing="base-tight" alignItems="center" isInline {...props}>
      <CurrentUserAvatar />
      <Stack overflow="hidden" display="block" alignItems="flex-start" spacing="base-tight">
        <CurrentUsername />
        <UserAddress />
      </Stack>
    </Stack>
  );
});
