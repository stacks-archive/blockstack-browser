import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';
import { CloseIcon } from './assets/close-icon';
import { Intro } from './screens/screens-intro';
import { AuthOptions } from '@stacks/connect/auth';

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

  render() {
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
            <Intro authOptions={this.authOptions} signUp={this.onSignUp} signIn={this.onSignIn} />
          </div>
        </div>
      </div>
    );
  }
}
