import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ThemeProvider, theme, CSSReset } from '@blockstack/ui';
import { Connect } from '../../src/react/components/connect';

const icon = `${document.location.href}/messenger-app-icon.png`;
const authOptions = {
  manifestPath: '/static/manifest.json',
  redirectTo: '/',
  finished: () => {
    console.log('finish');
  },
  vaultUrl: 'http://localhost:8080',
  appDetails: {
    name: 'Testing App',
    icon,
  },
};
ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CSSReset />
    <Connect authOptions={authOptions}>
      <App />
    </Connect>
  </ThemeProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
