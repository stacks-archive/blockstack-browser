import { createTestSelector } from '../utils';

export class AuthPageObject {
  url = 'http://localhost:8080';

  $buttonCopySecretKey = createTestSelector('button-copy-secret-key');
  $buttonHasSavedSeedPhrase = createTestSelector('button-has-saved-seed-phrase');
  $inputUsername = createTestSelector('input-username');
  $buttonUsernameContinue = createTestSelector('button-username-continue');
  $textareaReadOnlySeedPhrase = createTestSelector('textarea-seed-phrase');
  $buttonConfirmReenterSeedPhrase = createTestSelector('button-confirm-reenter-seed-phrase');
  $textareaSeedPhraseInput = createTestSelector('textarea-reinput-seed-phrase');
  $buttonConnectFlowFinished = createTestSelector('button-connect-flow-finished');

  async goToPage() {
    return page.goto(this.url, { waitUntil: 'domcontentloaded' });
  }
}
