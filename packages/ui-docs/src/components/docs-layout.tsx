import React from 'react';
import { Flex, color, space } from '@blockstack/ui';
import { SideNav } from './side-nav';
import { Header } from './header';
import { Main } from './main';
import { Footer } from './footer';
import { useRouter } from 'next/router';
import { GettingStartedHeader } from './getting-started-header';
import { ContentWrapper } from './content-wrapper';
import NotFoundPage from '@pages/404';
import { createGlobalStyle } from 'styled-components';
import { TableOfContents } from '@components/toc';

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
              <GettingStartedHeader />
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
                  h2: {},
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
                  pre: {
                    '& + h2': {
                      mt: space('base'),
                    },
                    '& + h3': {
                      mt: space('base-tight'),
                    },
                  },
                  'h1, h2, h3, h4, h5, h6': {
                    '& + pre': {
                      mt: '0',
                    },
                    '& + ul, & + ol': {
                      mt: '0',
                    },
                    '& + blockquote': {
                      mt: '0',
                    },
                  },
                  blockquote: {
                    '& + pre': {
                      mt: '0',
                    },
                    '& + h2': {
                      mt: '0',
                    },
                  },
                  '& > pre > *:not(pre)': {
                    border: 'none',
                    px: space(['extra-loose', 'extra-loose', 'none', 'none']),
                  },
                  '& > pre > div[style]': {
                    px: space(['base-loose', 'base-loose', 'none', 'none']),
                  },
                  '& > pre > .code-editor': {
                    pl: space(['base', 'base', 'none', 'none']),
                  },
                  '& > pre': {
                    px: space(['none', 'none', 'extra-loose', 'extra-loose']),
                    border: 'none',
                    boxShadow: 'none',
                    my: space('extra-loose'),
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
