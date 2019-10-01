import { Box, PseudoBox, Flex, Text } from "@blockstack/ui";
import NextLink from "next/link";
import React, { forwardRef } from "react";
import css from "@styled-system/css";
import CodeBlock from "../code-block";
import LinkIcon from "mdi-react/LinkVariantIcon";
import HashtagIcon from "mdi-react/HashtagIcon";
import { useHover } from "use-events";
import Head from "next/head";
import { slugify } from "../../common/utils";
import { useActiveHeading } from "../app-state";

const Pre = props => (
  <Box
    as="pre"
    css={{
      "> *": {
        whiteSpace: "initial"
      }
    }}
    {...props}
  />
);

const Table = props => (
  <Box as="table" textAlign="left" mt="32px" width="full" {...props} />
);

const THead = props => {
  return (
    <Box
      as="th"
      bg="blue.50"
      p={2}
      textStyle={"body.small.medium"}
      {...props}
    />
  );
};

const TData = props => (
  <Box
    as="td"
    p={2}
    borderTopWidth="1px"
    borderColor="inherit"
    textStyle="body.small"
    whiteSpace="normal"
    {...props}
  />
);

const Link = forwardRef((props, ref) => (
  <PseudoBox
    as="a"
    ref={ref}
    color="blue"
    cursor="pointer"
    textDecoration="underline"
    outline="none"
    _hover={{ color: "blue.hover", textDecor: "none" }}
    _focus={{ boxShadow: "outline" }}
    {...props}
  />
));

const TextItem = props => (
  <Text
    mb="1em"
    mt="2em"
    css={{
      "&[id]": {
        pointerEvents: "none"
      },
      "&[id]:before": {
        display: "block",
        height: " 6rem",
        marginTop: "-6rem",
        visibility: "hidden",
        content: `""`
      },
      "&[id]:hover a": { opacity: 1 }
    }}
    {...props}
  >
    <Box pointerEvents="auto">
      {props.children}
      {props.id && (
        <PseudoBox
          aria-label="anchor"
          as="a"
          color="teal.500"
          fontWeight="normal"
          outline="none"
          _focus={{ opacity: 1, boxShadow: "outline" }}
          opacity="0"
          ml="0.375rem"
          href={`#${props.id}`}
        >
          #
        </PseudoBox>
      )}
    </Box>
  </Text>
);

const Heading = ({ as, children, id, ...rest }) => {
  // children should be a string, so we can get the slug of it to create anchors
  const slug = slugify(children.toString());
  const [isActive, setActiveSlug] = useActiveHeading({ slug });
  const [hovered, bind] = useHover();
  return (
    <>
      <Flex key={slug} align="center" position="relative" {...bind} {...rest}>
        {isActive ? (
          <Box
            position="absolute"
            left="-20px"
            transform="translateY(1px)"
            color="blue.300"
          >
            <HashtagIcon size="1rem" />
          </Box>
        ) : null}
        <Box color={isActive ? "blue" : "ink"}>
          <Text as={as}>{children}</Text>
        </Box>
        <PseudoBox
          aria-label="anchor"
          _hover={{ cursor: "pointer", opacity: 1 }}
          opacity={hovered ? 0.5 : 0}
          px={2}
          color={"ink"}
          as="a"
          href={`#${slug}`}
          onClick={() => setActiveSlug(slug)}
        >
          <LinkIcon size="1rem" />
        </PseudoBox>
        <Box id={slug} transform="translateY(-82px)" />
      </Flex>
    </>
  );
};

const H1Title = ({ children, ...rest }) => (
  <>
    <Heading width="100%" as="h1" {...{ ...rest, children }} />
    <Head>
      <title>{children} - Blockstack UI</title>
    </Head>
  </>
);

const MDXComponents = {
  h1: props => <H1Title {...props} />,
  h2: props => (
    <Heading
      width="100%"
      mt={5}
      pb={2}
      mb={2}
      borderBottom="1px solid"
      borderColor="ink.100"
      as="h2"
      {...props}
    />
  ),
  h3: props => <Heading width="100%" mt={6} as="h3" {...props} />,
  inlineCode: props => (
    <Text
      display="inline-block"
      fontSize={1}
      px="5px"
      bg="blue.50"
      fontWeight="medium"
      fontFamily="mono"
      {...props}
    />
  ),
  code: CodeBlock,
  pre: Pre,
  br: props => <Box height="24px" {...props} />,
  hr: props => <Box as="hr" borderTopWidth="1px" my={8} {...props} />,
  table: Table,
  th: THead,
  td: TData,
  a: ({ href, ...props }) => (
    <NextLink href={href} passHref>
      <Link {...props} />
    </NextLink>
  ),
  p: props => (
    <Text as="p" mt={4} display="block" textStyle="body.large" {...props} />
  ),
  ul: props => <Box as="ul" pt="8px" pl="16px" {...props} />,
  ol: props => <Box as="ol" pt="8px" pl="16px" {...props} />,
  li: props => <Box as="li" pb="4px" {...props} />,
  blockquote: props => (
    <Box
      as="blockquote"
      display="block"
      mt={4}
      border="1px solid"
      borderColor="ink.100"
      borderRadius="6px"
      shadow="mid"
      px={3}
      py={3}
      css={css({
        "> *:first-of-type": {
          marginTop: 0,
          borderLeft: "4px solid",
          borderColor: "blue.100",
          pl: 2
        }
      })}
      {...props}
    />
  )
};

export default MDXComponents;
