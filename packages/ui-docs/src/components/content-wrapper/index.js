import React from "react";
import { Box } from "@blockstack/ui";
const ContentWrapper = props => (
  <Box
    width="100%"
    maxWidth="52rem"
    pl={[6]}
    pr={[6]}
    flexGrow={1}
    pt={[4, 4, 6]}
    pb={[4, 4, 6]}
    mx="auto"
    {...props}
  />
);

export { ContentWrapper };
