import React from 'react';
import { Text, BoxProps } from '@stacks/ui';

export const Title = (props: BoxProps) => (
  <Text
    width="100%"
    fontWeight="medium"
    fontSize="24px"
    lineHeight="32px"
    display="inline-block"
    {...props}
  />
);

export const Pretitle = (props: BoxProps) => (
  <Text
    pt="loose"
    width="100%"
    fontWeight="medium"
    fontSize={['11px']}
    lineHeight={['20px']}
    color="ink.600"
    style={{
      textTransform: 'uppercase',
    }}
    {...props}
  />
);

export const Body: React.FC = props => <Text fontSize="14px" lineHeight="20px" {...props} />;
