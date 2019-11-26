import 'react-hot-loader';
import React from 'react';
import { Store, applyMiddleware } from 'webext-redux';
import ReactDOM from 'react-dom';
import { Store as ReduxStore } from 'redux';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, middlewareComponents } from '@store';
import PopupApp from './containers/PopupApp';
import DevStore from '@dev/store';

const buildApp = (store: ReduxStore | Store) => {
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
  const store = new Store({
    portName: 'ExPort', // Communication port between the background component and views such as browser tabs.
  });
  applyMiddleware(store, ...middlewareComponents);
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  store.ready().then(() => buildApp(store));
}
