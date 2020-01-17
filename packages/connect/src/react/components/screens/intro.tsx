import React from 'react';
import { Box, BoxProps, Stack } from '@blockstack/ui';
import { ScreenTemplate } from '../screen';
import { CheckList } from '../checklist';
import { Link } from '../link';
import { AppIcon } from '../app-icon';
import { authenticate } from '../../../auth';
import { useConnect } from '../../hooks/useConnect';
import { Logo } from '../logo';
import { useAppDetails } from '../../hooks/useAppDetails';
import { AppsIcon, EncryptionIcon } from '../vector';

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

const Intro = () => {
  const { doGoToHowItWorksScreen, doFinishAuth, doStartAuth, isAuthenticating, authOptions } = useConnect();
  const { name, icon } = useAppDetails();

  return (
    <>
      <ScreenTemplate
        before={<AppElement mt={5} name={name} icon={icon} />}
        textAlign="center"
        noMinHeight
        title={`Use ${name} privately and securely with Data Vault`}
        body={[
          'Create your Data Vault to continue.',
          <Box mx="auto" width="100%" height="1px" bg="#E5E5EC" />,
          <CheckList
            items={[
              {
                icon: EncryptionIcon,
                text: `Keep everything you do in ${name} private with encryption and blockchain`,
              },
              {
                icon: AppsIcon,
                text: 'Data Vault is easy to set up and free to use with over 300 apps',
              },
            ]}
          />,
        ]}
        action={{
          label: 'Create Data Vault',
          isLoading: isAuthenticating,
          onClick: () => {
            doStartAuth();
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            authenticate({
              ...authOptions,
              finished: payload => {
                authOptions.finished && authOptions.finished(payload);
                doFinishAuth(payload);
              },
            });
          },
        }}
        footer={
          <>
            <Stack spacing={4} isInline>
              <Link
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
                onClick={() => {
                  doGoToHowItWorksScreen();
                }}
              >
                How Data Vault works
              </Link>
            </Stack>
          </>
        }
      />
    </>
  );
};

export { Intro };
