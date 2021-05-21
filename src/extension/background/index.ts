import { popupCenter } from '@common/popup';
import { ScreenPaths } from '@store/types';
import { CONTENT_SCRIPT_PORT, ExternalMethods, MessageFromContentScript } from '../message-types';
import { storePayload, StorageKey } from '../storage';
import { vaultMessageHandler } from './vault-manager';
import { IS_TEST_ENV } from '@common/constants';

chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install' && !IS_TEST_ENV) {
    chrome.tabs.create({ url: chrome.runtime.getURL(`full-page.html#${ScreenPaths.INSTALLED}`) });
  }
});

chrome.runtime.onConnect.addListener(port => {
  if (port.name === CONTENT_SCRIPT_PORT) {
    port.onMessage.addListener((message: MessageFromContentScript, port) => {
      const { payload } = message;
      switch (message.method) {
        case ExternalMethods.authenticationRequest: {
          void storePayload({
            payload,
            storageKey: StorageKey.authenticationRequests,
            port,
          });
          const path = ScreenPaths.GENERATION;
          const urlParams = new URLSearchParams();
          urlParams.set('authRequest', payload);
          popupCenter({ url: `/popup.html#${path}?${urlParams.toString()}` });
          break;
        }
        case ExternalMethods.transactionRequest: {
          void storePayload({
            payload,
            storageKey: StorageKey.transactionRequests,
            port,
          });
          const path = ScreenPaths.TRANSACTION_POPUP;
          const urlParams = new URLSearchParams();
          urlParams.set('request', payload);
          popupCenter({ url: `/popup.html#${path}?${urlParams.toString()}` });
          break;
        }
        default:
          break;
      }
    });
  }
});

chrome.runtime.onMessage.addListener((message: VaultMessageFromApp, sender, sendResponse) => {
  // Only respond to internal messages from our UI, not content scripts in other applications
  if (!sender.url?.startsWith(chrome.runtime.getURL(''))) return;
  void vaultMessageHandler(message).then(sendResponse).catch(sendResponse);
  // Return true to specify that we are responding async
  return true;
});

if (IS_TEST_ENV) {
  // expose a helper function to open a new tab with the wallet from tests
  (window as any).openOptionsPage = function (page: string) {
    const url = chrome.runtime.getURL(`full-page.html#${page}`);
    return url;
  };
}
