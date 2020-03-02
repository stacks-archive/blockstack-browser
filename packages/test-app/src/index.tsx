import * as React from 'react';
import ReactDOM from 'react-dom';
import { App } from '../components/app';

const render = () => {
  ReactDOM.render(<App />, document.getElementById('app-root'));
};

render();
