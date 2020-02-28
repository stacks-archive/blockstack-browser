import React from 'react';
import ExtStore from '../store/ext-store';
import ReactDOM from 'react-dom';
import { Store as ReduxStore } from 'redux';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from '../store';
import PopupApp from './pages/popup-app';
import DevStore from '../common/dev/store';
import { setStatsConfig } from '@common/track';

const buildApp = (store: ReduxStore | ReturnType<typeof ExtStore>) => {
  setStatsConfig();
  ReactDOM.render(
    <Provider store={store as any}>
      <PersistGate loading={null} persistor={persistor}>
        <PopupApp />
      </PersistGate>
    </Provider>,
    document.getElementById('popup-root')
  );
};

if (EXT_ENV === 'web') {
  const store = DevStore;
  buildApp(store);
} else {
  const store = ExtStore();
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  store.ready().then(() => buildApp(store));
}
