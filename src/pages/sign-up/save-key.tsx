import React, { useState } from 'react';
import { Screen, ScreenBody, ScreenActions, Title, ScreenHeader } from '@screen';
import { Button, Text } from '@stacks/ui';
import { Collapse } from '@components/collapse';
import { faqs } from '@common/onboarding-data';
import { ScreenPaths } from '@store/common/types';
import { useAppDetails } from '@common/hooks/useAppDetails';
import { useDoChangeScreen } from '@common/hooks/use-do-change-screen';

interface SaveKeyProps {
  next: () => void;
}

export const SaveKey: React.FC<SaveKeyProps> = ({ next }) => {
  const title = 'Save your Secret Key';
  const { name } = useAppDetails();
  const doChangeScreen = useDoChangeScreen();
  const [loading, setLoading] = useState(false);

  return (
    <Screen pb={0} isLoading={loading}>
      <ScreenHeader />
      <ScreenBody
        mt={6}
        body={[
          <Title>{title}</Title>,
          <Text display="block" mt={2}>
            Paste your Secret Key wherever you keep critical, private, information such as
            passwords.
          </Text>,
          <Text display="block" mt={5}>
            {' '}
            Once lost, it’s lost forever. So save it somewhere you won’t forget.
          </Text>,
        ]}
      />
      <ScreenActions flexDirection="column">
        <Button
          width="100%"
          size="lg"
          mt={6}
          onClick={() => {
            setLoading(true);
            next();
          }}
          data-test="button-has-saved-seed-phrase"
        >
          {"I've saved it"}
        </Button>
        <Text
          textStyle="caption.medium"
          color="blue"
          display="block"
          textAlign="center"
          py={5}
          cursor="pointer"
          onClick={() => doChangeScreen(ScreenPaths.SECRET_KEY)}
        >
          View Secret Key again
        </Text>
      </ScreenActions>
      <Collapse data={faqs(name as string)} />
    </Screen>
  );
};
