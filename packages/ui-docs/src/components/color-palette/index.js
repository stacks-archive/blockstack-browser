import React from "react";
import { Box, Flex, Grid, Text, useTheme } from "@blockstack/ui";

export const ColorPalette = ({ color, isString, name, ...props }) => {
  const theme = useTheme();
  let colorCode = color;
  const [shade, hue] = color.split(".");

  if (shade && hue) {
    colorCode = theme.colors[shade][hue];
  }

  if (typeof theme.colors[color] === "string") {
    colorCode = theme.colors[color];
  }

  if (!colorCode) return null;

  return (
    <Flex
      flexWrap={["wrap", "no-wrap", "no-wrap"]}
      mt={5}
      align="center"
      justify="center"
      flexDir="column"
      {...props}
    >
      <Box
        flexShrink={0}
        borderRadius="100%"
        size={["32px", "32px", "64px"]}
        bg={color}
        mb={3}
      />
      <Flex
        flexDirection="column"
        justify="center"
        align="center"
        textAlign="center"
      >
        <Box>
          <Text textStyle="body.large.medium" textTransform="capitalize">
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
  if (typeof theme.colors[color] === "string") {
    return <ColorPalette isString color={`${color}`} name={`${color}`} />;
  }
  if (theme.colors[color]) {
    const keys = Object.keys(theme.colors[color]);

    const isString = keys.length > 6;

    return (
      <>
        {isString ? (
          <ColorPalette isString color={`${color}`} name={`1000`} />
        ) : null}
        {keys
          .reverse()
          .map((item, i) =>
            keys.length > 7 ? (
              i < keys.length - 7 && item !== "hover" ? (
                <ColorPalette
                  color={`${color}.${item}`}
                  name={`${item}`}
                  key={`${color}.${item}`}
                />
              ) : null
            ) : (
              <ColorPalette
                key={`${color}.${item}`}
                color={`${color}.${item}`}
                name={`${item}`}
              />
            )
          )}
      </>
    );
  }

  return null;
};

export const Colors = ({
  colors = ["blue", "ink", "feedback", "darken"],
  ...rest
}) => {
  return (
    <Flex width="100%" flexWrap="wrap" flexDirection={["row"]}>
      {colors.map((color, index) => {
        return (
          <ColorWrapper key={color} isOdd={Math.abs((index + 1) % 2) === 1}>
            <Box
              textAlign="center"
              pb={2}
              borderBottom="1px solid"
              borderColor="inherit"
            >
              <Text as="h3" textTransform="capitalize">
                {color === "feedback" ? `UI ${color}` : color}
              </Text>
            </Box>
            <ColorPalettes color={color} />
          </ColorWrapper>
        );
      })}
    </Flex>
  );
};

export const ColorWrapper = ({ isOdd, ...rest }) => (
  <Box
    flexShrink={0}
    mt={8}
    pr={[isOdd ? 8 : 0, 4, 8]}
    width={["50%", "25%", "25%"]}
    {...rest}
  />
);
