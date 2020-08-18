import React from 'react';
import { Flex, Box, BoxProps, Stack, Button } from '@blockstack/ui';
import { CheckList } from '../checklist';
import { Link } from '../link';
import { AppIcon } from '../app-icon';
import { EyeIcon, EncryptionIcon } from '../vector';
import { useConnect } from '../../hooks/use-connect';
import { useAppDetails } from '../../hooks/use-app-details';
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
    <AppIcon size="64px" mr="loose" src={icon} alt={name} borderRadius="0" />
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
      <AppElement mt="loose" name={name} icon={icon} />
      <ScreenBody
        fullWidth
        mt="base"
        body={[
          <Title
            fontSize="20px"
            lineHeight="28px"
            px="extra-loose"
          >{`${name} guarantees your privacy by encrypting everything`}</Title>,
          <Box mt="base" mx="auto" width="100%" height="1px" bg="#E5E5EC" />,
          <Box>
            <CheckList
              items={[
                {
                  icon: EncryptionIcon,
                  text: "You'll get a Secret Key that automatically encrypts everything you do",
                },
                {
                  icon: EyeIcon,
                  text: `${name} won't be able to see, access, or track your activity`,
                },
              ]}
            />
          </Box>,
        ]}
      />
      <ScreenActions>
        <Button width="100%" size="lg" mt="tight" onClick={() => doAuth()}>
          Get started
        </Button>
      </ScreenActions>
      <ScreenFooter>
        <Stack mb="base-loose" mt="base-tight" spacing="base" isInline>
          <Link textStyle="caption" color="blue" onClick={() => doAuth({ sendToSignIn: true })}>
            Sign in
          </Link>
          <Link
            color="blue"
            textStyle="caption"
            onClick={() => {
              doGoToHowItWorksScreen();
            }}
          >
            How it works
          </Link>
          <Link
            color="blue"
            textStyle="caption"
            onClick={() => {
              window.open('https://www2.blockstack.org/install-extension', '_blank');
            }}
          >
            Install extension
          </Link>
        </Stack>
      </ScreenFooter>
    </Screen>
  );
};
