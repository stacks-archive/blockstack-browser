import { Component, h, Prop, Event, EventEmitter, State } from '@stencil/core';
import { CloseIcon } from './assets/close-icon';
import type { AuthOptions } from '@stacks/connect/types/auth';
import { getBrowser } from './extension-util';
import { StacksIcon } from './assets/stacks-icon';

@Component({
  tag: 'connect-modal',
  styleUrl: 'modal.scss',
  assetsDirs: ['screens', 'assets'],
  shadow: true,
})
export class Modal {
  @Prop() authOptions: AuthOptions;
  @Event()
  onSignUp: EventEmitter;

  @Event()
  onSignIn: EventEmitter;

  @Event()
  onCloseModal: EventEmitter;

  @State()
  openedInstall: boolean;

  handleOpenedInstall() {
    this.openedInstall = true;
  }

  render() {
    const browser = getBrowser();
    const handleContainerClick = (event: MouseEvent) => {
      const target = event.target as HTMLDivElement;
      if (target.className?.includes && target.className.includes('modal-container')) {
        this.onCloseModal.emit();
      }
    };
    return (
      <div class="modal-container" onClick={handleContainerClick}>
        <div class="modal-body">
          <div class="modal-top">
            <CloseIcon onClick={() => this.onCloseModal.emit()} />
          </div>
          <div class="modal-content">
            <div>
              <div class="hero-icon">
                <StacksIcon />
              </div>
              <span class="modal-header pxl">
                Use {this.authOptions.appDetails.name} with Stacks
              </span>
              <div class="intro-subtitle pxl">
                Stacks Wallet gives you control over your digital assets and data in apps like{' '}
                {this.authOptions.appDetails.name}.
                {browser ? ` Add it to ${browser} to continue.` : ''}
              </div>
              {this.openedInstall ? (
                <div class="intro-subtitle pxl">
                  After installing Stacks Wallet, reload this page and sign in.
                </div>
              ) : (
                <div class="button-container">
                  <button
                    class="button"
                    onClick={() => {
                      window.open('https://www.hiro.so/wallet/install-web', '_blank');
                      this.openedInstall = true;
                    }}
                  >
                    <span>Install Stacks Wallet</span>
                  </button>
                </div>
              )}
              <div class="modal-footer">
                <span
                  class="link"
                  onClick={() =>
                    window.open('https://www.hiro.so/questions/how-does-stacks-work', '_blank')
                  }
                >
                  How it works
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
