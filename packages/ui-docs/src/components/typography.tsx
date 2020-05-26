import * as React from 'react';
import { Text as BaseText, BoxProps } from '@blockstack/ui';
import { color } from '@components/color-modes';
import { border } from '@common/utils';

export const Text = React.forwardRef((props: BoxProps, ref) => (
  <BaseText ref={ref} color={color('text-body')} {...props} />
));

export const Caption: React.FC<BoxProps> = props => (
  <Text
    style={{ userSelect: 'none' }}
    color={color('text-caption')}
    fontSize="12px"
    lineHeight="16px"
    display="inline-block"
    fontFamily="body"
    {...props}
  />
);

export const Title: React.FC<BoxProps> = props => (
  <Text display="inline-block" color={color('text-title')} {...props} />
);

export const SectionTitle: React.FC<BoxProps> = props => (
  <Title lineHeight="28px" fontSize="20px" fontWeight="500" {...props} />
);

export const Pre = React.forwardRef((props: BoxProps, ref) => (
  <Text
    fontFamily={`"Fira Code", monospace`}
    bg={color('bg-alt')}
    borderRadius="3px"
    px="extra-tight"
    border={border()}
    fontSize="12px"
    ref={ref}
    {...props}
    style={{
      whiteSpace: 'nowrap',
    }}
  />
));

export type LinkProps = BoxProps & Partial<React.AnchorHTMLAttributes<HTMLAnchorElement>>;

export const Link = React.forwardRef(({ _hover = {}, ...props }: LinkProps, ref) => (
  <Text
    _hover={{
      textDecoration: 'underline',
      cursor: 'pointer',
      ..._hover,
    }}
    ref={ref}
    {...props}
  />
));
