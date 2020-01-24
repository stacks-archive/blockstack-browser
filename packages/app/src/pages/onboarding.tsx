import React from 'react';
import { ThemeProvider, theme, CSSReset } from '@blockstack/ui';

import { Onboarding } from '../components/sign-up/onboarding';

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
