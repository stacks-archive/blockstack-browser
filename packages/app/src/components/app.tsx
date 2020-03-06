import React from 'react';
import { ThemeProvider, theme, CSSReset } from '@blockstack/ui';
import { createGlobalStyle } from 'styled-components';
import { Routes } from '@components/routes';
import { HashRouter as Router } from 'react-router-dom';

const GlobalStyles = createGlobalStyle`
#actions-root{
display: flex;
min-height: 100vh;
width: 100%;
flex-direction: column;
}`;

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <React.Fragment>
        <GlobalStyles />
        <CSSReset />
        <Router>
          <Routes />
        </Router>
      </React.Fragment>
    </ThemeProvider>
  );
};

export default App;
