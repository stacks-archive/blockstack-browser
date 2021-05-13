import { POPUP_HEIGHT, POPUP_WIDTH } from '@common/constants';

interface PopupOptions {
  url?: string;
  title?: string;
  w?: number;
  h?: number;
  skipPopupFallback?: boolean;
}

export const popupCenter = ({ url, w = POPUP_WIDTH, h = POPUP_HEIGHT }: PopupOptions) => {
  chrome.windows.getCurrent(win => {
    if (!win) throw Error('No chrome window available');
    const dualScreenLeft = win.left;
    const dualScreenTop = win.top;

    const width = win.width;
    const height = win.height;

    if (!dualScreenLeft || !dualScreenTop || !width || !height)
      throw Error('No chrome window available');

    const left = width / 2 - w / 2 + dualScreenLeft;
    const top = Math.floor(height / 2 - h / 2 + dualScreenTop);

    chrome.windows.create({
      url,
      width: w,
      height: h,
      top,
      left,
      type: 'popup',
    });
  });
};
