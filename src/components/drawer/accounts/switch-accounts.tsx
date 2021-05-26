import React, { memo } from 'react';
import { Box, Fade, Button, Stack, color } from '@stacks/ui';
import { Title, Caption } from '@components/typography';
import { useSetRecoilState } from 'recoil';
import { accountDrawerStep, AccountStep } from '@store/ui';
import { getAccountDisplayName, getStxAddress } from '@stacks/wallet-sdk';
import { truncateMiddle } from '@stacks/ui-utils';
import { SpaceBetween } from '@components/space-between';
import { IconCheck } from '@tabler/icons';
import { AccountAvatar } from '@components/account-avatar';
import { useAccountNames } from '@common/hooks/account/use-account-names';
import { useSwitchAccount } from '@common/hooks/account/use-switch-account';

interface SwitchAccountProps {
  close: () => void;
}

// eslint-disable-next-line no-warning-comments
// TODO: this page is nearly identical to the network switcher abstract it out into a shared component
const AccountList: React.FC<{ handleClose: () => void }> = memo(({ handleClose }) => {
  const names = useAccountNames();
  const { accounts, handleSwitchAccount, transactionVersion, getIsActive } =
    useSwitchAccount(handleClose);
  if (!names.value) return null;
  return (
    <>
      {accounts.map((account, index) => {
        const name = names.value?.[index]?.names?.[0] || getAccountDisplayName(account);

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
              <AccountAvatar name={name} account={account} />
              <Stack spacing="base-tight">
                <Title fontSize={2} lineHeight="1rem" fontWeight="400">
                  {name}
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
