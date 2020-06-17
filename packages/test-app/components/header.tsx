import React, { useContext } from 'react';
import { Flex, Box, Text } from '@blockstack/ui';
import { BlockstackIcon } from '@blockstack/ui';
import { AppContext } from '@common/context';
import { Link } from '@blockstack/connect';

interface HeaderProps {
  signOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({ signOut }) => {
  const state = useContext(AppContext);
  return (
    <Flex as="nav" justifyContent="space-between" alignItems="center" height="64px" px={6}>
      <Box verticalAlign="center">
        <BlockstackIcon maxHeight="26px" display="inline-block" ml="-10px" />
        <Text display="inline-block" ml={1}>
          Blockstack
        </Text>
      </Box>
      {state.userData ? (
        <Box>
          <Link
            display="inline-block"
            ml={2}
            textStyle="caption.medium"
            color="blue"
            onClick={() => {
              signOut();
            }}
          >
            Sign out
          </Link>
        </Box>
      ) : null}
    </Flex>
  );
};
