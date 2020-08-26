export const isChrome = () => {
  const isChromium = !!window['chrome'];
  const winNav = window.navigator;
  const vendorName = winNav.vendor;
  const isOpera = typeof (window as any).opr !== 'undefined';
  const isIEedge = winNav.userAgent.includes('Edge');
  const isIOSChrome = /CriOS/.exec(winNav.userAgent);

  if (isIOSChrome) {
    return false;
  } else if (
    isChromium !== null &&
    typeof isChromium !== 'undefined' &&
    vendorName === 'Google Inc.' &&
    isOpera === false &&
    isIEedge === false
  ) {
    return true;
  } else {
    return false;
  }
};

type Browser = 'Chrome' | 'Firefox';

export const getBrowser = (): Browser | null => {
  if (isChrome()) {
    return 'Chrome';
  } else if (window.navigator.userAgent.includes('Firefox')) {
    return 'Firefox';
  }
  return null;
};

export const onClick = () => {
  const browser = getBrowser();
  if (browser === 'Firefox') {
    window.open('https://addons.mozilla.org/en-US/firefox/addon/blockstack/', '_blank');
  } else if (browser === 'Chrome') {
    window.open(
      'https://chrome.google.com/webstore/detail/blockstack/mdhmgoflnkccjhcfbojdagggmklgfloo',
      '_blank'
    );
  }
};
