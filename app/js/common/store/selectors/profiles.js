const selectLocalIdentities = ({ profiles }) =>
  profiles.identity && profiles.identity.localIdentities
const selectRegistration = ({ profiles }) => profiles.registration
const selectDefaultIdentity = state =>
  state.profiles.identity && state.profiles.identity.default
const selectDefaultIdentityObject = state =>
  state.profiles.identity &&
  state.profiles.identity.default &&
  state.profiles.identity.localIdentites[state.profiles.identity.default]

export {
  selectLocalIdentities,
  selectRegistration,
  selectDefaultIdentityObject,
  selectDefaultIdentity
}
