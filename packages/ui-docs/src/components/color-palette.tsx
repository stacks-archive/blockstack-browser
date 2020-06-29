import React from 'react';
import { Box, Flex, useTheme, space, colorGet, theme } from '@blockstack/ui';
import { Text } from '@components/typography';
import { InlineCode } from '@components/mdx';

export const ColorPalette = ({ color, isString = false, name, ...props }: any) => {
  let colorCode = color;
  const [shade, hue] = color.split('.');

  if (shade && hue) {
    colorCode = theme.colors[shade][hue];
  }

  if (typeof theme.colors[color] === 'string') {
    colorCode = theme.colors[color];
  }

  if (!colorCode) return null;

  const getColorCode = (col: string) => {
    if (col.includes('.')) {
      const key = col.split('.')[0];
      const number = col.split('.')[1];
      return theme.colors[key][number];
    }
    return theme.colors[col] && theme.colors[col].toString();
  };

  return (
    <Box {...props}>
      <Flex align="center" justify="center" flexDirection="column" height="128px" bg={colorCode}>
        <Box>
          <InlineCode>{color}</InlineCode>
        </Box>
        <Box>
          <InlineCode>{getColorCode(color)}</InlineCode>
        </Box>
      </Flex>
    </Box>
  );
};

export const ColorPalettes = ({ color }) => {
  const theme = useTheme();
  if (typeof theme.colors[color] === 'string') {
    return <ColorPalette isString color={`${color}`} name={`${color}`} />;
  }
  if (theme.colors[color]) {
    const keys = Object.keys(theme.colors[color]);

    const isString = keys.length > 6;

    return (
      <>
        {isString ? <ColorPalette isString color={`${color}`} name={`1000`} /> : null}
        {keys
          .reverse()
          .map((item, i) =>
            keys.length > 7 ? (
              i < keys.length - 7 && item !== 'hover' ? (
                <ColorPalette
                  color={`${color}.${item}`}
                  name={`${item}`}
                  key={`${color}.${item}`}
                />
              ) : null
            ) : (
              <ColorPalette key={`${color}.${item}`} color={`${color}.${item}`} name={`${item}`} />
            )
          )}
      </>
    );
  }

  return null;
};

export const Colors = ({ colors = ['blue', 'ink', 'feedback', 'darken'], ...rest }: any) => {
  return (
    <Flex width="100%" flexWrap="wrap" mb={space('base')} flexDirection={['row']}>
      {colors.map((color, index) => {
        return (
          <ColorWrapper key={color} isOdd={Math.abs((index + 1) % 2) === 1}>
            <Box textAlign="center" pb={space('tight')}>
              <Text as="h3" fontWeight={600} textTransform="capitalize">
                {color === 'feedback' ? `UI ${color}` : color}
              </Text>
            </Box>
            <ColorPalettes color={color} />
          </ColorWrapper>
        );
      })}
    </Flex>
  );
};

export const ColorWrapper = ({ isOdd, ...rest }: any) => (
  <Box flexShrink={0} mt={space('extra-loose')} width={'50%'} {...rest} />
);
