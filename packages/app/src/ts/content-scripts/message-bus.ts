const backgroundPort = chrome.runtime.connect({
  name: 'Blockstack-ContentScript',
});

window.addEventListener('message', event => {
  if (event.data.source === 'blockstack-app') {
    console.log(event);
    backgroundPort.postMessage(event.data);
  }
});

const inpage = document.createElement('script');
inpage.src = chrome.runtime.getURL('inpage.js');
inpage.id = 'blockstack-app';
document.body.appendChild(inpage);
