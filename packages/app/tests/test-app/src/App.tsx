import React, { useState } from 'react';
import { authenticate } from '@blockstack/connect';
import './App.css';

const App: React.FC = () => {
  const [authResponse, setAuthResponse] = useState('');
  const [appPrivateKey, setAppPrivateKey] = useState('');
  // eslint-disable-next-line
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        {authResponse && <span id="auth-response">{authResponse}</span>}
        {appPrivateKey && <span id="app-private-key">{appPrivateKey}</span>}
        <button
          className="App-link"
          id="auth-action"
          data-test="button-open-connect-modal"
          onClick={() =>
            authenticate({
              redirectTo: '/',
              manifestPath: '/manifest.json',
              authOrigin: 'http://localhost:8080',
              finished: ({ authResponse, userSession }) => {
                setAppPrivateKey(userSession.loadUserData().appPrivateKey);
                setAuthResponse(authResponse);
              },
              appDetails: {
                name: 'Tester-Fake-App',
                icon: `${window.location.origin}/logo512.png`,
              },
            })
          }
        >
          Open Authentication
        </button>
      </header>
    </div>
  );
}

export default App;
