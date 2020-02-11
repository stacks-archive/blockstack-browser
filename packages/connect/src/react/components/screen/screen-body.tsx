import React from 'react';

import { Flex, FlexProps } from '@blockstack/ui';
import { Body, Pretitle, Title } from '../typography';

export interface ScreenBodyProps extends FlexProps {
  pretitle?: string | React.ElementType;
  body?: (string | React.ReactNode)[];
  fullWidth?: boolean;
  titleProps?: FlexProps;
}

export const ScreenBody = ({ body, pretitle, fullWidth, ...rest }: Omit<ScreenBodyProps, 'title'>) => {
  return (
    <Flex mx={fullWidth ? 0 : 6} flexDirection="column" {...rest}>
      {pretitle && <Pretitle>{pretitle}</Pretitle>}
      {body && body.length
        ? body.map((child, key) =>
            child && React.isValidElement(child) && child.type === Title ? (
              <React.Fragment key={key}>{child}</React.Fragment>
            ) : (
              <Body key={key}>{child}</Body>
            )
          )
        : body}
    </Flex>
  );
};
