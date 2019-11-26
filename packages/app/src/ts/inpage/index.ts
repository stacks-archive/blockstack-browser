const _window: any = window;

const log = (msg: string) => {
  console.log(`[BlockstackApp]: ${msg}`);
};

_window.BlockstackApp = {
  auth: (authRequest: string) => {
    log(`Auth request: ${authRequest}`);
    window.postMessage(
      {
        method: 'auth',
        authRequest,
        source: 'blockstack-app',
      },
      window.location.origin
    );
  },
};
