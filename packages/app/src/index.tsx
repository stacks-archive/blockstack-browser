import React from 'react';
import ExtStore from './store/ext-store';
import ReactDOM from 'react-dom';
import { Store as ReduxStore } from 'redux';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from './store';
import App from '@components/app';
import DevStore from './common/dev/store';
import { setStatsConfig } from '@common/track';

const buildApp = (store: ReduxStore | ReturnType<typeof ExtStore>) => {
  setStatsConfig();
  ReactDOM.render(
    <Provider store={store as any}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>,
    document.getElementById('actions-root')
  );
};

if (EXT_ENV === 'web') {
  const store = DevStore;
  buildApp(store);
} else {
  const store = ExtStore();
  store.ready().then(() => buildApp(store));
}
