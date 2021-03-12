import React, { memo, useRef } from 'react';
import { Button, Stack, Box, StackProps, Flex, useClipboard, BoxProps } from '@stacks/ui';
import { Tooltip } from '@components/tooltip';
import type { ButtonProps } from '@stacks/ui';
import { PopupContainer } from '@components/popup/container';
import { useAnalytics } from '@common/hooks/use-analytics';
import { ScreenPaths } from '@store/onboarding/types';
import { useWallet } from '@common/hooks/use-wallet';
import { AccountInfo } from '@components/popup/account-info';
import { getAccountDisplayName } from '@stacks/wallet-sdk';
import { Caption, Title } from '@components/typography';
import { truncateMiddle } from '@stacks/ui-utils';
import { IconArrowUp, IconCopy, IconQrcode } from '@tabler/icons';
import { useAssets } from '@common/hooks/use-assets';
import { AccountAvatar } from '@components/account-avatar';

interface TxButtonProps extends ButtonProps {
  kind: 'send' | 'receive';
}

const CopyAction: React.FC<BoxProps> = memo(({ onClick }) => {
  const { currentAccountStxAddress } = useWallet();
  const { onCopy, hasCopied } = useClipboard(currentAccountStxAddress || '');
  return (
    <>
      <Flex
        alignItems="center"
        borderTopRightRadius="6px"
        borderBottomRightRadius="6px"
        onClick={event => {
          onCopy();
          onClick?.(event);
        }}
        position="absolute"
        right={0}
        zIndex={3}
      >
        <Tooltip label={hasCopied ? 'Copied!' : 'Copy address'}>
          <Box
            pl="tight"
            pr="tight"
            flexGrow={1}
            borderLeft="1px solid"
            borderColor="rgba(255,255,255,0.3)"
            py="tight"
          >
            <Box size="16px" as={IconCopy} />
          </Box>
        </Tooltip>
      </Flex>
    </>
  );
});

const TxButton: React.FC<TxButtonProps> = memo(({ kind, onClick, ...rest }) => {
  const ref = useRef<HTMLButtonElement | null>(null);
  return (
    <>
      <Button
        size="sm"
        pl="base-tight"
        pr={kind === 'send' ? 'base' : 'calc(32px + 12px)'}
        py="tight"
        fontSize={2}
        mode="primary"
        position="relative"
        ref={ref}
        {...rest}
      >
        <Flex onClick={onClick} position="relative" zIndex={2}>
          <Box
            as={kind === 'send' ? IconArrowUp : IconQrcode}
            transform={kind === 'send' ? 'unset' : 'scaleY(-1)'}
            size="16px"
          />
          <Box as="span" ml="extra-tight" fontSize="14px">
            {kind === 'send' ? 'Send' : 'Receive'}
          </Box>
        </Flex>

        {kind !== 'send' && (
          <CopyAction
            onClick={() => {
              ref?.current?.focus();
            }}
          />
        )}
      </Button>
    </>
  );
});

const UserAccount: React.FC<StackProps> = memo(props => {
  const { currentAccount, currentAccountStxAddress } = useWallet();
  if (!currentAccount || !currentAccountStxAddress) {
    console.error('Error! Homepage rendered without account state, which should never happen.');
    return null;
  }
  const displayName = getAccountDisplayName(currentAccount);
  return (
    <Stack spacing="base-tight" alignItems="center" isInline {...props}>
      <AccountAvatar account={currentAccount} />
      <Stack alignItems="flex-start" spacing="base-tight">
        <Title as="h1" lineHeight="1rem" fontSize={4} fontWeight={500}>
          {displayName}
        </Title>
        <Caption>{truncateMiddle(currentAccountStxAddress, 8)}</Caption>
      </Stack>
    </Stack>
  );
});

const Actions: React.FC<StackProps> = memo(props => {
  const { doChangeScreen } = useAnalytics();
  const assets = useAssets();
  return (
    <Stack spacing="base-tight" isInline {...props}>
      <TxButton
        isDisabled={assets.length === 0}
        onClick={() => doChangeScreen(ScreenPaths.POPUP_SEND)}
        kind="send"
      />
      <TxButton onClick={() => doChangeScreen(ScreenPaths.POPUP_RECEIVE)} kind="receive" />
    </Stack>
  );
});

const PageTop: React.FC<StackProps> = memo(props => (
  <Stack data-test="home-page" spacing="loose" {...props}>
    <UserAccount />
    <Actions />
  </Stack>
));

export const PopupHome: React.FC = memo(() => (
  <PopupContainer>
    <Stack spacing="loose">
      <PageTop />
      <AccountInfo />
    </Stack>
  </PopupContainer>
));
