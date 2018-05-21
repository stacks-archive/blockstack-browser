const selectPromptedForEmail = ({ account }) => account.promptedForEmail
const selectEncryptedBackupPhrase = ({ account }) => account.encryptedBackupPhrase
const selectIdentityAddresses = ({ account }) =>
  account.identityAccount.addresses
const selectIdentityKeypairs = ({ account }) => account.identityAccount.keypairs
const selectConnectedStorageAtLeastOnce = ({ account }) =>
  account.connectedStorageAtLeastOnce
const selectEmail = ({ account }) => account.email

export {
  selectPromptedForEmail,
  selectEncryptedBackupPhrase,
  selectIdentityAddresses,
  selectIdentityKeypairs,
  selectConnectedStorageAtLeastOnce,
  selectEmail
}
