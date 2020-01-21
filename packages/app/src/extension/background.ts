import { wrapStore } from 'webext-redux';
import { store } from '../store';
import { doAuthRequest } from '../store/permissions/actions';
import { walletDeserializer } from '../store/ext-store';
import { openPopup } from '../common/utils';

wrapStore(store, {
  portName: 'ExPort', // Communication port between the background component and views such as browser tabs.
  deserializer: (payload: any) => JSON.parse(payload, walletDeserializer),
  serializer: (payload: any) => JSON.stringify(payload),
});

chrome.runtime.onConnect.addListener(port => {
  if (port.name === 'Blockstack-ContentScript') {
    port.onMessage.addListener(event => {
      if (event.method === 'auth') {
        store.dispatch(doAuthRequest(event.authRequest));
        openPopup(chrome.runtime.getURL('actions.html'));
        // window.open(
        //   chrome.runtime.getURL('actions.html'),
        //   'Blockstack',
        //   'scrollbars=no,status=no,menubar=no,width=300px,height=200px,left=0,top=0'
        // )
      }
    });
  }
});
