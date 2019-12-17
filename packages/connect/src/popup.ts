interface PopupOptions {
  url: string;
  title?: string;
  w?: number;
  h?: number;
}

const defaultHeight = 584;
const defaultWidth = 440;
const defaultTitle = 'Continue with Data Vault';

export const popupCenter = ({
  url,
  title = defaultTitle,
  w = defaultWidth,
  h = defaultHeight
}: PopupOptions) => {
  const dualScreenLeft = window.screenLeft || window.screenX;
  const dualScreenTop = window.screenTop || window.screenY;

  const width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    window.screen.width;
  const height =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    window.screen.height;

  const systemZoom = width / window.screen.availWidth;
  const left = (width - w) / 2 / systemZoom + dualScreenLeft;
  const top = (height - h) / 2 / systemZoom + dualScreenTop;
  const options = {
    scrollbars: 'no',
    width: w / systemZoom,
    height: h / systemZoom,
    top: top,
    left: left
  };
  const optionsString = Object.keys(options).map(key => {
    return `${key}=${options[key as keyof typeof options]}`;
  });
  const newWindow = window.open(url, title, optionsString.join(','));

  if (newWindow) newWindow.focus();

  return newWindow;
};
