import React from 'react';
import { ThemeProvider, theme, CSSReset } from '@blockstack/ui';
import { createGlobalStyle } from 'styled-components';
import { Onboarding } from '@components/onboarding';

const GlobalStyles = createGlobalStyle`
#actions-root{
display: flex;
min-height: 100vh;
width: 100%;
flex-direction: column;
}`;

export const OnboardingApp: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <React.Fragment>
        <GlobalStyles />
        <CSSReset />
        <Onboarding />
      </React.Fragment>
    </ThemeProvider>
  );
};

export default OnboardingApp;
