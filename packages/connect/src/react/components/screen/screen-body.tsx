import React from 'react';

import { Stack, BoxProps } from '@blockstack/ui';
import { Title, Body, Pretitle } from '../typography';

export interface ScreenBodyProps extends BoxProps {
  title?: string;
  pretitle?: string | React.ElementType;
  body?: (string | JSX.Element)[];
  fullWidth?: boolean;
}

export const ScreenBody = ({ title, body, pretitle, fullWidth, ...rest }: ScreenBodyProps) => (
  <Stack spacing={2} mx={fullWidth ? 0 : 6} {...rest}>
    {pretitle && <Pretitle>{pretitle}</Pretitle>}
    {title && <Title>{title}</Title>}
    {body && (
      <Stack spacing={[3, 4]}>
        {body && body.length ? body.map((text, key) => <Body key={key}>{text}</Body>) : body}
      </Stack>
    )}
  </Stack>
);
