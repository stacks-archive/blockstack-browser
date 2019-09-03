import * as React from 'react';
import { Store } from 'react-chrome-redux';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import PopupApp from './containers/PopupApp';

const store = new Store({
	portName: 'ExPort' // Communication port between the background component and views such as browser tabs.
});

store.ready().then(() => {
	ReactDOM.render(
		<Provider store={store}>
			<PopupApp />
		</Provider>
		, document.getElementById('popup-root'));
});
