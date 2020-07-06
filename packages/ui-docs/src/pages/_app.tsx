import React from 'react';
import { CSSReset, ThemeProvider, theme, ColorModeProvider } from '@blockstack/ui';
import { MDXProvider } from '@mdx-js/react';
import { MDXComponents } from '@components/mdx';
import { AppStateProvider } from '@components/app-state';
import { MdxOverrides } from '@components/docs-layout';
import { ProgressBar } from '@components/progress-bar';
import engine from 'store/src/store-engine';
import cookieStorage from 'store/storages/cookieStorage';
import GoogleFonts from 'next-google-fonts';
import { useFathom } from '@common/hooks/use-fathom';
import { trackGoal } from 'fathom-client';

const COLOR_MODE_COOKIE = 'color_mode';

const cookieSetter = engine.createStore([cookieStorage]);

const handleColorModeChange = (mode: string) => cookieSetter.set(COLOR_MODE_COOKIE, mode);

const AppWrapper = ({ children, colorMode = 'light', version }: any) => (
  <>
    <GoogleFonts href="https://fonts.googleapis.com/css2?family=Fira+Code&family=Inter:wght@400;500;600;700&display=swap" />
    <ThemeProvider theme={theme}>
      <MdxOverrides />
      <ColorModeProvider onChange={handleColorModeChange} colorMode={colorMode}>
        <ProgressBar />
        <MDXProvider components={MDXComponents}>
          <AppStateProvider version={version}>
            <CSSReset />
            {children}
          </AppStateProvider>
        </MDXProvider>
      </ColorModeProvider>
    </ThemeProvider>
  </>
);

const MyApp = ({ Component, pageProps, colorMode, ...rest }: any) => {
  const [version, setVersion] = React.useState(pageProps?.version);
  if (!version && pageProps?.version) {
    setVersion(pageProps?.version);
  }
  useFathom();
  return (
    <AppWrapper colorMode={colorMode} version={version}>
      <Component {...pageProps} />
    </AppWrapper>
  );
};

// https://nextjs.org/docs/advanced-features/measuring-performance#sending-results-to-analytics
export function reportWebVitals(metric) {
  switch (metric.name) {
    case 'FCP':
      // handle FCP results
      // AMRPJB41
      trackGoal('AMRPJB41', Math.round(metric.value));
      break;
    case 'LCP':
      // handle LCP results
      // 0YIWHNVQ
      trackGoal('0YIWHNVQ', Math.round(metric.value));
      break;
    case 'CLS':
      // handle CLS results
      // MBBF8MN5
      trackGoal('MBBF8MN5', Math.round(metric.value * 1000));
      break;
    case 'FID':
      // handle FID results
      // PGZYOYWT
      trackGoal('PGZYOYWT', Math.round(metric.value));
      break;
    case 'TTFB':
      // handle TTFB results
      // 5SRKSJRM
      trackGoal('5SRKSJRM', Math.round(metric.value));
      break;
    default:
      break;
  }
}

export default MyApp;
