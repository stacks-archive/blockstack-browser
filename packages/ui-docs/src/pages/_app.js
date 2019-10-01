import React from "react";
import { CSSReset, ThemeProvider, theme } from "@blockstack/ui";
import { MDXProvider } from "@mdx-js/react";
import MDXComponents from "@components/mdx-components";
import { DocsLayout } from "@components/docs-layout";
import { AppStateProvider } from "@components/app-state";

const AppWrapper = ({ children }) => (
  <ThemeProvider theme={theme}>
    <MDXProvider components={MDXComponents}>
      <AppStateProvider>
        <DocsLayout>
          <CSSReset />
          {children}
        </DocsLayout>
      </AppStateProvider>
    </MDXProvider>
  </ThemeProvider>
);

export default ({ Component, pageProps }) => {
  return (
    <AppWrapper>
      <Component {...pageProps} />
    </AppWrapper>
  );
};
