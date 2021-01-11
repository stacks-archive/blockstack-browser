import React from 'react';
import { Box, Flex, Text, Button } from '@stacks/ui';
import { useWallet } from '@common/hooks/use-wallet';
import { CheckmarkIcon } from '@components/icons/checkmark-icon';
import { useSetRecoilState } from 'recoil';
import { accountDrawerStep, AccountStep } from '@store/recoil/drawers';
import { currentAccountIndexStore } from '@store/recoil/wallet';
import { getAccountDisplayName, getStxAddress } from '@stacks/wallet-sdk';
import { TransactionVersion } from '@stacks/transactions';

interface SwitchAccountProps {
  close: () => void;
}
export const SwitchAccounts: React.FC<SwitchAccountProps> = ({ close }) => {
  const { currentAccount, wallet, currentAccountIndex } = useWallet();
  const setAccountDrawerStep = useSetRecoilState(accountDrawerStep);
  const setCurrentAccountIndex = useSetRecoilState(currentAccountIndexStore);
  if (!currentAccount) return null;
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
        // px={6}
        py="base"
        onClick={() => {
          setCurrentAccountIndex(index);
          close();
        }}
      >
        <Flex width="100%">
          <Box flexGrow={1}>
            <Text fontSize={2} display="block">
              {getAccountDisplayName(currentAccount)}
            </Text>
            <Text fontSize={1} color="gray">
              {getStxAddress({
                account: currentAccount,
                transactionVersion: TransactionVersion.Testnet,
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
