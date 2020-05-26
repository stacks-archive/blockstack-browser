import React from 'react';
import { Flex, FlexProps } from '@blockstack/ui';
import { space } from '@common/utils';

const ContentWrapper: React.FC<FlexProps> = props => (
  <Flex
    width="100%"
    maxWidth="72ch"
    px={space('base')}
    pt={space(['base', 'base', 'extra-loose'])}
    mt={space('extra-loose')}
    pb={[4, 4, 6]}
    mx="auto"
    flexDirection="column"
    {...props}
  />
);

export { ContentWrapper };
