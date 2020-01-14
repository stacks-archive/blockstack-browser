import React from 'react';
import { hot } from 'react-hot-loader/root';
import { Onboarding } from '@components/sign-up/onboarding';
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

export default hot(OnboardingApp);
