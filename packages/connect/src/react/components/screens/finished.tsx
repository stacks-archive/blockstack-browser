import React from 'react';
import { Box, BoxProps, Button } from '@blockstack/ui';

import { useConnect } from '../../hooks/useConnect';
import { useAppDetails } from '../../hooks/useAppDetails';
import { Title } from '../typography';
import { Screen, ScreenBody, ScreenActions } from '../screen';
import { CheckmarkIcon } from '../checkmark';

interface AppElementProps extends BoxProps {
  name: string;
  icon: string;
}

const FinishedIcon = ({ ...rest }: AppElementProps) => (
  <Box mx="auto" size="70px" position="relative" {...rest}>
    <CheckmarkIcon />
  </Box>
);

export const Finished = () => {
  const { doCloseDataVault } = useConnect();
  const { name, icon } = useAppDetails();

  return (
    <Screen textAlign="center" noMinHeight>
      <FinishedIcon mt={10} name={name} icon={icon} />
      <ScreenBody
        mt={4}
        body={[
          <Title>{name} has been connected to your Data Vault</Title>,
          <Box mt={2}>
            Everything you do in {name} will be private, secure, and only accessible with your Secret Key.
          </Box>,
        ]}
      />
      <ScreenActions>
        <Button width="100%" mt={4} onClick={() => doCloseDataVault()}>
          Close
        </Button>
      </ScreenActions>
    </Screen>
  );
};
