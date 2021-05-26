const deepMerge = require('deepmerge');

const IS_DEV = process.env.NODE_ENV === 'development';

const manifest = {
  author: 'Hiro PBC',
  description:
    'Stacks Wallet. Use the Stacks blockchain to access privacy-friendly apps, and keep data in your control.',
  permissions: ['activeTab'],
  manifest_version: 2,
  background: {
    scripts: ['background.js'],
    persistent: true,
  },
  web_accessible_resources: ['inpage.js'],
  browser_action: {
    default_title: 'Stacks',
    default_popup: 'extension.html',
  },
  commands: {
    _execute_browser_action: {
      suggested_key: {
        default: 'Ctrl+Shift+B',
        mac: 'MacCtrl+Shift+B',
      },
      description: 'Opens Stacks App',
    },
  },
  options_ui: {
    page: 'full-page.html',
    open_in_tab: true,
  },
  content_scripts: [
    {
      js: ['content-script.js'],
      matches: ['*://*/*'],
    },
  ],
  browser_specific_settings: {
    gecko: {
      id: '{e22ae397-03d7-4622-bd8f-ecaca8c9b277}',
    },
  },
};

const devManifest = {
  name: 'Stacks Wallet Dev',
  content_security_policy:
    "script-src 'self' 'unsafe-eval'; object-src 'self'; frame-src 'none'; frame-ancestors 'none';",
  icons: {
    128: 'assets/connect-logo/Stacks128w-dev.png',
    256: 'assets/connect-logo/Stacks256w-dev.png',
    512: 'assets/connect-logo/Stacks512w-dev.png',
  },
  browser_action: {
    default_icon: 'assets/connect-logo/Stacks128w-dev.png',
  },
};

const prodManifest = {
  name: 'Stacks Wallet',
  content_security_policy:
    "script-src 'self' 'wasm-eval'; object-src 'none'; frame-src 'none'; frame-ancestors 'none';",
  icons: {
    128: 'assets/connect-logo/Stacks128w.png',
    256: 'assets/connect-logo/Stacks256w.png',
    512: 'assets/connect-logo/Stacks512w.png',
  },
  browser_action: {
    default_icon: 'assets/connect-logo/Stacks128w.png',
  },
};

module.exports = version => {
  return deepMerge.all([{ version }, manifest, IS_DEV ? devManifest : prodManifest]);
};
