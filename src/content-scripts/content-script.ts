/**
 Extensions that read or write to web pages utilize a content script. The content script
 contains JavaScript that executes in the contexts of a page that has been loaded into
 the browser. Content scripts read and modify the DOM of web pages the browser visits.
 https://developer.chrome.com/docs/extensions/mv3/architecture-overview/#contentScripts
 */
import { getEventSourceWindow } from '@common/utils';
import {
  CONTENT_SCRIPT_PORT,
  ExternalMethods,
  MessageFromContentScript,
  MessageToContentScript,
  MESSAGE_SOURCE,
} from '@common/message-types';
import {
  AuthenticationRequestEvent,
  DomEventName,
  TransactionRequestEvent,
} from '@inpage/inpage-types';
import { ScreenPaths } from '@common/types';

// Legacy messaging to work with older versions of Connect
window.addEventListener('message', event => {
  const { data } = event;
  if (data.source === 'blockstack-app') {
    const { method } = data;
    if (method === 'getURL') {
      const url = chrome.runtime.getURL('index.html');
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
  }
});

// Connection to background script - fires onConnect event in background script
// and establishes two-way communication
const backgroundPort = chrome.runtime.connect({ name: CONTENT_SCRIPT_PORT });

// Sends message to background script that an event has fired
function sendMessageToBackground(message: MessageFromContentScript) {
  backgroundPort.postMessage(message);
}

// Receives message from background script to execute in browser
chrome.runtime.onMessage.addListener((message: MessageToContentScript) => {
  if (message.source === MESSAGE_SOURCE) {
    // Forward to web app (browser)
    window.postMessage(message, window.location.origin);
  }
});

interface ForwardDomEventToBackgroundArgs {
  payload: string;
  method: MessageFromContentScript['method'];
  urlParam: string;
  path: ScreenPaths;
}

function forwardDomEventToBackground({ payload, method }: ForwardDomEventToBackgroundArgs) {
  sendMessageToBackground({
    method,
    payload,
    source: MESSAGE_SOURCE,
  });
}

// Listen for a CustomEvent (auth request) coming from the web app
document.addEventListener(DomEventName.authenticationRequest, ((
  event: AuthenticationRequestEvent
) => {
  forwardDomEventToBackground({
    path: ScreenPaths.GENERATION,
    payload: event.detail.authenticationRequest,
    urlParam: 'authRequest',
    method: ExternalMethods.authenticationRequest,
  });
}) as EventListener);

// Listen for a CustomEvent (transaction request) coming from the web app
document.addEventListener(DomEventName.transactionRequest, ((event: TransactionRequestEvent) => {
  forwardDomEventToBackground({
    path: ScreenPaths.TRANSACTION_POPUP,
    payload: event.detail.transactionRequest,
    urlParam: 'request',
    method: ExternalMethods.transactionRequest,
  });
}) as EventListener);

// Inject inpage script (Stacks Provider)
const inpage = document.createElement('script');
inpage.src = chrome.runtime.getURL('inpage.js');
inpage.id = 'stacks-wallet-provider';
document.body.appendChild(inpage);
