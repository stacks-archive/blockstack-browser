import React from 'react';
import { Box } from '@blockstack/ui';
import { slugify } from '@common/utils';
import { Text, Caption } from '@components/typography';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { topNavLinks, components, hooks, bottomNavLinks } from '@common/routes';
import { useMobileMenuState } from '@common/hooks/use-mobile-menu';

const sections = [
  { links: topNavLinks },
  { title: 'Components', prefix: 'components/', links: components },
  { title: 'Hooks', prefix: 'hooks/', links: hooks },
  { links: bottomNavLinks },
];

const Wrapper = ({ width = '240px', children, ...rest }: any) => (
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
      borderRight={['unset', '1px solid', '1px solid']}
      borderColor={['unset', 'var(--colors-border)', 'var(--colors-border)']}
      top={50}
      width={width}
      height="calc(100vh - 50px)"
      overflow="auto"
    >
      {children}
    </Box>
  </Box>
);

const LinkItem = React.forwardRef(({ isActive, ...rest }: any, ref) => (
  <Text
    ref={ref}
    _hover={
      !isActive
        ? {
            color: 'var(--colors-accent)',
            cursor: 'pointer',
            textDecoration: 'underline',
          }
        : null
    }
    textStyle="body.small"
    color={isActive ? 'var(--colors-text-title)' : 'var(--colors-text-body)'}
    fontWeight={isActive ? 'semibold' : 'normal'}
    as="a"
    {...rest}
  />
));

const Links = ({ links, prefix = '', ...rest }: any) => {
  const router = useRouter();
  const { handleClose } = useMobileMenuState();

  return links.map((link, linkKey) => {
    const slug = slugify(link);
    const isActive =
      router.pathname.includes(slug) || (router.pathname === '/' && slug === 'getting-started');
    return (
      <Box px="base" py="extra-tight" key={linkKey} onClick={handleClose} {...rest}>
        <Link href={`/${prefix + slug}`}>
          <LinkItem isActive={isActive} href={`/${prefix + slug}`}>
            {link}
          </LinkItem>
        </Link>
      </Box>
    );
  });
};

const SectionTitle = ({ children, textStyles, ...rest }: any) => (
  <Box px={4} pb="tight" {...rest}>
    <Caption
      fontWeight="600"
      fontSize="10px"
      letterSpacing="1px"
      textTransform="uppercase"
      {...textStyles}
    >
      {children}
    </Caption>
  </Box>
);

const Section = ({ section, isLast, ...rest }: any) => (
  <Box
    borderBottom="1px solid"
    borderColor={isLast ? 'transparent' : 'var(--colors-border)'}
    py="base"
    {...rest}
  >
    {section.title ? <SectionTitle>{section.title}</SectionTitle> : null}
    <Links prefix={section.prefix} links={section.links} />
  </Box>
);

const SideNav = ({ ...rest }: any) => {
  return (
    <Wrapper {...rest}>
      {sections.map((section, sectionKey, arr) => (
        <Section key={sectionKey} section={section} isLast={sectionKey === arr.length - 1} />
      ))}
    </Wrapper>
  );
};

export { SideNav };
