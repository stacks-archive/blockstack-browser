import React from 'react';
import { Flex, FlexProps, space } from '@blockstack/ui';

const ContentWrapper: React.FC<FlexProps> = props => (
  <Flex
    flexShrink={1}
    px={space('base')}
    pt={space(['base', 'base', 'extra-loose'])}
    mt={space('extra-loose')}
    pb={[4, 4, 6]}
    flexDirection="column"
    {...props}
  />
);

export { ContentWrapper };
