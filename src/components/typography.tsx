import { BoxProps, color, Text as BaseText } from '@stacks/ui';
import React from 'react';
import { forwardRefWithAs } from '@stacks/ui-core';
import capsize from 'capsize';

const interMetrics = {
  capHeight: 2048,
  ascent: 2728,
  descent: -680,
  lineGap: 0,
  unitsPerEm: 2816,
};
const openSauceMetrics = {
  capHeight: 1563,
  ascent: 2105,
  descent: -525,
  lineGap: 0,
  unitsPerEm: 2048,
};

const h1 = capsize({
  fontMetrics: openSauceMetrics,
  fontSize: 24,
  leading: 32,
});

// B2
const h2 = capsize({
  fontMetrics: openSauceMetrics,
  fontSize: 18,
  leading: 28,
});
// B3
const h3 = capsize({
  fontMetrics: openSauceMetrics,
  fontSize: 16,
  leading: 24,
});
// C1
const h4 = capsize({
  fontMetrics: openSauceMetrics,
  fontSize: 14,
  leading: 20,
});
// C2
const h5 = capsize({
  fontMetrics: openSauceMetrics,
  fontSize: 12,
  leading: 16,
});

const c1 = capsize({
  fontMetrics: interMetrics,
  fontSize: 14,
  leading: 20,
});
const c2 = capsize({
  fontMetrics: interMetrics,
  fontSize: 12,
  leading: 16,
});

const captionStyles = (variant?: 'c1' | 'c2') => {
  switch (variant) {
    case 'c2':
      return c2;
    default:
      return c1;
  }
};

type Headings = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span';

export const titleStyles = (as: Headings) => {
  switch (as) {
    case 'h1':
      return h1;
    case 'h2':
      return h2;
    case 'h3':
      return h3;
    case 'h4':
      return h4;
    case 'h5':
    case 'h6':
      return h5;
    default:
      return undefined;
  }
};

export const Title = forwardRefWithAs<BoxProps, Headings>((props, ref) => (
  <BaseText
    userSelect="none"
    fontFeatureSettings={`'ss01' on`}
    letterSpacing="-0.01em"
    fontFamily="'Open Sauce One'"
    color={color('text-title')}
    ref={ref}
    display="block"
    css={titleStyles(props.as)}
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
    lineHeight="1.5"
    ref={ref}
    {...props}
  />
));

export const Body: React.FC<BoxProps> = props => <Text css={c1} {...props} />;

export const Caption = forwardRefWithAs<{ variant?: 'c1' | 'c2' } & BoxProps, 'span'>(
  ({ variant, ...props }, ref) => (
    <BaseText
      fontFeatureSettings={`'ss01' on`}
      letterSpacing="-0.01em"
      css={captionStyles(variant)}
      color={color('text-caption')}
      display="block"
      ref={ref}
      {...props}
    />
  )
);
