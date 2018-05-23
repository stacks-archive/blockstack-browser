const selectLocalIdentities = ({ profiles }) =>
  profiles.identity && profiles.identity.localIdentities
const selectRegistration = ({ profiles }) => profiles.registration
const selectDefaultIdentity = state =>
  state.profiles.identity && state.profiles.identity.default

export { selectLocalIdentities, selectRegistration, selectDefaultIdentity }
