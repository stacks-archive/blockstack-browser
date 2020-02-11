import React from 'react';
import { useSelector } from 'react-redux';
import { Screen, ScreenBody, ScreenActions, Title } from '@blockstack/connect';
import { ScreenHeader } from '@components/connected-screen-header';
import { Button, Text } from '@blockstack/ui';

import { Toast } from '@components/toast';
import { Card } from '@components/card';
import { SeedTextarea } from '@components/seed-textarea';
import { doTrack, SECRET_KEY_INTRO_COPIED } from '@common/track';
import { AppState } from '@store';
import { selectSecretKey } from '@store/onboarding/selectors';

interface SecretKeyProps {
  next: () => void;
}

export const SecretKey: React.FC<SecretKeyProps> = props => {
  const { secretKey } = useSelector((state: AppState) => ({
    secretKey: selectSecretKey(state),
  }));
  const [copied, setCopiedState] = React.useState(false);

  React.useEffect(() => {
    if (copied) {
      setTimeout(() => {
        props.next();
      }, 2500);
    }
  });

  return (
    <>
      <Screen>
        <ScreenHeader />
        <ScreenBody
          mt={6}
          body={[
            <Title>Your Secret Key</Title>,
            <Text mt={2} display="block">
              Your Data Vault has a Secret Key: 12 words that unlock it, like the key to your home. Once lost, it’s lost
              forever. So save it somewhere you won’t forget.
            </Text>,
            <Card title="Your Secret Key" mt={6}>
              <SeedTextarea
                readOnly
                spellCheck="false"
                value={secretKey}
                className="hidden-secret-key"
                data-test="textarea-seed-phrase"
              />
            </Card>,
          ]}
        />
        <ScreenActions>
          <Button
            data-test="button-copy-secret-key"
            size="md"
            width="100%"
            mt={6}
            isDisabled={copied}
            onClick={() => {
              doTrack(SECRET_KEY_INTRO_COPIED);
              const input: HTMLInputElement = document.querySelector('.hidden-secret-key') as HTMLInputElement;
              input.select();
              input.setSelectionRange(0, 99999);
              document.execCommand('copy');
              setCopiedState(true);
              document.getSelection()?.empty();
            }}
          >
            Copy Secret Key
          </Button>
        </ScreenActions>
      </Screen>
      <Toast show={copied} />
    </>
  );
};
