import React from 'react';
import { Flex, Box, BoxProps, Stack, Button } from '@blockstack/ui';

import { CheckList } from '../checklist';
import { Link } from '../link';
import { AppIcon } from '../app-icon';
import { authenticate } from '../../../auth';
import { useConnect } from '../../hooks/useConnect';
import { useAppDetails } from '../../hooks/useAppDetails';
import { AppsIcon, EncryptionIcon } from '../vector';
import { Title } from '../typography';
import { Screen, ScreenBody, ScreenActions, ScreenFooter } from '../screen';

const UnionLine = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="7" fill="none" viewBox="0 0 32 7">
    <mask id="a" width="32" height="7" x="0" y="0" fill="#000" maskUnits="userSpaceOnUse">
      <path fill="#fff" d="M0 0H32V7H0z"></path>
      <path
        fillRule="evenodd"
        d="M3.5 5a1.5 1.5 0 001.415-1h22.17a1.5 1.5 0 100-1H4.915A1.5 1.5 0 103.5 5z"
        clipRule="evenodd"
      ></path>
    </mask>
    <path
      fill="#677282"
      fillRule="evenodd"
      d="M3.5 5a1.5 1.5 0 001.415-1h22.17a1.5 1.5 0 100-1H4.915A1.5 1.5 0 103.5 5z"
      clipRule="evenodd"
    ></path>
    <path
      fill="#fff"
      d="M4.915 4V2H3.5L3.03 3.334 4.915 4zm22.17 0l1.886-.667L28.5 2h-1.415v2zm0-1v2H28.5l.471-1.333L27.085 3zM4.915 3l-1.886.666L3.5 5h1.415V3zm-1.886.334A.5.5 0 013.5 3v4a3.5 3.5 0 003.3-2.334L3.03 3.334zM27.085 2H4.915v4h22.17V2zM28.5 3a.5.5 0 01.471.333L25.2 4.667A3.5 3.5 0 0028.5 7V3zm-.5.5a.5.5 0 01.5-.5v4A3.5 3.5 0 0032 3.5h-4zm.5.5a.5.5 0 01-.5-.5h4A3.5 3.5 0 0028.5 0v4zm.471-.333A.5.5 0 0128.5 4V0a3.5 3.5 0 00-3.3 2.333l3.771 1.333zM4.915 5h22.17V1H4.915v4zM3.5 4a.5.5 0 01-.471-.334L6.8 2.334A3.5 3.5 0 003.5 0v4zm.5-.5a.5.5 0 01-.5.5V0A3.5 3.5 0 000 3.5h4zM3.5 3a.5.5 0 01.5.5H0A3.5 3.5 0 003.5 7V3z"
      mask="url(#a)"
    ></path>
  </svg>
);

const PadlockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none" viewBox="0 0 64 64">
    <path
      d="M0 25.6C0 16.6392 0 12.1587 1.7439 8.73615C3.27787 5.72556 5.72556 3.27787 8.73615 1.7439C12.1587 0 16.6392 0 25.6 0L38.4 0C47.3608 0 51.8413 0 55.2638 1.7439C58.2744 3.27787 60.7221 5.72556 62.2561 8.73615C64 12.1587 64 16.6392 64 25.6V38.4C64 47.3608 64 51.8413 62.2561 55.2638C60.7221 58.2744 58.2744 60.7221 55.2638 62.2561C51.8413 64 47.3608 64 38.4 64H25.6C16.6392 64 12.1587 64 8.73615 62.2561C5.72556 60.7221 3.27787 58.2744 1.7439 55.2638C0 51.8413 0 47.3608 0 38.4L0 25.6Z"
      fill="#E3E5FF"
    />
    <path
      d="M40.7273 26.7143H39.6364V23.5C39.6364 21.5109 38.8318 19.6032 37.3997 18.1967C35.9676 16.7902 34.0253 16 32 16C29.9747 16 28.0324 16.7902 26.6003 18.1967C25.1682 19.6032 24.3636 21.5109 24.3636 23.5V26.7143H23.2727C22.405 26.7152 21.5732 27.0542 20.9596 27.6568C20.3461 28.2594 20.001 29.0764 20 29.9286V42.7857C20.001 43.6379 20.3461 44.4549 20.9596 45.0575C21.5732 45.6601 22.405 45.9991 23.2727 46H40.7273C41.595 45.9991 42.4268 45.6601 43.0404 45.0575C43.6539 44.4549 43.999 43.6379 44 42.7857V29.9286C43.999 29.0764 43.6539 28.2594 43.0404 27.6568C42.4268 27.0542 41.595 26.7152 40.7273 26.7143ZM26.5455 23.5C26.5455 22.0792 27.1201 20.7166 28.1431 19.7119C29.166 18.7073 30.5534 18.1429 32 18.1429C33.4466 18.1429 34.834 18.7073 35.8569 19.7119C36.8799 20.7166 37.4545 22.0792 37.4545 23.5V26.7143H26.5455V23.5Z"
      fill="#3700FF"
    />
  </svg>
);

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
  const { doGoToHowItWorksScreen, doFinishAuth, doStartAuth, authOptions } = useConnect();
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
        <Button
          size="md"
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
