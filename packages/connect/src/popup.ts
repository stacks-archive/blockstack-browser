interface PopupOptions {
  url?: string;
  title?: string;
  w?: number;
  h?: number;
  skipPopupFallback?: boolean;
}

// Width 2px wider than in-page dialog.
// Ensures retina subpixel rounding
// does not leave slightly blurry underlap
const defaultWidth = 442;
const defaultHeight = 580;
const defaultTitle = 'Stacks Wallet';

// https://developer.mozilla.org/en-US/docs/Web/API/Window/open
export const popupCenter = ({
  url,
  title = defaultTitle,
  w = defaultWidth,
  h = defaultHeight,
  skipPopupFallback = true,
}: PopupOptions) => {
  const win = window;
  // Safari reports an incorrect browser height
  const isSafari = (win as any).safari !== undefined;

  const browserViewport = {
    width: win.innerWidth,
    height: win.outerHeight,
  };
  console.log('browser viewport', browserViewport);
  const browserToolbarHeight = win.outerHeight - win.innerHeight;
  const browserSidepanelWidth = win.outerWidth - win.innerWidth;

  // Such as fixed operating system UI
  const removeUnusableSpaceX = (coord: number) =>
    coord - (win.screen.width - win.screen.availWidth);
  const removeUnusableSpaceY = (coord: number) =>
    coord - (win.screen.height - win.screen.availHeight);

  const browserPosition = {
    x: removeUnusableSpaceX(win.screenX),
    y: removeUnusableSpaceY(win.screenY),
  };

  console.log('browserPosition', browserPosition);

  const left = browserPosition.x + browserSidepanelWidth + (browserViewport.width - w) / 2;
  const top =
    browserPosition.y +
    browserToolbarHeight +
    (browserViewport.height - h) / 2 +
    (isSafari ? 48 : 0);

  const options = {
    scrollbars: 'no',
    width: w,
    height: h,
    top,
    left,
  };
  const optionsString = Object.keys(options).map(key => {
    return `${key}=${options[key as keyof typeof options]}`;
  });
  const newWindow = window.open(url, title, optionsString.join(','));

  if (newWindow) {
    newWindow.focus();
    return newWindow;
  }

  // no popup options, just open the auth page

  if (skipPopupFallback) {
    return newWindow;
  }
  return window.open(url);
};

interface ListenerParams<FinishedType> {
  popup: Window | null;
  messageParams: {
    [key: string]: any;
  };
  onFinish: (payload: FinishedType) => void | Promise<void>;
  onCancel?: () => void;
  authURL: URL;
}

export const setupListener = <T>({
  popup,
  messageParams,
  onFinish,
  onCancel,
  authURL,
}: ListenerParams<T>) => {
  let lastPong: number | null = null;

  // Send a message to the authenticator popup at a consistent interval. This allows
  // the authenticator to 'respond'.
  const pingInterval = 250;
  let interval: number | undefined = undefined;
  const sendPing = () => {
    console.log('sending ping', popup?.origin);
    if (popup) {
      try {
        popup.postMessage(
          {
            method: 'ping',
            ...messageParams,
          },
          authURL.origin
        );
      } catch (error) {
        console.warn('[Blockstack] Unable to send ping to authentication service');
        clearInterval(interval);
      }
    } else {
      console.warn('[Blockstack] Unable to send ping to authentication service - popup closed');
    }
    // If we haven't received a "pong" recently, then the popup was probably closed
    // by the user. 750ms has been tested by most browsers. Most respond in less than
    // 500ms, although Safari can often take around 600-650ms.
    if (lastPong && new Date().getTime() - lastPong > pingInterval * 8) {
      onCancel && onCancel();
      clearInterval(interval);
    }
  };
  interval = window.setInterval(sendPing, pingInterval);
  // sendPing();

  const receiveMessage = async (event: MessageEvent) => {
    console.log('received a message');
    if (event.data.method === 'pong') {
      console.log('got pong!');
      lastPong = new Date().getTime();
      return;
    }
    if (event.data.source === 'blockstack-app') {
      const data = event.data as T;
      await onFinish(data);
      window.focus();
      window.removeEventListener('message', receiveMessageCallback);
      clearInterval(interval);
    }
  };

  const receiveMessageCallback = (event: MessageEvent) => {
    void receiveMessage(event);
  };

  window.addEventListener('message', receiveMessageCallback, false);
};
