const selectLocalIdentities = ({ profiles }) =>
  profiles.identity && profiles.identity.localIdentities
const selectRegistration = ({ profiles }) => profiles.registration

export { selectLocalIdentities, selectRegistration }
