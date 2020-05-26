import * as React from 'react';
import { Flex, Box, Stack, FlexProps } from '@blockstack/ui';
import { ContentWrapper } from '@components/content-wrapper';
import { Text, Title, Link } from '@components/typography';
import { color } from '@components/color-modes';
import FileDocumentEditOutlineIcon from 'mdi-react/FileDocumentEditOutlineIcon';
import { border, space } from '@common/utils';

const toPx = (number: number): string => `${number}px`;

const Graphic = (props: FlexProps) => {
  const size = 80;
  const smallerSize = size * 0.8;

  return (
    <Flex
      size={toPx(size)}
      align="center"
      justify="center"
      mx="auto"
      position="relative"
      {...props}
    >
      <Box
        borderRadius={toPx(size)}
        size={toPx(size)}
        position="absolute"
        bg={color('bg-alt')}
        border={border()}
      />
      <Box
        opacity={0.5}
        transform="translateY(-3px) translateX(2px)"
        pt="tight"
        color={color('invert')}
        position="relative"
        zIndex={2}
      >
        <FileDocumentEditOutlineIcon size={toPx(smallerSize)} />
      </Box>
    </Flex>
  );
};

const NotFoundPage = () => {
  return (
    <ContentWrapper align="center" justify="center" flexGrow={1}>
      <Stack spacing={space('loose')} pb={space('100px')}>
        <Box>
          <Graphic mb={space('base')} />
          <Box textAlign="center">
            <Title as="h1">We're still working on this</Title>
          </Box>
        </Box>
        <Box mx="auto" maxWidth="40ch" textAlign="center">
          <Text>
            The docs for the Blockstack UI library are still pretty new, looks like there's nothing
            here yet.
          </Text>
          <Box mt={space('base')}>
            <Link color={color('accent')}>Want to contribute?</Link>
          </Box>
        </Box>
      </Stack>
    </ContentWrapper>
  );
};

export default NotFoundPage;
