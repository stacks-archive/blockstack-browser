import { Box, Button, ButtonProps, Stack, StackProps } from '@stacks/ui';
import { ScreenPaths } from '@common/types';
import React, { memo, useCallback, useRef } from 'react';
import { useDoChangeScreen } from '@common/hooks/use-do-change-screen';
import { IconArrowUp, IconQrcode } from '@tabler/icons';
import { useTransferableAssets } from '@common/hooks/use-assets';
import { WalletPageSelectors } from '@tests/page-objects/wallet.selectors';

interface TxButtonProps extends ButtonProps {
  kind: 'send' | 'receive';
  path: ScreenPaths.POPUP_SEND | ScreenPaths.POPUP_RECEIVE;
}

const TxButton: React.FC<TxButtonProps> = memo(({ kind, path, ...rest }) => {
  const ref = useRef<HTMLButtonElement | null>(null);
  const doChangeScreen = useDoChangeScreen();

  const isSend = kind === 'send';

  const handleClick = useCallback(() => {
    doChangeScreen(path);
  }, [path, doChangeScreen]);

  const label = isSend ? 'Send' : 'Receive';
  return (
    <>
      <Button
        size="sm"
        pl="base-tight"
        pr={'base'}
        py="tight"
        fontSize={2}
        mode="primary"
        position="relative"
        ref={ref}
        onClick={handleClick}
        borderRadius="12px"
        {...rest}
      >
        <Box
          as={isSend ? IconArrowUp : IconQrcode}
          transform={isSend ? 'unset' : 'scaleY(-1)'}
          size="16px"
        />
        <Box as="span" ml="extra-tight" fontSize="14px">
          {label}
        </Box>
      </Button>
    </>
  );
});

const SendButtonSuspense = () => {
  const assets = useTransferableAssets();
  const isDisabled = !assets || assets?.length === 0;
  return (
    <TxButton
      isDisabled={isDisabled}
      path={ScreenPaths.POPUP_SEND}
      data-testid={WalletPageSelectors.BtnSendTokens}
      kind="send"
    />
  );
};
const SendButtonFallback = memo(() => (
  <TxButton isDisabled path={ScreenPaths.POPUP_SEND} kind="send" />
));

const SendButton = () => (
  <React.Suspense fallback={<SendButtonFallback />}>
    <SendButtonSuspense />
  </React.Suspense>
);

export const HomeActions: React.FC<StackProps> = props => {
  return (
    <Stack isInline spacing="base-tight" {...props}>
      <SendButton />
      <TxButton path={ScreenPaths.POPUP_RECEIVE} kind="receive" />
    </Stack>
  );
};
