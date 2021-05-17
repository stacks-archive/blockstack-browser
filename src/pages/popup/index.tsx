import React, { memo, useCallback, useRef } from 'react';
import { Button, Stack, Box, StackProps, Flex, useClipboard, BoxProps } from '@stacks/ui';
import { Tooltip } from '@components/tooltip';
import type { ButtonProps } from '@stacks/ui';
import { PopupContainer } from '@components/popup/container';
import { useDoChangeScreen } from '@common/hooks/use-do-change-screen';
import { ScreenPaths } from '@store/types';
import { useWallet } from '@common/hooks/use-wallet';
import { getAccountDisplayName } from '@stacks/wallet-sdk';
import { Caption, Title } from '@components/typography';
import { truncateMiddle } from '@stacks/ui-utils';
import { IconArrowUp, IconCopy, IconQrcode } from '@tabler/icons';
import { useAssets } from '@common/hooks/use-assets';
import { AccountAvatar } from '@components/account-avatar';
import { truncateString } from '@common/utils';
import { Header } from '@components/header';
import { useAccountNames } from '@common/hooks/use-account-names';
import { BalancesAndActivity } from '@components/popup/balances-and-activity';

interface TxButtonProps extends ButtonProps {
  kind: 'send' | 'receive';
  path: ScreenPaths.POPUP_SEND | ScreenPaths.POPUP_RECEIVE;
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

const TxButton: React.FC<TxButtonProps> = memo(({ kind, path, ...rest }) => {
  const ref = useRef<HTMLButtonElement | null>(null);
  const doChangeScreen = useDoChangeScreen();
  const assets = useAssets();

  const isSend = kind === 'send';
  const sendDisabled = !assets.value || (isSend && assets.value?.length === 0);

  const handleClick = useCallback(() => {
    doChangeScreen(path);
  }, [path, doChangeScreen]);

  const handleFocus = useCallback(() => {
    ref?.current?.focus();
  }, [ref]);

  const label = isSend ? 'Send' : 'Receive';
  return (
    <>
      <Button
        size="sm"
        pl="base-tight"
        pr={isSend ? 'base' : 'calc(32px + 12px)'}
        py="tight"
        fontSize={2}
        mode="primary"
        position="relative"
        ref={ref}
        isDisabled={sendDisabled}
        onClick={isSend ? handleClick : undefined}
        borderRadius="12px"
        {...rest}
      >
        <Flex onClick={!isSend ? handleClick : undefined} position="relative" zIndex={2}>
          <Box
            as={isSend ? IconArrowUp : IconQrcode}
            transform={isSend ? 'unset' : 'scaleY(-1)'}
            size="16px"
          />
          <Box as="span" ml="extra-tight" fontSize="14px">
            {label}
          </Box>
        </Flex>

        {!isSend && <CopyAction onClick={handleFocus} />}
      </Button>
    </>
  );
});

const UserAccount: React.FC<StackProps> = memo(props => {
  const names = useAccountNames();
  const { currentAccount, currentAccountStxAddress } = useWallet();
  if (!currentAccount || !currentAccountStxAddress) {
    console.error('Error! Homepage rendered without account state, which should never happen.');
    return null;
  }
  const nameCharLimit = 18;
  const name =
    names?.value?.[currentAccount.index]?.names?.[0] || getAccountDisplayName(currentAccount);
  const isLong = name.length > nameCharLimit;
  const displayName = truncateString(name, nameCharLimit);

  return (
    <Stack spacing="base-tight" alignItems="center" isInline {...props}>
      <AccountAvatar name={name} flexShrink={0} account={currentAccount} />
      <Stack overflow="hidden" display="block" alignItems="flex-start" spacing="base-tight">
        <Box>
          <Tooltip label={isLong ? name : undefined}>
            <Title
              data-test="home-current-display-name"
              as="h1"
              lineHeight="1rem"
              fontSize={4}
              fontWeight={500}
            >
              {displayName}
            </Title>
          </Tooltip>
        </Box>
        <Caption>{truncateMiddle(currentAccountStxAddress, 8)}</Caption>
      </Stack>
    </Stack>
  );
});

const Actions: React.FC<StackProps> = memo(props => {
  return (
    <Stack spacing="base-tight" isInline {...props}>
      <TxButton path={ScreenPaths.POPUP_SEND} kind="send" />
      <TxButton path={ScreenPaths.POPUP_RECEIVE} kind="receive" />
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
  <PopupContainer header={<Header />} requestType="auth">
    <Stack flexGrow={1} spacing="loose">
      <PageTop />
      <BalancesAndActivity />;
    </Stack>
  </PopupContainer>
));
