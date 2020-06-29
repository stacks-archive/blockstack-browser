import React from 'react';
import { Box, space, BoxProps, color } from '@blockstack/ui';
import css from '@styled-system/css';
import dynamic from 'next/dynamic';
import {
  Heading,
  Pre,
  THead,
  SmartLink,
  TData,
  Table,
  InlineCode,
} from '@components/mdx/components';
import { Text } from '@components/typography';
import { border } from '@common/utils';

const CodeBlock = dynamic(() => import('../code-block'));

const BaseHeading: React.FC<BoxProps> = React.memo(props => (
  <Heading width="100%" mt={space('base-loose')} {...props} />
));

const H1: React.FC<BoxProps> = props => <BaseHeading as="h1" mb={space('base-tight')} {...props} />;
const H2: React.FC<BoxProps> = props => (
  <BaseHeading as="h2" mt={space('extra-loose')} mb={space('base')} {...props} />
);
const H3: React.FC<BoxProps> = props => <BaseHeading as="h3" mb={space('base')} {...props} />;
const H4: React.FC<BoxProps> = props => <BaseHeading as="h4" {...props} />;
const H5: React.FC<BoxProps> = props => <BaseHeading as="h5" {...props} />;
const H6: React.FC<BoxProps> = props => <BaseHeading as="h6" {...props} />;

const Br: React.FC<BoxProps> = props => <Box height="24px" {...props} />;
const Hr: React.FC<BoxProps> = props => (
  <Box
    as="hr"
    borderTopWidth="1px"
    borderColor={color('border')}
    my={space('extra-loose')}
    mx={space('extra-loose')}
    {...props}
  />
);

const P: React.FC<BoxProps> = props => <Text display="block" as="p" {...props} />;
const Ol: React.FC<BoxProps> = props => (
  <Box pl={space('base')} mt={space('base')} mb={space('base-tight')} as="ol" {...props} />
);
const Ul: React.FC<BoxProps> = props => (
  <Box pl={space('base-loose')} mt={space('base')} mb={space('base-tight')} as="ul" {...props} />
);
const Li: React.FC<BoxProps> = props => <Box as="li" pb={space('tight')} {...props} />;
const BlockQuote: React.FC<BoxProps> = ({ children, ...rest }) => (
  <Box as="blockquote" display="block" my={space('extra-loose')} {...rest}>
    <Box
      border="1px solid"
      css={css({
        border: border(),
        borderRadius: 'md',
        boxShadow: 'mid',
        py: space('base-tight'),
        px: space('base'),
        bg: color('bg-light'),
        '> *:first-of-type': {
          marginTop: 0,
          borderLeft: '4px solid',
          borderColor: color('accent'),
          pl: space('base'),
        },
      })}
    >
      {children}
    </Box>
  </Box>
);

export const MDXComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  inlineCode: InlineCode,
  code: CodeBlock,
  pre: Pre,
  br: Br,
  hr: Hr,
  table: Table,
  th: THead,
  td: TData,
  a: SmartLink,
  p: P,
  ul: Ul,
  ol: Ol,
  li: Li,
  blockquote: BlockQuote,
};
