import React from 'react';

import { Flex, FlexProps } from '@blockstack/ui';
import { Title, Body, Pretitle } from '../typography';

export interface ScreenBodyProps extends FlexProps {
  title?: string;
  pretitle?: string | React.ElementType;
  body?: (string | JSX.Element)[];
  fullWidth?: boolean;
}

export const ScreenBody = ({ title, body, pretitle, fullWidth, ...rest }: ScreenBodyProps) => {
  return (
    <Flex mx={fullWidth ? 0 : 6} flexDirection="column" {...rest}>
      {pretitle && <Pretitle>{pretitle}</Pretitle>}
      {title && <Title>{title}</Title>}
      {body && body.length ? body.map((text, key) => <Body key={key}>{text}</Body>) : body}
    </Flex>
  );
};
