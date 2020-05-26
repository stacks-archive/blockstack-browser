import React from 'react';
import { Flex } from '@blockstack/ui';
import { SideNav } from './side-nav';
import { Header } from './header';
import { Main } from './main';
import { Footer } from './footer';
import { useRouter } from 'next/router';
import { WaffleHeader } from './waffle-header';
import { ContentWrapper } from './content-wrapper';
import NotFoundPage from '@pages/404';

const DocsLayout: React.FC = ({ children }) => {
  const router = useRouter();
  let isErrorPage = false;

  // get if NotFoundPage
  React.Children.forEach(children, (child: any) => {
    if (child?.type === NotFoundPage) {
      isErrorPage = true;
    }
  });
  return (
    <>
      <Header />
      <Flex minHeight="100vh">
        <SideNav display={['none', 'none', 'block']} />
        <Main
          maxWidth={['100%', '100%', 'calc(100% - 240px)']}
          width="100%"
          flexGrow={1}
          mt={'50px'}
        >
          {router.pathname === '/getting-started' || router.pathname === '/' ? (
            <WaffleHeader />
          ) : null}
          <ContentWrapper flexGrow={1}>{children}</ContentWrapper>
          <Footer justifySelf="flex-end" />
        </Main>
      </Flex>
    </>
  );
};

export { DocsLayout };
