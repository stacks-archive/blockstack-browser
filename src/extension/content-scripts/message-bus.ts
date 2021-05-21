import { ScreenPaths } from '@store/types';
import { getEventSourceWindow } from '../../common/utils';
import {
  MessageFromContentScript,
  InternalMethods,
  AuthenticationRequestEvent,
  DomEventName,
  TransactionRequestEvent,
  MessageToContentScript,
  MESSAGE_SOURCE,
  CONTENT_SCRIPT_PORT,
} from '../message-types';

const backgroundPort = chrome.runtime.connect({ name: CONTENT_SCRIPT_PORT });

function sendMessageToBackground(message: MessageFromContentScript) {
  backgroundPort.postMessage(message);
}

/**
 * Legacy messaging to work with older versions of connect
 */
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

// Listen for `CustomEvent`s coming from website
document.addEventListener(DomEventName.authenticationRequest, ((
  event: AuthenticationRequestEvent
) => {
  forwardDomEventToBackground({
    path: ScreenPaths.GENERATION,
    payload: event.detail.authenticationRequest,
    urlParam: 'authRequest',
    method: InternalMethods.authenticationRequest,
  });
}) as EventListener);

document.addEventListener(DomEventName.transactionRequest, ((event: TransactionRequestEvent) => {
  forwardDomEventToBackground({
    path: ScreenPaths.TRANSACTION_POPUP,
    payload: event.detail.transactionRequest,
    urlParam: 'request',
    method: InternalMethods.transactionRequest,
  });
}) as EventListener);

// Background script --> Content script
chrome.runtime.onMessage.addListener((message: MessageToContentScript) => {
  if (message.source === MESSAGE_SOURCE) {
    // Forward to webpage
    window.postMessage(message, window.location.origin);
  }
});

// Inject inpage script
const inpage = document.createElement('script');
inpage.src = chrome.runtime.getURL('inpage.js');
inpage.id = 'stacks-wallet-provider';
document.body.appendChild(inpage);
