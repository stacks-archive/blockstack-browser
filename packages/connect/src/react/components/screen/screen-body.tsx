import React from 'react';

import { Flex, FlexProps } from '@blockstack/ui';
import { Body, Pretitle } from '../typography';

export interface ScreenBodyProps extends FlexProps {
  pretitle?: string | React.ElementType;
  body?: (string | JSX.Element)[];
  fullWidth?: boolean;
  titleProps?: FlexProps;
}

export const ScreenBody = ({ body, pretitle, fullWidth, ...rest }: Omit<ScreenBodyProps, 'title'>) => {
  return (
    <Flex mx={fullWidth ? 0 : 6} flexDirection="column" {...rest}>
      {pretitle && <Pretitle>{pretitle}</Pretitle>}
      {body && body.length ? body.map((text, key) => <Body key={key}>{text}</Body>) : body}
    </Flex>
  );
};
