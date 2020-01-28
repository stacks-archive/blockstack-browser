import React from 'react';
import { useDispatch } from 'react-redux';
import { Box, Spinner, Flex, Text } from '@blockstack/ui';
import { Screen, ScreenBody } from '@blockstack/connect';
import { ScreenHeader } from '@components/connected-screen-header';

import { doCreateSecretKey } from '@store/onboarding/actions';

interface MockData {
  title: string;
  imageUrl: string;
}

const createTimeoutLoop = (setState: (item: MockData) => void, arr: MockData[], onEnd: () => void) =>
  arr.forEach((item, index) =>
    setTimeout(() => {
      setState(item);
      if (index === arr.length - 1) {
        onEnd();
      }
    }, (index + 1) * 2400)
  );

interface CreateProps {
  next: () => void;
}

export const Create: React.FC<CreateProps> = props => {
  const [state, setState] = React.useState({
    title: 'Creating your Data Vault',
    imageUrl: '',
  });
  const dispatch = useDispatch();

  const mockData: MockData[] = [
    {
      title: 'Private data storage',
      imageUrl: '/assets/images/icon-delay-private.svg',
    },
    {
      title: 'Always-on encryption',
      imageUrl: '/assets/images/icon-delay-padlock.svg',
    },
    {
      title: 'Access to 100s of apps',
      imageUrl: '/assets/images/icon-delay-apps.svg',
    },
    {
      title: 'This will not display',
      imageUrl: '',
    },
  ];

  React.useEffect(() => {
    // This timeout is important because if the app is navigated to as a sign in, the
    // create page will be rendered momentarily, and we need to cancel these
    // functions if we're on a different screen
    const timeout = setTimeout(() => {
      createTimeoutLoop(setState, mockData, () => props.next());
      dispatch(doCreateSecretKey());
    }, 200);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Screen textAlign="center">
      <ScreenHeader />
      {state.imageUrl === '' ? (
        undefined
      ) : (
        <Box>
          <Text>Your Data Vault includes:</Text>
          <Flex mt={6} mx="auto" width="240px" height="152px" justifyContent="center">
            <img src={state.imageUrl} />
          </Flex>
        </Box>
      )}
      <ScreenBody
        title={state.title}
        body={[
          <Box pt={10} width="100%">
            <Spinner thickness="3px" size="lg" color="blue" />
          </Box>,
        ]}
      />
    </Screen>
  );
};
