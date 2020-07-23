import { DecodedAuthRequest } from './dev/types';
import { wordlists } from 'bip39';
import { FinishedTxData, shouldUsePopup } from '@blockstack/connect';

export const getAuthRequestParam = () => {
  const { hash } = document.location;
  const matches = /authRequest=(.*)&?/.exec(hash);
  if (matches && matches.length === 2) {
    return matches[1];
  }
  return null;
};

export const authenticationInit = () => {
  const authRequest = getAuthRequestParam();
  if (authRequest) {
    return authRequest;
  } else {
    console.log('No auth request found');
  }
  return null;
};

export const getEventSourceWindow = (event: MessageEvent) => {
  const isWindow =
    !(event.source instanceof MessagePort) && !(event.source instanceof ServiceWorker);
  if (isWindow) {
    return event.source as Window;
  }
  return null;
};

interface FinalizeAuthParams {
  decodedAuthRequest: DecodedAuthRequest;
  authResponse: string;
  authRequest: string;
}

/**
 * Call this function at the end of onboarding.
 *
 * It works by waiting for a cross-origin message from the origin app. It has to wait
 * for this message, because that origin created the popup originally, which is why it's allowed
 * to make the cross-origin message. Once we get that message, we are allowed to send a
 * message back to that origin.
 *
 * Using cross-origin messaging allows for a better UX, because the origin app can receive a callback
 * when authentication is done.
 *
 * If the cross-origin messaging fails for any reason, just fall back to the usual redirect method,
 * but using a new tab.
 *
 */
export const finalizeAuthResponse = ({
  decodedAuthRequest,
  authRequest,
  authResponse,
}: FinalizeAuthParams) => {
  const redirect = `${decodedAuthRequest.redirect_uri}?authResponse=${authResponse}`;
  if (!shouldUsePopup()) {
    document.location.href = redirect;
    return;
  }
  let didSendMessageBack = false;
  setTimeout(() => {
    if (!didSendMessageBack) {
      const { client } = decodedAuthRequest;
      if (client === 'ios' || client === 'android') {
        document.location.href = redirect;
      } else {
        window.open(redirect);
      }
    }
    window.close();
  }, 500);
  window.addEventListener('message', event => {
    if (authRequest && event.data.authRequest === authRequest) {
      const source = getEventSourceWindow(event);
      if (source) {
        source.postMessage(
          {
            authRequest,
            authResponse,
            source: 'blockstack-app',
          },
          event.origin
        );
        didSendMessageBack = true;
      }
    }
  });
  return;
};

export const finalizeTxSignature = (data: FinishedTxData) => {
  window.addEventListener('message', event => {
    const source = getEventSourceWindow(event);
    if (source) {
      source.postMessage(
        {
          ...data,
          source: 'blockstack-app',
        },
        event.origin
      );
    }
    window.close();
  });
};

export const openPopup = (actionsUrl: string) => {
  // window.open(actionsUrl, 'Blockstack', 'scrollbars=no,status=no,menubar=no,width=300px,height=200px,left=0,top=0')
  const height = 584;
  const width = 440;
  // width=440,height=584
  popupCenter(actionsUrl, 'Blockstack', width, height);
};

// open a popup, centered on the screen, with logic to handle dual-monitor setups
export const popupCenter = (url: string, title: string, w: number, h: number) => {
  const dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : window.screenX;
  const dualScreenTop = window.screenTop != undefined ? window.screenTop : window.screenY;

  const width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
    ? document.documentElement.clientWidth
    : screen.width;
  const height = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight
    ? document.documentElement.clientHeight
    : screen.height;

  const systemZoom = width / window.screen.availWidth;
  const left = (width - w) / 2 / systemZoom + dualScreenLeft;
  const top = (height - h) / 2 / systemZoom + dualScreenTop;
  const newWindow = window.open(
    url,
    title,
    // 'scrollbars=no, width=' + w / systemZoom + ', height=' + h / systemZoom + ', top=' + top + ', left=' + left
    `scrollbars=no, width=${w / systemZoom}, height=${h / systemZoom}, top=${top}, left=${left}`
  );

  // Puts focus on the newWindow
  if (newWindow && window.focus) newWindow.focus();
};

export const getRandomWord = () => {
  const list = wordlists.EN;
  return list[Math.floor(Math.random() * list.length)];
};
