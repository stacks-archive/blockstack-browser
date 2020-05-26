import { Box, Flex, FlexProps, BoxProps } from '@blockstack/ui';
import NextLink from 'next/link';
import React, { forwardRef, Ref } from 'react';
import css from '@styled-system/css';
import CodeBlock from './code-block';
import LinkIcon from 'mdi-react/LinkVariantIcon';
import HashtagIcon from 'mdi-react/HashtagIcon';
import { useHover } from 'use-events';
import Head from 'next/head';
import { slugify } from '@common/utils';
import { useActiveHeading } from '@common/hooks/use-active-heading';
import { Text, Title, Pre } from '@components/typography';

const SmartLink = ({ href, ...rest }: { href: string }) => {
  const isExternal = href.includes('http');
  const link = <Link href={href} {...rest} />;

  return isExternal ? (
    link
  ) : (
    <NextLink href={href} passHref>
      {link}
    </NextLink>
  );
};

const Table = (props: any) => (
  <Box
    color="var(--colors-text-body)"
    border="1px solic var(--colors-border)"
    as="table"
    textAlign="left"
    mt="32px"
    width="100%"
    {...props}
  />
);

const THead = (props: any) => {
  return (
    <Box
      as="th"
      color="var(--colors-text-caption)"
      bg="blue.50"
      p={2}
      textStyle={'body.small.medium'}
      {...props}
    />
  );
};

const TData = (props: any) => (
  <Box
    as="td"
    p={2}
    borderTopWidth="1px"
    borderColor="var(--colors-border)"
    textStyle="body.small"
    whiteSpace="normal"
    {...props}
  />
);

export const Link = forwardRef((props: { href: string } & BoxProps, ref: Ref<HTMLDivElement>) => (
  <Box
    as="a"
    ref={ref}
    color="var(--colors-accent)"
    cursor="pointer"
    textDecoration="underline"
    _hover={{ textDecoration: 'none' }}
    _focus={{ boxShadow: 'outline' }}
    {...props}
  />
));

const TextItem = (props: any) => (
  <Text
    mb="1em"
    mt="2em"
    css={{
      '&[id]': {
        pointerEvents: 'none',
      },
      '&[id]:before': {
        display: 'block',
        height: ' 6rem',
        marginTop: '-6rem',
        visibility: 'hidden',
        content: `""`,
      },
      '&[id]:hover a': { opacity: 1 },
    }}
    {...props}
  >
    <Box
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      pointerEvents="auto"
    >
      {props.children}
      {props.id && (
        <Box
          aria-label="anchor"
          as="a"
          color="teal.500"
          fontWeight="normal"
          _focus={{ opacity: 1, boxShadow: 'outline' }}
          opacity={0}
          ml="0.375rem"
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          href={`#${props.id}`}
        >
          #
        </Box>
      )}
    </Box>
  </Text>
);

const Heading = ({ as, children, id, ...rest }: FlexProps) => {
  // children should be a string, so we can get the slug of it to create anchors
  const slug = slugify(children?.toString());
  const [isActive, setActiveSlug] = useActiveHeading({ slug });
  const [hovered, bind] = useHover();
  return (
    <>
      <Flex key={slug} align="center" position="relative" {...bind} {...rest}>
        {isActive ? (
          <Box position="absolute" left="-20px" transform="translateY(1px)" color="blue.300">
            <HashtagIcon size="1rem" />
          </Box>
        ) : null}
        <Box color={isActive ? 'blue' : 'ink'}>
          <Title as={as}>{children}</Title>
        </Box>
        <Link
          aria-label="anchor"
          _hover={{ cursor: 'pointer', opacity: 1 }}
          opacity={hovered ? 0.5 : 0}
          px={2}
          color="var(--colors-invert)"
          as="a"
          href={`#${slug}`}
          onClick={() => setActiveSlug(slug)}
        >
          <LinkIcon size="1rem" />
        </Link>
        <Box id={slug} transform="translateY(-82px)" />
      </Flex>
    </>
  );
};

const H1Title = ({ children, ...rest }: any) => (
  <>
    <Heading width="100%" as="h1" {...{ ...rest, children }} />
    <Head>
      <title>{children} - Blockstack UI</title>
    </Head>
  </>
);

const MDXComponents = {
  h1: (props: any) => <H1Title {...props} />,
  h2: (props: any) => <Heading width="100%" mt="extra-loose" as="h2" {...props} />,
  h3: (props: any) => <Heading width="100%" mt="extra-loose" as="h3" {...props} />,
  inlineCode: Pre,
  code: CodeBlock,
  pre: (props: any) => <Box as="pre" {...props} />,
  br: (props: any) => <Box height="24px" {...props} />,
  hr: (props: any) => (
    <Box
      as="hr"
      borderTopWidth="1px"
      borderColor="var(--colors-border)"
      my="extra-loose"
      c
      {...props}
    />
  ),
  table: Table,
  th: THead,
  td: TData,
  a: (props: any) => <SmartLink {...props} />,
  p: (props: any) => <Text as="p" mt="tight" display="block" lineHeight="24px" {...props} />,
  ul: (props: any) => <Text as="ul" pt="base" pl="base" {...props} />,
  ol: (props: any) => <Text as="ol" pt="base" pl="base" {...props} />,
  li: (props: any) => <Box as="li" color="currentColor" pb="base" {...props} />,
  blockquote: (props: any) => (
    <Box
      as="blockquote"
      display="block"
      my="base-loose"
      border="1px solid"
      borderColor="var(--colors-border)"
      borderRadius="6px"
      bg="var(--colors-bg-light)"
      px={3}
      py={3}
    >
      <Box
        css={css({
          '> *:first-of-type': {
            marginTop: 0,
            borderLeft: '4px solid',
            borderColor: 'var(--colors-accent)',
            pl: 2,
          },
        })}
        {...props}
      />
    </Box>
  ),
};

export { MDXComponents };
