import { wrapStore } from 'webext-redux';
import { ScreenPaths } from '@store/onboarding/types';
import { store } from '../store';
import { inactivityLockCheck } from '@common/inactivity-lock';

wrapStore(store, {
  portName: 'ExPort', // Communication port between the background component and views such as browser tabs.
});

chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    chrome.tabs.create({ url: chrome.runtime.getURL(`index.html#${ScreenPaths.INSTALLED}`) });
  }
});

// Set an interval to run a check to see if the wallet state needs to be locked.
setInterval(() => {
  inactivityLockCheck();
}, 5000);
