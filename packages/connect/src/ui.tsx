import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useConnect, Connect } from './react';
import { AuthOptions } from './auth';

const Base: React.FC = () => {
  const { doOpenDataVault } = useConnect();

  useEffect(() => {
    // add a small delay before triggering the modal, to properly allow
    // animations to show
    const delay = 10;
    setTimeout(() => {
      doOpenDataVault();
    }, delay);
  }, []);

  return <div />;
};

export const showBlockstackConnect = (authOptions: AuthOptions) => {
  const baseDiv = document.createElement('div');
  document.body.appendChild(baseDiv);
  ReactDOM.render(
    <Connect authOptions={authOptions}>
      <Base />
    </Connect>,
    baseDiv
  );
};
