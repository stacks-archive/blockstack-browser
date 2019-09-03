import { Store, wrapStore } from 'react-chrome-redux';
import { createStore } from 'redux';
import { configureApp } from './AppConfig';
import reducers, { IAppState, loadState } from './store';

const preloadedState = loadState();
const store: Store<IAppState> = createStore(reducers, preloadedState);

configureApp(store);

wrapStore(store, {
	portName: 'ExPort' // Communication port between the background component and views such as browser tabs.
});
