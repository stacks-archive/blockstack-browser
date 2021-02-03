import { ScreenPaths } from '@store/onboarding/types';
import {
  CONTENT_SCRIPT_PORT,
  MessageFromApp,
  MessageFromContentScript,
  Methods,
} from '../message-types';
import { storePayload, StorageKey } from '../storage';
import { vaultMessageHandler } from './vault-manager';

chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install' && NODE_ENV !== 'test') {
    chrome.tabs.create({ url: chrome.runtime.getURL(`index.html#${ScreenPaths.INSTALLED}`) });
  }
});

chrome.runtime.onConnect.addListener(port => {
  if (port.name === CONTENT_SCRIPT_PORT) {
    port.onMessage.addListener((message: MessageFromContentScript, port) => {
      const { payload } = message;
      switch (message.method) {
        case Methods.authenticationRequest:
          void storePayload({
            payload,
            storageKey: StorageKey.authenticationRequests,
            port,
          });
          break;
        case Methods.transactionRequest:
          void storePayload({
            payload,
            storageKey: StorageKey.transactionRequests,
            port,
          });
          break;
        default:
          break;
      }
    });
  }
});

chrome.runtime.onMessage.addListener((message: MessageFromApp, sender, sendResponse) => {
  // Only respond to internal messages from our UI, not content scripts in other applications
  if (!sender.url?.startsWith(chrome.runtime.getURL(''))) return;
  void vaultMessageHandler(message).then(sendResponse).catch(sendResponse);
  // Return true to specify that we are responding async
  return true;
});

if (NODE_ENV === 'test') {
  // expose a helper function to open a new tab with the wallet from tests
  (window as any).openOptionsPage = function (page: string) {
    const url = chrome.runtime.getURL(`index.html#${page}`);
    return url;
  };
}
