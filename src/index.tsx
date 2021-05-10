import React from 'react';
import ReactDOM from 'react-dom';
import App from '@components/app';

const buildApp = () => {
  ReactDOM.render(<App />, document.getElementById('actions-root'));
};

buildApp();
