import { getEventSourceWindow } from '../../common/utils';

// const backgroundPort = chrome.runtime.connect({
//   name: 'Blockstack-ContentScript',
// });

window.addEventListener('message', event => {
  const { data } = event;
  if (data.source === 'blockstack-app') {
    const { method } = data;
    if (method === 'getURL') {
      const url = chrome.runtime.getURL('');
      const source = getEventSourceWindow(event);
      source?.postMessage(
        {
          url,
          method: 'getURLResponse',
          source: 'blockstack-extension',
        },
        event.origin
      );
      return;
    }
    // backgroundPort.postMessage(data);
  }
});

const inpage = document.createElement('script');
inpage.src = chrome.runtime.getURL('inpage.js');
inpage.id = 'blockstack-app';
document.body.appendChild(inpage);
