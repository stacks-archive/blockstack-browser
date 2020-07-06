import React from 'react';
import { Flex, space } from '@blockstack/ui';
import { Text } from '@components/typography';
import { ContentWrapper } from './content-wrapper';
import { useAppState } from '@common/hooks/use-app-state';

export const GettingStartedHeader = () => {
  const { version } = useAppState();
  return (
    <Flex
      align="center"
      justify="center"
      minHeight={['unset', 'unset', '300px']}
      bg="ink"
      borderBottom="1px solid var(--colors-border)"
      pb={space('extra-loose')}
    >
      <ContentWrapper maxWidth="98ch" width="100%" px={space('extra-loose')}>
        <Text color="white" as="h1" display="block" fontSize="42px">
          Blockstack UI
        </Text>
        <Text pt={1} display="block" as="h2" fontSize={[3, 3, 4]} color="white">
          The Blockstack design system, built with React and styled-system.
        </Text>
        {version !== '' ? (
          <Text opacity={0.5} display="block" pt={2} fontFamily="mono" color="white">
            v{version}
          </Text>
        ) : null}
      </ContentWrapper>
    </Flex>
  );
};
