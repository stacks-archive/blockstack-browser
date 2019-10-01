import { Box, Flex, Text } from "@blockstack/ui";
import React from "react";
import { ContentWrapper } from "../content-wrapper";
import { Pagination } from "../pagination";

const Footer = ({ hidePagination, ...rest }) => {
  return (
    <>
      {!hidePagination && <Pagination />}
      <Flex
        borderTop="1px solid"
        borderColor="inherit"
        textStyle="body.small.medium"
        color="ink.400"
        {...rest}
      >
        <ContentWrapper
          as={Flex}
          justify="space-between"
          display="flex"
          pt={4}
          pb={4}
        >
          <Text>Waffle Design System</Text>
          <Text as="a" href="https://blockstack.org">
            Blockstack PBC
          </Text>
        </ContentWrapper>
      </Flex>
    </>
  );
};

export { Footer };
