import React from 'react';
import { Box, Text, Flex, useTheme } from '@blockstack/ui';
import { themeGet } from '@styled-system/theme-get';

const types = [
  { style: 'Display Large' },
  { style: 'Display Small' },
  { style: 'Body Large Medium' },
  { style: 'Body Large' },
  { style: 'Body Small Medium' },
  { style: 'Body Small' },
  { style: 'Caption Medium' },
  { style: 'Caption' },
];

const transformTextStyle = (value: string) =>
  value.replace(' ', '.').replace(' ', '.').toLowerCase();

const Cell = ({ ...rest }: any) => (
  <Box width={1 / 5}>
    <Text textStyle="body.small" fontWeight="bold" {...rest} />
  </Box>
);

const Header = ({ ...rest }: any) => (
  <Flex pb={4} alignItems="baseline" borderBottom="1px solid" borderColor="var(--colors-border)">
    <Box width={1 / 3}>
      <Text textStyle="body.small" fontWeight="bold">
        Style
      </Text>
    </Box>
    <Flex width={2 / 3}>
      <Cell>Typeface</Cell>
      <Cell>Weight</Cell>
      <Cell>Size</Cell>
      <Cell>Line</Cell>
      <Cell>Letter Spacing</Cell>
    </Flex>
  </Flex>
);

const TextDisplay = ({ ...rest }: any) => {
  const theTheme = useTheme();
  return (
    <Box pt={5}>
      <Header />
      {types.map((typeStyle, key) => {
        const { fontSize, fontWeight, lineHeight, letterSpacing } = themeGet(
          `textStyles.${transformTextStyle(typeStyle.style)}`
        )({
          theme: theTheme,
        });
        return (
          <Flex
            borderBottom="1px solid"
            borderColor="var(--colors-border)"
            alignItems="center"
            py={5}
            key={key}
          >
            <Box width={1 / 3}>
              <Box>
                <Text textStyle={transformTextStyle(typeStyle.style)}>{typeStyle.style}</Text>
              </Box>
              <Box pt={1}>
                <Text as="pre" color="ink.600" fontSize={0}>
                  {transformTextStyle(typeStyle.style)}
                </Text>
              </Box>
            </Box>
            <Flex alignItems="baseline" width={2 / 3}>
              <Cell fontWeight="normal">Inter</Cell>
              <Cell fontWeight="normal">{fontWeight && fontWeight.toString()}</Cell>
              <Cell fontWeight="normal">{fontSize.toString()}px</Cell>
              <Cell fontWeight="normal">{lineHeight && lineHeight.toString()}</Cell>{' '}
              <Cell fontWeight="normal">{letterSpacing && letterSpacing.toString()}</Cell>
            </Flex>
          </Flex>
        );
      })}
    </Box>
  );
};

export { TextDisplay };
