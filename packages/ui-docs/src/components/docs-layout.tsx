import React from 'react';
import { Flex, Box, color, space } from '@blockstack/ui';
import { SideNav } from './side-nav';
import { Header } from './header';
import { Main } from './main';
import { Footer } from './footer';
import { useRouter } from 'next/router';
import { WaffleHeader } from './waffle-header';
import { ContentWrapper } from './content-wrapper';
import NotFoundPage from '@pages/404';
import { createGlobalStyle } from 'styled-components';
import { slugify } from '@common/utils';
import { Text } from '@components/typography';
import { Link } from '@components/mdx';
import { useActiveHeading } from '@common/hooks/use-active-heading';
import { css } from '@styled-system/css';
export const MdxOverrides = createGlobalStyle`

html {
scroll-behavior: smooth;
}
pre{
display: inline-block;
}
p, ul, ol, table {
  color: ${color('text-body')};
  
  a > pre {
    color: ${color('accent')} !important;
  }
}
`;

const Item = ({ slug, label }) => {
  const [isActive, setActiveSlug] = useActiveHeading(slug);

  return (
    <Box py={space('extra-tight')}>
      <Link
        href={`#${slug}`}
        fontSize="14px"
        color={isActive ? color('text-title') : color('text-caption')}
        fontWeight={isActive ? '600' : '400'}
        onClick={() => setActiveSlug(slug)}
        textDecoration="none"
        _hover={{
          textDecoration: 'underline',
          color: color('accent'),
        }}
        pointerEvents={isActive ? 'none' : 'unset'}
      >
        {label}
      </Link>
    </Box>
  );
};

const TableOfContents = ({ headings }: { headings?: string[] }) => {
  return (
    <Box position="relative">
      <Box
        mt="50px"
        flexShrink={0}
        display={['none', 'none', 'block', 'block']}
        minWidth={['100%', '200px', '200px']}
        position="sticky"
        top="118px"
      >
        <Box mb={space('extra-tight')}>
          <Text fontWeight="bold" fontSize="14px">
            On this page
          </Text>
        </Box>
        {headings.map((heading, index) => {
          return index > 0 ? <Item slug={slugify(heading)} label={heading} key={index} /> : null;
        })}
      </Box>
    </Box>
  );
};

const DocsLayout: React.FC<{ headings?: string[] }> = ({ children, headings }) => {
  const router = useRouter();
  let isErrorPage = false;

  // get if NotFoundPage
  React.Children.forEach(children, (child: any) => {
    if (child?.type === NotFoundPage) {
      isErrorPage = true;
    }
  });
  return (
    <Flex minHeight="100vh" flexDirection="column">
      <Header />
      <Flex width="100%" flexGrow={1}>
        <SideNav display={['none', 'none', 'block']} />
        <Flex
          flexGrow={1}
          maxWidth={['100%', '100%', 'calc(100% - 200px)', 'calc(100% - 200px)']}
          mt={'50px'}
          flexDirection="column"
        >
          <Main mx="unset" width={'100%'}>
            {router.pathname === '/getting-started' || router.pathname === '/' ? (
              <WaffleHeader />
            ) : null}
            <Flex
              flexDirection={['column', 'column', 'row', 'row']}
              maxWidth="98ch"
              mx="auto"
              flexGrow={1}
            >
              <ContentWrapper
                width={
                  headings?.length
                    ? ['100%', '100%', 'calc(100% - 200px)', 'calc(100% - 200px)']
                    : '100%'
                }
                mx="unset"
                px="unset"
                pt="unset"
                css={css({
                  '& > *:not(pre):not(ul):not(ol)': {
                    px: space('extra-loose'),
                  },
                  '& > ul, & > ol': {
                    pr: space('extra-loose'),
                    pl: '64px ',
                  },
                  '& > *:not(pre) a > code': {
                    color: color('accent'),
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  },
                  '& > pre > *:not(pre)': {
                    border: 'none',
                    px: space(['extra-loose', 'extra-loose', 'none', 'none']),
                  },
                  '& > pre': {
                    px: space(['none', 'none', 'extra-loose', 'extra-loose']),
                    border: 'none',
                    boxShadow: 'none',
                  },
                })}
              >
                {children}
              </ContentWrapper>
              {headings?.length && headings.length > 1 ? (
                <TableOfContents headings={headings} />
              ) : null}
            </Flex>
          </Main>
          <Footer justifySelf="flex-end" />
        </Flex>
      </Flex>
    </Flex>
  );
};

export { DocsLayout };
