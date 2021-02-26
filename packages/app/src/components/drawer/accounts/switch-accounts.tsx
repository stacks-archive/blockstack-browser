import React from 'react';
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

interface SwitchAccountProps {
  close: () => void;
}

// eslint-disable-next-line no-warning-comments
// TODO: this page is nearly identical to the network switcher abstract it out into a shared component

export const SwitchAccounts: React.FC<SwitchAccountProps> = ({ close }) => {
  const { wallet, currentAccountIndex, doSwitchAccount } = useWallet();
  const setAccountDrawerStep = useSetRecoilState(accountDrawerStep);
  const transactionVersion = useRecoilValue(currentTransactionVersion);
  const accountRows = (wallet?.accounts || []).map((account, index) => {
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
        onClick={async () => {
          await doSwitchAccount(index);
          setTimeout(() => {
            close();
          }, 350);
        }}
      >
        <Stack>
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
        <Fade in={index === currentAccountIndex}>
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
  });

  return (
    <>
      {accountRows}
      <Box pt="base" px="loose">
        <Button onClick={() => setAccountDrawerStep(AccountStep.Create)}>Create an account</Button>
      </Box>
    </>
  );
};
