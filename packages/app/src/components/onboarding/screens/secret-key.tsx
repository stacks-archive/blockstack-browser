import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Screen, ScreenBody, ScreenActions, Title, PoweredBy, ScreenFooter } from '@blockstack/connect';
import { ScreenHeader } from '@components/connected-screen-header';
import { Button, Text } from '@blockstack/ui';

import { Toast } from '@components/toast';
import { Card } from '@components/card';
import { SeedTextarea } from '@components/seed-textarea';
import { AppState } from '@store';
import { selectSecretKey, selectAppName } from '@store/onboarding/selectors';
import { PasswordManagerHiddenInput } from '@components/pw-manager-input';

interface SecretKeyProps {
  next: () => void;
}

export const SecretKey: React.FC<SecretKeyProps> = props => {
  const title = 'Your Secret Key';
  const { secretKey, appName } = useSelector((state: AppState) => ({
    secretKey: selectSecretKey(state),
    appName: selectAppName(state),
  }));
  const [copied, setCopiedState] = useState(false);

  useEffect(() => {
    if (copied) {
      setTimeout(() => props.next(), 1600);
    }
  });

  const handleButtonClick = () => {
    const input: HTMLInputElement = document.querySelector('.hidden-secret-key') as HTMLInputElement;
    input.select();
    input.setSelectionRange(0, 99999);
    document.execCommand('copy');
    setCopiedState(true);
    document.getSelection()?.empty();
  };

  return (
    <>
      <Screen onSubmit={handleButtonClick}>
        <PasswordManagerHiddenInput appName={appName} secretKey={secretKey} />
        <ScreenHeader />
        <ScreenBody
          mt={6}
          body={[
            <Title>{title}</Title>,
            <Text mt={2} display="block">
              Here’s your Secret Key: 12 words that prove it’s you when you want to use {appName} on a new device. Once
              lost it’s lost forever, so save it somewhere you won’t forget.
            </Text>,
            <Card title="Your Secret Key" mt={6}>
              <SeedTextarea
                readOnly
                spellCheck="false"
                autoCapitalize="false"
                value={secretKey}
                className="hidden-secret-key"
                data-test="textarea-seed-phrase"
              />
            </Card>,
          ]}
        />
        <ScreenActions>
          <Button type="submit" data-test="button-copy-secret-key" size="lg" width="100%" mt={6} isDisabled={copied}>
            Copy Secret Key
          </Button>
        </ScreenActions>
        <ScreenFooter>
          <PoweredBy />
        </ScreenFooter>
      </Screen>
      <Toast show={copied} />
    </>
  );
};
