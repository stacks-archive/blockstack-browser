import React from 'react';
import App, { AppContext } from 'next/app';
import { CSSReset, ThemeProvider, theme } from '@blockstack/ui';
import { MDXProvider } from '@mdx-js/react';
import { MDXComponents } from '@components/mdx-components';
import { DocsLayout } from '@components/docs-layout';
import { AppStateProvider } from '@components/app-state';
import { ColorModeProvider } from '@components/color-modes';

const AppWrapper = ({ children, version }: any) => (
  <ThemeProvider theme={theme}>
    <ColorModeProvider>
      <MDXProvider components={MDXComponents}>
        <AppStateProvider version={version}>
          <DocsLayout>
            <CSSReset />
            {children}
          </DocsLayout>
        </AppStateProvider>
      </MDXProvider>
    </ColorModeProvider>
  </ThemeProvider>
);

const MyApp = ({ Component, pageProps, ...rest }: any) => {
  const [version, setVersion] = React.useState(pageProps?.version);
  if (!version && pageProps?.version) {
    setVersion(pageProps?.version);
  }
  return (
    <AppWrapper version={version}>
      <Component {...pageProps} />
    </AppWrapper>
  );
};

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  if (appContext.ctx.res) {
    try {
      const res = await fetch('https://registry.npmjs.org/@blockstack/ui');
      const data = await res.json();
      const version = data['dist-tags'].latest;
      return {
        ...appProps,
        pageProps: {
          ...appProps.pageProps,
          version,
        },
      };
    } catch (e) {
      console.log(e);
    }
  }

  return appProps;
};

export default MyApp;
