import React, { memo, useCallback } from 'react';
import { Box, Fade, Button, Stack, color } from '@stacks/ui';
import { Title, Caption } from '@components/typography';
import { useWallet } from '@common/hooks/use-wallet';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { accountDrawerStep, AccountStep } from '@store/recoil/drawers';
import { getAccountDisplayName, getStxAddress } from '@stacks/wallet-sdk';
import { currentTransactionVersion } from '@store/recoil/networks';
import { truncateMiddle } from '@stacks/ui-utils';
import { SpaceBetween } from '@components/space-between';
import { IconCheck } from '@tabler/icons';
import { AccountAvatar } from '@components/account-avatar';

interface SwitchAccountProps {
  close: () => void;
}

const TIMEOUT = 350;

const useSwitchAccount = (handleClose: () => void) => {
  const { wallet, currentAccountIndex, doSwitchAccount } = useWallet();
  const transactionVersion = useRecoilValue(currentTransactionVersion);

  const handleSwitchAccount = useCallback(
    async index => {
      await doSwitchAccount(index);
      window.setTimeout(() => {
        handleClose();
      }, TIMEOUT);
    },
    [doSwitchAccount, handleClose]
  );

  const accounts = wallet?.accounts || [];
  const getIsActive = (index: number) => index === currentAccountIndex;
  return { accounts, handleSwitchAccount, getIsActive, transactionVersion };
};

// eslint-disable-next-line no-warning-comments
// TODO: this page is nearly identical to the network switcher abstract it out into a shared component
const AccountList: React.FC<{ handleClose: () => void }> = memo(({ handleClose }) => {
  const { accounts, handleSwitchAccount, transactionVersion, getIsActive } = useSwitchAccount(
    handleClose
  );
  return (
    <>
      {accounts.map((account, index) => {
        return (
          <SpaceBetween
            width="100%"
            key={`account-${account.index}`}
            _hover={{
              bg: color('bg-4'),
            }}
            cursor="pointer"
            py="base"
            px="loose"
            onClick={() => handleSwitchAccount(index)}
          >
            <Stack isInline alignItems="center" spacing="base">
              <AccountAvatar account={account} />
              <Stack spacing="base-tight">
                <Title fontSize={2} lineHeight="1rem" fontWeight="400">
                  {getAccountDisplayName(account)}
                </Title>
                <Caption>
                  {truncateMiddle(
                    getStxAddress({
                      account: account,
                      transactionVersion,
                    }),
                    9
                  )}
                </Caption>
              </Stack>
            </Stack>
            <Fade in={getIsActive(index)}>
              {styles => (
                <Box
                  as={IconCheck}
                  size="18px"
                  strokeWidth={2.5}
                  color={color('brand')}
                  style={styles}
                />
              )}
            </Fade>
          </SpaceBetween>
        );
      })}
    </>
  );
});

export const SwitchAccounts: React.FC<SwitchAccountProps> = memo(({ close }) => {
  const setAccountDrawerStep = useSetRecoilState(accountDrawerStep);
  return (
    <>
      <AccountList handleClose={close} />
      <Box pt="base" pb="loose" px="loose">
        <Button onClick={() => setAccountDrawerStep(AccountStep.Create)}>Create an account</Button>
      </Box>
    </>
  );
});
