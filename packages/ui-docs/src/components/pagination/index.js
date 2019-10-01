import { Box, Flex, PseudoBox, Text } from "@blockstack/ui";
import { useRouter } from "next/router";
import React from "react";
import { routes } from "../../common/routes";
import { slugify } from "../../common/utils";
import Link from "next/link";
import { ContentWrapper } from "../content-wrapper";

const PaginationLink = ({ slug, label, prev }) => (
  <Link href={`/${slug}`} passHref>
    <PseudoBox
      _hover={{
        color: "blue"
      }}
      as="a"
      textAlign="left"
    >
      <Text display="block" textStyle="caption" color="ink.250">
        {prev ? "← Previous" : "Next →"}
      </Text>
      <Text display="block" textStyle="display.large">
        {label}
      </Text>
    </PseudoBox>
  </Link>
);

const Pagination = props => {
  const router = useRouter();
  const routesAsSlugs = routes.map(r => slugify(r));
  const route = router.asPath.replace("/", "");
  const index = routesAsSlugs.indexOf(route);
  const previous = routes[index - 1];
  const previousSlug = routesAsSlugs[index - 1];
  const next = routes[index + 1];
  const nextSlug = routesAsSlugs[index + 1];
  return (
    <ContentWrapper flexGrow={0} pt={0}>
      <Flex
        borderTop="1px solid"
        borderColor="ink.100"
        alignItems="baseline"
        justify="space-between"
      >
        {previous && (
          <PseudoBox pt={5} texAlign="left">
            <PaginationLink slug={previousSlug} label={previous} prev />
          </PseudoBox>
        )}
        {next && (
          <PseudoBox pt={5} textAlign="right">
            <PaginationLink slug={nextSlug} label={next} />
          </PseudoBox>
        )}
      </Flex>
    </ContentWrapper>
  );
};

export { Pagination };
