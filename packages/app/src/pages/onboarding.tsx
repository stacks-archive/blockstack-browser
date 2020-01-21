import React from 'react';
import { Onboarding } from '../components/sign-up/onboarding';
import { ThemeProvider, theme, CSSReset } from '@blockstack/ui';

export const OnboardingApp: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <React.Fragment>
        <CSSReset />
        <Onboarding />
      </React.Fragment>
    </ThemeProvider>
  );
};

export default OnboardingApp;
