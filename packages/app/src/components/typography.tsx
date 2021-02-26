import { BoxProps, color, Text as BaseText } from '@stacks/ui';
import React from 'react';
import { forwardRefWithAs } from '@stacks/ui-core';

export const Body: React.FC = props => <Text fontSize="14px" lineHeight="20px" {...props} />;

export const Title = forwardRefWithAs<BoxProps, 'span'>((props, ref) => (
  <BaseText
    userSelect="none"
    fontFeatureSettings={`'ss01' on`}
    letterSpacing="-0.01em"
    fontSize="32px"
    lineHeight="42px"
    fontWeight="500"
    fontFamily="'Open Sauce'"
    color={color('text-title')}
    ref={ref}
    display="block"
    {...props}
  />
));

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

export const Text = forwardRefWithAs<BoxProps, 'span'>((props, ref) => (
  <BaseText
    fontFeatureSettings={`'ss01' on`}
    letterSpacing="-0.01em"
    color={color('text-body')}
    display="block"
    ref={ref}
    {...props}
  />
));

export const Caption = forwardRefWithAs<BoxProps, 'span'>((props, ref) => (
  <BaseText
    fontFeatureSettings={`'ss01' on`}
    letterSpacing="-0.01em"
    fontSize={1}
    color={color('text-caption')}
    display="block"
    ref={ref}
    {...props}
  />
));
