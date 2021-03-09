import {
  SECRET_KEY_FAQ_WHERE,
  SECRET_KEY_FAQ_LOSE,
  SECRET_KEY_FAQ_WHEN,
  SECRET_KEY_FAQ_PASSWORD,
} from '@common/track';

const faqs = (appName: string) => {
  return [
    {
      title: 'Where should I save my Secret Key?',
      body: `
      Save your Secret Key in a place where only you can find it. For example:
      <br><br>
      <ul style="list-style: none;">
      <li>• A password manager such as 1Password</li>
      <li>• Your Notes app, protected with a password</li>
      <li>• Written down and kept somewhere safe</li>
      </ul>
      <br>
      Don’t save it anywhere where others can find it, or on a website you do not trust. Anybody with your Secret Key will have access to the apps you use.
    `,
      tracking: SECRET_KEY_FAQ_WHERE,
    },
    {
      title: 'What if I lose my Secret Key?',
      body:
        'If you lose your Secret Key, it will be lost forever. Only you know your Secret Key, which means that no one can help you recover it.',
      tracking: SECRET_KEY_FAQ_LOSE,
    },
    {
      title: 'When will I need my Secret Key?',
      body: `You’ll use your Secret Key to prove it’s you when you want to use ${appName} on a new device, such as your phone or laptop. Your Secret Key will stay active on your devices and keep you private in the apps you use.`,
      tracking: SECRET_KEY_FAQ_WHEN,
    },
    {
      title: 'Why don’t I have a password?',
      body: `
        Your Secret Key keeps you private in the apps you use it with. It does this by protecting everything you do with encryption, so that ${appName} can't see or track your activity.
        <br><br>
        To access your apps and data, the Secret Key is required. Only you have your Secret Key because it's created independently from ${appName}, so no one else can access your data. Blockstack, an open-source protocol, generated your Secret Key when you signed up for ${appName}.
      `,
      tracking: SECRET_KEY_FAQ_PASSWORD,
    },
  ];
};

export { faqs };
