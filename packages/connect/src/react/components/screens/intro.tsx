import React from 'react';
import { Flex, Box, BoxProps, Stack, Button } from '@blockstack/ui';

import { CheckList } from '../checklist';
import { Link } from '../link';
import { AppIcon } from '../app-icon';
import { useConnect } from '../../hooks/useConnect';
import { useAppDetails } from '../../hooks/useAppDetails';
import { AppsIcon, EncryptionIcon } from '../vector';
import { Title } from '../typography';
import { Screen, ScreenBody, ScreenActions, ScreenFooter } from '../screen';
import { UnionLine } from '../icons/union-line';
import { PadlockIcon } from '../icons/padlock';

const AppElement = ({
  name,
  icon,
  ...rest
}: BoxProps & {
  name: string;
  icon: string;
}) => (
  <Flex mx="auto" position="relative" {...rest}>
    <AppIcon size="64px" mr="6" src={icon} alt={name} borderRadius="0" />
    <Box position="absolute" left="50%" top="50%" ml="-16px" mt="-6px">
      <UnionLine />
    </Box>
    <PadlockIcon />
  </Flex>
);

export const Intro = () => {
  const { doGoToHowItWorksScreen, doAuth } = useConnect();
  const { name, icon } = useAppDetails();

  return (
    <Screen noMinHeight textAlign="center">
      <AppElement mt={8} name={name} icon={icon} />
      <ScreenBody
        fullWidth
        mt={4}
        body={[
          <Title>{name} works with Data Vault to guarantee your privacy</Title>,
          <Box mt={4} mx="auto" width="100%" height="1px" bg="#E5E5EC" />,
          <Box>
            <CheckList
              items={[
                {
                  icon: () => <AppIcon alt={name} src={icon} />,
                  text: `You will use your Data Vault to sign into ${name} privately`,
                },
                {
                  icon: EncryptionIcon,
                  text: `Data Vault keeps what you do in ${name} private using encryption and blockchain`,
                },
                {
                  icon: AppsIcon,
                  text: 'Data Vault is free to use with over 300 apps',
                },
              ]}
            />
          </Box>,
        ]}
      />
      <ScreenActions>
        <Button width="100%" size="md" mt={2} onClick={() => doAuth()}>
          Create Data Vault
        </Button>
      </ScreenActions>
      <ScreenFooter>
        <Stack mt={5} spacing={4} isInline>
          <Link color="blue" onClick={() => doAuth({ sendToSignIn: true })}>
            Sign in to Data Vault
          </Link>
          <Link
            color="blue"
            onClick={() => {
              doGoToHowItWorksScreen();
            }}
          >
            How Data Vault works
          </Link>
        </Stack>
      </ScreenFooter>
    </Screen>
  );
};
