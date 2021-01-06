import React from 'react';
import { Box, Flex, Text, Button } from '@stacks/ui';
import { useWallet } from '@common/hooks/use-wallet';
import { getIdentityDisplayName } from '@common/stacks-utils';
import { CheckmarkIcon } from '@components/icons/checkmark-icon';
import { useSetRecoilState } from 'recoil';
import { accountDrawerStep, AccountStep } from '@store/recoil/drawers';
import { currentIdentityIndexStore } from '@store/recoil/wallet';

interface SwitchAccountProps {
  close: () => void;
}
export const SwitchAccounts: React.FC<SwitchAccountProps> = ({ close }) => {
  const { identities, currentIdentityIndex } = useWallet();
  const setAccountDrawerStep = useSetRecoilState(accountDrawerStep);
  const setCurrentIdentityIndex = useSetRecoilState(currentIdentityIndexStore);
  const identityRows = (identities || []).map((identity, index) => {
    return (
      <Box
        width="100%"
        key={identity.address}
        _hover={{
          letterSpacing: '0.25px',
        }}
        transition="100ms letter-spacing"
        cursor="pointer"
        // px={6}
        py="base"
        onClick={() => {
          setCurrentIdentityIndex(index);
          close();
        }}
      >
        <Flex width="100%">
          <Box flexGrow={1}>
            <Text fontSize={2} display="block">
              {getIdentityDisplayName(identity, index)}
            </Text>
            <Text fontSize={1} color="gray">
              {identity.getStxAddress()}
            </Text>
          </Box>
          <Box pt="base-loose">{index === currentIdentityIndex ? <CheckmarkIcon /> : null}</Box>
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
        {identityRows}
      </Flex>
      <Box py="base">
        <Button width="100%" onClick={() => setAccountDrawerStep(AccountStep.Create)}>
          Create an account
        </Button>
      </Box>
    </Box>
  );
};
