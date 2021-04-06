import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from '@components/app';
import DevStore from './common/dev/store';

const buildApp = () => {
  ReactDOM.render(
    <Provider store={DevStore}>
      <App />
    </Provider>,
    document.getElementById('actions-root')
  );
};

buildApp();
