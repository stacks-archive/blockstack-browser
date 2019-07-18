const selectPromptedForEmail = ({ account }) => account.promptedForEmail
const selectEncryptedBackupPhrase = ({ account }) =>
  account.encryptedBackupPhrase
const selectIdentityAddresses = ({ account }) =>
  account.identityAccount.addresses
const selectIdentityKeypairs = ({ account }) => account.identityAccount.keypairs
const selectIdentitySettings = ({ account }) =>
  account.identityAccount.settings
const selectConnectedStorageAtLeastOnce = ({ account }) =>
  account.connectedStorageAtLeastOnce
const selectEmail = ({ account }) => account.email
const selectPublicKeychain = ({ account }) =>
  account.identityAccount && account.identityAccount.publicKeychain
const selectRecoveryCodeVerified = ({account}) => account && account.recoveryCodeVerified
const selectAccountCreated = ({account}) => account && account.accountCreated

export {
  selectAccountCreated,
  selectPromptedForEmail,
  selectEncryptedBackupPhrase,
  selectIdentityAddresses,
  selectIdentityKeypairs,
  selectIdentitySettings,
  selectConnectedStorageAtLeastOnce,
  selectEmail,
  selectPublicKeychain,
  selectRecoveryCodeVerified
}
