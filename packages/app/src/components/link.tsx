import React from 'react';
import { BoxProps } from '@blockstack/ui';
import { Link as ConnectLink } from '@blockstack/connect';

interface LinkProps extends BoxProps {
  _hover?: BoxProps;
  onClick: () => void;
}

export const Link: React.FC<LinkProps> = ({ children, fontSize = '14px', ...rest }) => (
  <ConnectLink fontSize={fontSize} {...rest}>
    {children}
  </ConnectLink>
);
