import { POPUP_HEIGHT, POPUP_WIDTH } from '@common/constants';

interface PopupOptions {
  url?: string;
  title?: string;
  w?: number;
  h?: number;
  skipPopupFallback?: boolean;
}

export function popupCenter(options: PopupOptions) {
  const { url, w = POPUP_WIDTH, h = POPUP_HEIGHT } = options;

  // @see https://developer.chrome.com/docs/extensions/reference/windows/#method-getCurrent
  chrome.windows.getCurrent(win => {
    if (!win) throw Error('No chrome window available');

    // these units take into account the distance from
    // the farthest left/top sides of all displays
    const dualScreenLeft = win.left;
    const dualScreenTop = win.top;

    // dimensions of the window that originated the action
    const width = win.width;
    const height = win.height;

    // type safety
    if (!dualScreenLeft || !dualScreenTop || !width || !height)
      throw Error('No chrome window available');

    const left = Math.floor(width / 2 - w / 2 + dualScreenLeft);
    const top = Math.floor(height / 2 - h / 2 + dualScreenTop);

    chrome.windows.create({
      url,
      width: w,
      height: h,
      top,
      left,
      focused: true,
      type: 'popup',
    });
  });
}
