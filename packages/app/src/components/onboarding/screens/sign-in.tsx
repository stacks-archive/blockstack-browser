import React, { useState } from 'react';
import { Screen, ScreenBody, ScreenActions, Title, PoweredBy, ScreenFooter } from '@blockstack/connect';
import { ScreenHeader } from '@components/connected-screen-header';
import { Box, Text, Input, Flex, Button } from '@blockstack/ui';
import { AppIcon } from '@components/app-icon';
import { Link } from '@components/link';
import useDocumentTitle from '@rehooks/document-title';
import { useDispatch, useSelector } from 'react-redux';
import { doTrack, SIGN_IN_CORRECT, SIGN_IN_CREATE, SIGN_IN_INCORRECT } from '@common/track';
import { doChangeScreen, doSetMagicRecoveryCode } from '@store/onboarding/actions';
import { ScreenName, DEFAULT_PASSWORD } from '@store/onboarding/types';
import { AppState } from '@store';
import { selectAppName } from '@store/onboarding/selectors';
import { doStoreSeed } from '@store/wallet';

interface SignInProps {
  next: () => void;
  back: () => void;
}

export const SignIn: React.FC<SignInProps> = props => {
  const [isLoading, setLoading] = useState(false);
  const [seed, setSeed] = useState('');
  const [seedError, setSeedError] = useState<null | string>(null);
  const dispatch = useDispatch();
  const appName = useSelector((state: AppState) => selectAppName(state));
  const title = `Sign into ${appName}`;
  useDocumentTitle(title);

  return (
    <Screen isLoading={isLoading} textAlign="center">
      <ScreenHeader title="Continue with Secret Key" hideIcon />
      <AppIcon mt={10} />
      <ScreenBody
        mt={4}
        body={[
          <Title>{title}</Title>,
          <Box mt={2}>Enter your Secret Key to continue</Box>,
          <Box textAlign="left" mt={6}>
            {/*Validate: track SIGN_IN_INCORRECT*/}
            <Input
              autoFocus
              minHeight="80px"
              placeholder="12-word Secret Key"
              as="textarea"
              value={seed}
              spellCheck={false}
              style={{ resize: 'none' }}
              onChange={(evt: React.FormEvent<HTMLInputElement>) => {
                setSeedError(null);
                setSeed(evt.currentTarget.value);
              }}
            />
            {seedError && (
              <Text textAlign="left" textStyle="caption" color="feedback.error">
                {seedError}
              </Text>
            )}
          </Box>,
        ]}
      />
      <ScreenActions>
        <Flex justify="space-between" align="center" width="100%" mt={6}>
          <Link
            color="blue"
            onClick={() => {
              doTrack(SIGN_IN_CREATE);
              dispatch(doChangeScreen(ScreenName.USERNAME));
            }}
          >
            Create a Secret Key
          </Link>
          <Button
            size="md"
            onClick={async () => {
              setLoading(true);
              try {
                if (seed.trim().split(' ').length <= 1) {
                  dispatch(doSetMagicRecoveryCode(seed.trim()));
                  dispatch(doChangeScreen(ScreenName.RECOVERY_CODE));
                  return;
                }
                await doStoreSeed(seed, DEFAULT_PASSWORD)(dispatch, () => ({}), {});
                doTrack(SIGN_IN_CORRECT);
                props.next();
              } catch (error) {
                setSeedError("The Secret Key you've entered is invalid.");
                doTrack(SIGN_IN_INCORRECT);
              }
              setLoading(false);
            }}
          >
            Continue
          </Button>
        </Flex>
      </ScreenActions>
      <ScreenFooter>
        <PoweredBy />
      </ScreenFooter>
    </Screen>
  );
};
