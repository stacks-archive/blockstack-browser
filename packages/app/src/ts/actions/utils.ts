export const openPopup = (actionsUrl: string) => {
  // window.open(actionsUrl, 'Blockstack', 'scrollbars=no,status=no,menubar=no,width=300px,height=200px,left=0,top=0')
  const height = 584;
  const width = 440;
  popupCenter(actionsUrl, 'Blockstack', width, height);
};

// from https://stackoverflow.com/questions/4068373/center-a-popup-window-on-screen
// open a popup, centered on the screen, with logic to handle dual-monitor setups
export const popupCenter = (
  url: string,
  title: string,
  w: number,
  h: number
) => {
  const dualScreenLeft =
    window.screenLeft != undefined ? window.screenLeft : window.screenX;
  const dualScreenTop =
    window.screenTop != undefined ? window.screenTop : window.screenY;

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
  console.log(height - h, systemZoom, dualScreenTop);
  const top = (height - h) / 2 / systemZoom + dualScreenTop;
  const newWindow = window.open(
    url,
    title,
    // 'scrollbars=no, width=' + w / systemZoom + ', height=' + h / systemZoom + ', top=' + top + ', left=' + left
    `scrollbars=no, width=${w / systemZoom}, height=${h /
      systemZoom}, top=${top}, left=${left}`
  );

  // Puts focus on the newWindow
  if (newWindow && window.focus) newWindow.focus();
};
