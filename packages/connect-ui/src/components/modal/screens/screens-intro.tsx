import { h, EventEmitter } from '@stencil/core';
import { PadlockIcon } from '../assets/padlock-icon';
import { EyeIcon } from '../assets/eye-icon';
import { state, Screens } from '../../../store';
import { LinkIcon } from '../assets/link-icon';
import { PadlockBox } from '../assets/padlock-box';
import { AuthOptions } from '@stacks/connect/auth';
import { onClick as onExtensionClick, getBrowser } from '../extension-util';

interface IntroProps {
  authOptions: AuthOptions;
  signUp: EventEmitter;
  signIn: EventEmitter;
}

export const Intro = ({ authOptions, signUp, signIn }: IntroProps) => {
  return (
    <div>
      <div class="app-element-container">
        <div class="app-element-app-icon">
          <img src={authOptions.appDetails.icon} alt="Testing App" />
        </div>
        <div class="app-element-link">
          <LinkIcon />
        </div>
        <div class="app-element-lock">
          <PadlockBox />
        </div>
      </div>
      <span class="modal-header pxl">
        {authOptions.appDetails.name} guarantees your privacy by encrypting everything
      </span>
      <div class="divider" />
      <div class="intro-entry">
        <div class="intro-entry-icon">
          <PadlockIcon />
        </div>
        <span class="intro-entry-copy">
          You'll get a Secret Key that automatically encrypts everything you do
        </span>
      </div>
      <div class="divider" />
      <div class="intro-entry">
        <div class="intro-entry-icon">
          <EyeIcon />
        </div>
        <span class="intro-entry-copy">
          {authOptions.appDetails.name} won't be able to see, access, or track your activity
        </span>
      </div>
      <div class="button-container">
        <button
          class="button"
          onClick={() => {
            signUp.emit();
          }}
        >
          <span>Get your Secret Key</span>
        </button>
      </div>
      <div class="modal-footer">
        <span class="link" onClick={() => signIn.emit()}>
          Sign in
        </span>
        <span class="link" onClick={() => (state.screen = Screens.HOW_IT_WORKS)}>
          How it works
        </span>
        {getBrowser() ? (
          <span class="link" onClick={onExtensionClick}>
            Install extension
          </span>
        ) : null}
      </div>
    </div>
  );
};
