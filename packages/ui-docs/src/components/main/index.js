import React from "react";
import { Flex } from "@blockstack/ui";

const Main = props => (
  <Flex flexDirection="column" as="main" mx="auto" flexGrow={1} {...props} />
);

export { Main };
