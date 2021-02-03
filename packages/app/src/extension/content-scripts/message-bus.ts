import { popupCenter } from '@stacks/connect';
import { getEventSourceWindow } from '../../common/utils';
import {
  MessageFromContentScript,
  Methods,
  AuthenticationRequestEvent,
  DomEventName,
  TransactionRequestEvent,
  MessageToContentScript,
  MESSAGE_SOURCE,
  CONTENT_SCRIPT_PORT,
} from '../message-types';
import { ScreenPaths } from '@store/onboarding/types';

const backgroundPort = chrome.runtime.connect({ name: CONTENT_SCRIPT_PORT });

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

function sendMessage(message: MessageFromContentScript) {
  backgroundPort.postMessage(message);
}

function handleDomEvent({
  payload,
  method,
  urlParam,
  path,
}: {
  payload: string;
  method: MessageFromContentScript['method'];
  urlParam: string;
  path: ScreenPaths;
}) {
  sendMessage({
    method,
    payload,
    source: MESSAGE_SOURCE,
  });
  const origin = chrome.runtime.getURL('index.html');
  const urlParams = new URLSearchParams();
  urlParams.set(urlParam, payload);
  popupCenter({ url: `${origin}#${path}?${urlParams.toString()}` });
}

document.addEventListener(DomEventName.authenticationRequest, ((
  event: AuthenticationRequestEvent
) => {
  handleDomEvent({
    path: ScreenPaths.GENERATION,
    payload: event.detail.authenticationRequest,
    urlParam: 'authRequest',
    method: Methods.authenticationRequest,
  });
}) as EventListener);

document.addEventListener(DomEventName.transactionRequest, ((event: TransactionRequestEvent) => {
  handleDomEvent({
    path: ScreenPaths.TRANSACTION_POPUP,
    payload: event.detail.transactionRequest,
    urlParam: 'request',
    method: Methods.transactionRequest,
  });
}) as EventListener);

chrome.runtime.onMessage.addListener((message: MessageToContentScript) => {
  if (message.source === MESSAGE_SOURCE) {
    window.postMessage(message, window.location.origin);
  }
});

const inpage = document.createElement('script');
inpage.src = chrome.runtime.getURL('inpage.js');
inpage.id = 'stacks-wallet-provider';
document.body.appendChild(inpage);
