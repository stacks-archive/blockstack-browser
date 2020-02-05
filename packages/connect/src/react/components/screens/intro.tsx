import React from 'react';
import { Box, BoxProps, Stack, Button } from '@blockstack/ui';

import { CheckList } from '../checklist';
import { Link } from '../link';
import { AppIcon } from '../app-icon';
import { authenticate } from '../../../auth';
import { useConnect } from '../../hooks/useConnect';
import { Logo } from '../logo';
import { useAppDetails } from '../../hooks/useAppDetails';
import { AppsIcon, EncryptionIcon } from '../vector';
import { Title } from '../typography';
import { Screen, ScreenBody, ScreenActions, ScreenFooter } from '../screen';

const AppElement = ({
  name,
  icon,
  ...rest
}: BoxProps & {
  name: string;
  icon: string;
}) => (
  <Box mx="auto" height="70px" position="relative" {...rest}>
    <Box position="absolute" top="-4px" right="-4px">
      <Logo />
    </Box>
    <AppIcon size="72px" src={icon} alt={name} borderRadius="0" />
  </Box>
);

export const Intro = () => {
  const { doGoToHowItWorksScreen, doFinishAuth, doStartAuth, authOptions } = useConnect();
  const { name, icon } = useAppDetails();

  return (
    <Screen noMinHeight textAlign="center">
      <AppElement mt={8} mb={4} name={name} icon={icon} />
      <ScreenBody
        fullWidth
        mt={4}
        body={[
          <Title>Use {name} privately and securely with Data Vault</Title>,
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
        <Button
          width="100%"
          mt={2}
          onClick={() => {
            doStartAuth();
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            authenticate({
              ...authOptions,
              finished: payload => {
                authOptions.finished && authOptions.finished(payload);
                doFinishAuth(payload);
              },
            });
          }}
        >
          Create Data Vault
        </Button>
      </ScreenActions>
      <ScreenFooter>
        <Stack mt={5} spacing={4} isInline>
          <Link
            color="blue"
            onClick={() => {
              doStartAuth();
              // eslint-disable-next-line @typescript-eslint/no-floating-promises
              authenticate({
                ...authOptions,
                finished: payload => {
                  authOptions.finished && authOptions.finished(payload);
                  doFinishAuth(payload);
                },
                sendToSignIn: true,
              });
            }}
          >
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
