import { h, EventEmitter } from '@stencil/core';
import { MiniBlockstackIcon } from '../assets/mini-blockstack-icon';

interface HowItWorksProps {
  signUp: EventEmitter;
}

export const HowItWorks = ({ signUp }: HowItWorksProps) => {
  return (
    <div>
      <div class="how-it-works">
        <div class="label">How it works</div>
        <span class="modal-header">
          Testing App guarantees your privacy by encrypting everything
        </span>
        <span class="hiw-content">
          Normally, apps keep your data for them to use. When you have a Secret Key, you no longer
          have to trust Testing App with your data because Testing App won't have access.
        </span>

        <span class="hiw-question">What is Blockstack?</span>
        <span class="hiw-content">
          Blockstack is the open-source technology that generates your Secret Key. There's no
          company that owns or controls Blockstack, it is independent. Go to{' '}
          <a href="https://blockstack.org" target="_blank" class="link link-l">
            blockstack.org
          </a>{' '}
          to learn more.
        </span>

        <span class="hiw-question">Encryption</span>
        <span class="hiw-content">
          Encryption is always on. It locks everything you do in Testing App into useless codes.
          Because of this, Testing App can’t see or track your activity. Your data can only be
          unlocked with the key that you own. No one else has this key, not even Testing App, so no
          one else can unlock your data
        </span>

        <span class="hiw-question">What is a Secret Key?</span>
        <span class="hiw-content">
          Your Secret Key unlocks your data. It's created independently from Testing App to make
          sure that Testing App doesn't have it. An open-source protocol called Blockstack generates
          your Secret Key when you sign up. Nobody but you will have your Secret Key, to make sure
          that only you have access to your data.
        </span>

        <span class="hiw-question">When will I need my Secret Key?</span>
        <span class="hiw-content">
          You’ll need your Secret Key to prove it’s you when you use Testing App on a new device,
          such as a new phone or laptop. After that, your Secret Key will stay active to keep you
          safe and private in the apps you use on that device.
        </span>
      </div>
      <div class="button-container">
        <button class="button" onClick={() => signUp.emit()}>
          <span>Get your Secret Key</span>
        </button>
      </div>

      <div class="powered-by-container">
        <a class="powered-by" href="https://blockstack.org" target="_blank">
          Powered by
          <MiniBlockstackIcon />
          Blockstack
        </a>
      </div>
    </div>
  );
};
