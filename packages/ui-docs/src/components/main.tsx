import React from 'react';
import { Flex } from '@blockstack/ui';

const Main = (props: any) => (
  <Flex flexDirection="column" as="main" mx="auto" flexGrow={1} {...props} />
);

export { Main };
