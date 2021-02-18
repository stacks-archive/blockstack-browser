import React from 'react';
import { Box, Flex, Text, Button } from '@stacks/ui';
import { useWallet } from '@common/hooks/use-wallet';
import { CheckmarkIcon } from '@components/icons/checkmark-icon';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { accountDrawerStep, AccountStep } from '@store/recoil/drawers';
import { getAccountDisplayName, getStxAddress } from '@stacks/wallet-sdk';
import { currentTransactionVersion } from '@store/recoil/networks';

interface SwitchAccountProps {
  close: () => void;
}
export const SwitchAccounts: React.FC<SwitchAccountProps> = ({ close }) => {
  const { wallet, currentAccountIndex, doSwitchAccount } = useWallet();
  const setAccountDrawerStep = useSetRecoilState(accountDrawerStep);
  const transactionVersion = useRecoilValue(currentTransactionVersion);
  const accountRows = (wallet?.accounts || []).map((account, index) => {
    return (
      <Box
        width="100%"
        key={`account-${account.index}`}
        _hover={{
          letterSpacing: '0.25px',
        }}
        transition="100ms letter-spacing"
        cursor="pointer"
        py="base"
        onClick={async () => {
          await doSwitchAccount(index);
          close();
        }}
      >
        <Flex width="100%">
          <Box flexGrow={1}>
            <Text fontSize={2} display="block">
              {getAccountDisplayName(account)}
            </Text>
            <Text fontSize={1} color="gray">
              {getStxAddress({
                account: account,
                transactionVersion,
              })}
            </Text>
          </Box>
          <Box pt="base-loose">{index === currentAccountIndex ? <CheckmarkIcon /> : null}</Box>
        </Flex>
      </Box>
    );
  });

  return (
    <Box width="100%" px={6}>
      <Box>
        <Text fontSize={4} fontWeight="600">
          Switch Account
        </Text>
      </Box>
      <Flex flexWrap="wrap" flexDirection="column">
        {accountRows}
      </Flex>
      <Box py="base">
        <Button width="100%" onClick={() => setAccountDrawerStep(AccountStep.Create)}>
          Create an account
        </Button>
      </Box>
    </Box>
  );
};
