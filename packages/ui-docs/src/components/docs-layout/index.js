import React from "react";
import { Box, Flex } from "@blockstack/ui";
import { SideNav } from "../side-nav";
import { Header } from "../header";
import { Main } from "../main";
import { Footer } from "../footer";
import { useRouter } from "next/router";
import { WaffleHeader } from "../waffle-header";
import { ContentWrapper } from "../content-wrapper";

const DocsLayout = ({ children }) => {
  const router = useRouter();
  return (
    <>
      <Header />
      <Flex minHeight="100vh">
        <SideNav display={["none", "none", "block"]} />
        <Main width="100%" mt={"50px"}>
          {router.pathname === "/getting-started" || router.pathname === "/" ? (
            <WaffleHeader />
          ) : null}
          <ContentWrapper>{children}</ContentWrapper>
          <Footer justifySelf="flex-end" />
        </Main>
      </Flex>
    </>
  );
};

export { DocsLayout };
