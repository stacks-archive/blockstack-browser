import {
  SECRET_KEY_FAQ_WHERE,
  SECRET_KEY_FAQ_LOSE,
  SECRET_KEY_FAQ_WHEN,
  SECRET_KEY_FAQ_PASSWORD,
} from '../../../common/track';

const faqs = (appName: string) => {
  return [
    {
      title: 'Where should I save my Secret Key?',
      body: `
    Save your Secret Key in a place where only you can find it. For example:
    <ul style="list-style: none;">
    <li>• A password manager such as 1password</li>
    <li>• Your Notes app, protected with a password</li>
    <li>• Written down and kept somewhere safe</li>
    </ul>
    Don’t save it anywhere where others can find it, or on a website you do not trust. Anybody with access to your Secret Key will have access to your Data Vault and apps.
    `,
      tracking: SECRET_KEY_FAQ_WHERE,
    },
    {
      title: 'What if I lose my Secret Key?',
      body: `If you lose your Secret Key, it will be lost forever. Neither ${appName} nor Data Vault can help you recover your Secret Key.`,
      tracking: SECRET_KEY_FAQ_LOSE,
    },
    {
      title: 'When will I need my Secret Key?',
      body:
        'You will use your Secret Key to unlock your Data Vault and connect it to new apps — like a password, but much more secure.',
      tracking: SECRET_KEY_FAQ_WHEN,
    },
    {
      title: 'Why don’t I have a password?',
      body:
        'Your Secret Key is much stronger than a combination of email and password — it’s virtually impossible to hack. Only you know it, which keeps your apps and data secure.',
      tracking: SECRET_KEY_FAQ_PASSWORD,
    },
  ];
};

const howDataVaultWorks = [
  {
    icon: '/assets/images/icon-cross-over-eye.svg',
    title: 'Private data storage',
    body:
      'Normally, companies store your data on their servers for them to keep. Data Vault stores your encrypted data independently from the app, so companies like Nurx (and even Data Vault) can’t have access.',
  },
  {
    icon: '/assets/images/icon-padlock.svg',
    title: 'Encryption that’s always on',
    body:
      'Encryption turns your data into indecipherable text that can be read only using the Secret Key that you control. This keeps everything you do private.',
  },
  {
    icon: '/assets/images/icon-chain-of-blocks.svg',
    title: 'Blockchain technology',
    body:
      'The Secret Key that unlocks your Data Vault is made using blockchain technology. That ensures there is only ever one, and that no one can take it from you. Your data will be private, out of the hands of companies, and only accessible to you.',
  },
  {
    icon: '/assets/images/icon-shapes.svg',
    title: 'One Vault works with 100s of apps',
    body: 'You’ll only ever have to create one Data Vault to use 100s of other apps like Nurx privately.',
  },
];

export { faqs, howDataVaultWorks };
