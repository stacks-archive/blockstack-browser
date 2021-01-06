import { h, EventEmitter } from '@stencil/core';
import { AuthOptions } from '@stacks/connect/auth';
import { StacksIcon } from '../assets/stacks-icon';
import { getBrowser } from '../extension-util';

interface IntroProps {
  authOptions: AuthOptions;
  signUp: EventEmitter;
  signIn: EventEmitter;
}

export const Intro = ({ authOptions, signUp }: IntroProps) => {
  const browser = getBrowser();
  return (
    <div>
      <div class="hero-icon">
        <StacksIcon />
      </div>
      <span class="modal-header pxl">Use {authOptions.appDetails.name} with Stacks</span>
      <div class="intro-subtitle pxl">
        Stacks Wallet gives you control over your digital assets and data in apps like{' '}
        {authOptions.appDetails.name}.{browser ? ` Add it to ${browser} to continue.` : ''}
      </div>
      <div class="button-container">
        <button
          class="button"
          onClick={() => {
            signUp.emit();
          }}
        >
          <span>
            {browser
              ? `Add Stacks Wallet to ${browser}`
              : `Connect to ${authOptions.appDetails.name}`}
          </span>
        </button>
      </div>
      <div class="modal-footer">
        <span
          class="link"
          onClick={() =>
            window.open('https://www.blockstack.org/questions/how-does-connect-work', '_blank')
          }
        >
          How it works
        </span>
      </div>
    </div>
  );
};
