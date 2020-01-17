import React from 'react';
import { Box, BoxProps } from '@blockstack/ui';
import { ScreenTemplate } from '../screen';

import { AppIcon } from '../app-icon';

import { useConnect } from '../../hooks/useConnect';
import { Logo } from '../logo';
import { useAppDetails } from '../../hooks/useAppDetails';

const AppElement = ({
  name,
  icon,
  ...rest
}: BoxProps & {
  name: string;
  icon: string;
}) => (
  <Box mx="auto" size="70px" position="relative" {...rest}>
    <Box position="absolute" top="-4px" right="-4px">
      <Logo />
    </Box>
    <AppIcon size="64px" src={icon} alt={name} borderRadius="0" />
  </Box>
);

const Finished = () => {
  const { doCloseDataVault } = useConnect();
  const { name, icon } = useAppDetails();

  return (
    <>
      <ScreenTemplate
        before={<AppElement mt={5} name={name} icon={icon} />}
        textAlign="center"
        noMinHeight
        title={`${name} has been connected to your Data Vault`}
        body={[`Everything you do in ${name} will be private, secure, and only accessible with your Secret Key.`]}
        action={{
          label: 'Close',
          onClick: () => {
            doCloseDataVault();
          },
        }}
      />
    </>
  );
};

export { Finished };
