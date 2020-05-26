import React from 'react';
import { Box, Flex, useTheme } from '@blockstack/ui';
import { Text } from '@components/typography';
import { space } from '@common/utils';

export const ColorPalette = ({ color, isString = false, name, ...props }: any) => {
  const theme = useTheme();
  let colorCode = color;
  const [shade, hue] = color.split('.');

  if (shade && hue) {
    colorCode = theme.colors[shade][hue];
  }

  if (typeof theme.colors[color] === 'string') {
    colorCode = theme.colors[color];
  }

  if (!colorCode) return null;

  return (
    <Flex
      flexWrap={['wrap', 'nowrap', 'nowrap']}
      p={space('base')}
      align="center"
      justify="center"
      flexDir="column"
      bg="white"
      borderRadius="12px"
      mb={space('base-loose')}
      boxShadow="mid"
      _hover={{
        boxShadow: 'high',
        cusor: 'pointer',
      }}
      {...props}
    >
      <Box
        boxShadow="mid"
        flexShrink={0}
        borderRadius="100%"
        size={['32px', '32px', '64px']}
        bg={color}
        mb={space('tight')}
      />

      <Flex flexDirection="column" justify="center" align="center" textAlign="center">
        <Box>
          <Text color="ink" fontWeight={600} textTransform="capitalize">
            {name}
          </Text>
        </Box>
        <Box>
          <Text textTransform="uppercase" textStyle="caption" color="#767A85">
            {isString ? theme.colors[color] : colorCode}
          </Text>
        </Box>
      </Flex>
    </Flex>
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
    <Flex width="100%" flexWrap="wrap" flexDirection={['row']}>
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
  <Box
    flexShrink={0}
    mt={space('extra-loose')}
    pr={[isOdd ? space('extra-loose') : 0, space('base'), space('extra-loose')]}
    width={['50%', '25%', '25%']}
    minWidth="150px"
    {...rest}
  />
);
