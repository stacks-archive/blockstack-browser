import React from "react";
import { Flex, Text, Box } from "@blockstack/ui";
import { slugify } from "../../common/utils";
import Link from "next/link";
import { useRouter } from "next/router";
import { topNavLinks, components, bottomNavLinks } from "../../common/routes";
import { useMobileMenuState } from "../app-state";

const sections = [
  { links: topNavLinks },
  { title: "Components", links: components },
  { links: bottomNavLinks }
];

const Wrapper = ({ width = "240px", children, ...rest }) => (
  <Box
    position="relative"
    width={width}
    maxWidth={width}
    height="calc(100vh - 50px)"
    flexGrow={0}
    flexShrink={0}
    overflow="auto"
    {...rest}
  >
    <Box
      position="fixed"
      borderRight={["unset", "1px solid", "1px solid"]}
      borderColor={["unset", "ink.100", "ink.100"]}
      top={50}
      width={width}
      height="calc(100vh - 50px)"
      overflow="auto"
    >
      {children}
    </Box>
  </Box>
);

const LinkItem = React.forwardRef(({ isActive, ...rest }, ref) => (
  <Text
    ref={ref}
    _hover={
      !isActive
        ? {
            color: "blue",
            cursor: "pointer"
          }
        : null
    }
    textStyle="body.small"
    fontWeight={isActive ? "semibold" : "normal"}
    as="a"
    {...rest}
  />
));

const Links = ({ links, ...rest }) => {
  const router = useRouter();
  const { handleClose } = useMobileMenuState();

  return links.map((link, linkKey) => {
    const slug = slugify(link);
    const isActive =
      router.pathname.includes(slug) ||
      (router.pathname === "/" && slug === "getting-started");
    return (
      <Box px={4} py={[0, 0, 2]} key={linkKey} onClick={handleClose} {...rest}>
        <Link href={`/${slug}`}>
          <LinkItem isActive={isActive} href={`/${slug}`}>
            {link}
          </LinkItem>
        </Link>
      </Box>
    );
  });
};

const SectionTitle = ({ children, textStyles, ...rest }) => (
  <Box px={4} py={[1, 1, 2]} {...rest}>
    <Text
      textStyle="body.small"
      fontWeight={600}
      color="ink.400"
      {...textStyles}
    >
      {children}
    </Text>
  </Box>
);

/**
 * Section
 *
 * This component maps through an array of objects that could contain these keys:
 * title: title of the section
 * links: array of strings for the various pages to display links for
 */
const Section = ({ section, isLast, ...rest }) => (
  <Box
    borderBottom="1px solid"
    borderColor={isLast ? "transparent" : "ink.100"}
    py={2}
    {...rest}
  >
    {section.title ? <SectionTitle>{section.title}</SectionTitle> : null}
    <Links links={section.links} />
  </Box>
);

const SideNav = ({ ...rest }) => {
  return (
    <Wrapper {...rest}>
      {sections.map((section, sectionKey, arr) => (
        <Section
          key={sectionKey}
          section={section}
          isLast={sectionKey === arr.length - 1}
        />
      ))}
    </Wrapper>
  );
};

export { SideNav };
