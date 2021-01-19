import { wrapStore } from 'webext-redux';
import { ScreenPaths } from '@store/onboarding/types';
import { store } from '../store';
import { inactivityLockCheck } from '@common/inactivity-lock';
import { MessageFromContentScript, Methods } from './message-types';
import { storePayload, StorageKey } from './storage';

wrapStore(store, {
  portName: 'ExPort', // Communication port between the background component and views such as browser tabs.
});

chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install' && NODE_ENV !== 'test') {
    chrome.tabs.create({ url: chrome.runtime.getURL(`index.html#${ScreenPaths.INSTALLED}`) });
  }
});

chrome.runtime.onConnect.addListener(port => {
  port.onMessage.addListener((message: MessageFromContentScript, port) => {
    const { payload } = message;
    switch (message.method) {
      case Methods.authenticationRequest:
        storePayload({
          payload,
          storageKey: StorageKey.authenticationRequests,
          port,
        });
        break;
      case Methods.transactionRequest:
        storePayload({
          payload,
          storageKey: StorageKey.transactionRequests,
          port,
        });
        break;
      default:
        break;
    }
  });
});

if (NODE_ENV === 'test') {
  // expose a helper function to open a new tab with the wallet from tests
  (window as any).openOptionsPage = function (page: string) {
    const url = chrome.runtime.getURL(`index.html#${page}`);
    console.log('opening options', url);
    window.open(url, '_blank');
  };
}

// Set an interval to run a check to see if the wallet state needs to be locked.
setInterval(() => {
  inactivityLockCheck();
}, 5000);
