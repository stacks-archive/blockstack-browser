import React from 'react';
import { Text, Box, BoxProps } from '@blockstack/ui';

interface LinkProps extends BoxProps {
  _hover?: BoxProps;
  onClick: () => void;
}

export const buildEnterKeyEvent = (onClick: () => void) => {
  return (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && onClick) {
      onClick();
    }
  };
};

export const Link: React.FC<LinkProps> = ({
  _hover = {},
  children,
  fontSize = '12px',
  textStyle = 'caption.medium',
  onClick,
  ...rest
}) => (
  <Box {...rest} onKeyPress={buildEnterKeyEvent(onClick)} onClick={onClick} tabIndex={0}>
    <Text
      _hover={{ textDecoration: 'underline', cursor: 'pointer', ..._hover }}
      fontSize={fontSize}
      textStyle={textStyle}
    >
      {children}
    </Text>
  </Box>
);

export const MediumLink: React.FC<LinkProps> = ({ children, fontSize = '14px', ...rest }) => (
  <Link fontSize={fontSize} {...rest}>
    {children}
  </Link>
);
