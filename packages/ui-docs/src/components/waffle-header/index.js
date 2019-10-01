import React from "react";
import { Text, Flex } from "@blockstack/ui";
import { ContentWrapper } from "../content-wrapper";

const WaffleHeader = () => (
  <Flex
    align="center"
    justify="center"
    minHeight={["unset", "unset", "300px"]}
    bg="ink"
  >
    <ContentWrapper>
      <Text as="h1" display="block" fontSize={[5, 5, 7]} color="white">
        Waffle
        <Text
          transform="translateY(5px)"
          opacity={0.5}
          display="inline-block"
          as="sup"
        >
          &trade;
        </Text>{" "}
        Components
      </Text>
      <Text pt={1} display="block" as="h2" fontSize={[3, 3, 4]} color="ink.100">
        The Blockstack design system, built with React and styled-system.
      </Text>
      <Text display="block" pt={2} fontFamily="mono" color="blue.300">
        v1.0.0-alpha.0
      </Text>
      {/*  TODO: abstract out and pull from github */}
    </ContentWrapper>
  </Flex>
);

export { WaffleHeader };
