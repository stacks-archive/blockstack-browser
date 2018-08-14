export function getNumberOfVerifications(profile) {
  let numberOfVerifications = 0
  if (profile && profile.twitter && profile.twitter.proof && profile.twitter.proof.url) {
    numberOfVerifications += 1
  }
  if (profile && profile.facebook && profile.facebook.proof && profile.facebook.proof.url) {
    numberOfVerifications += 1
  }
  if (profile && profile.github && profile.github.proof && profile.github.proof.url) {
    numberOfVerifications += 1
  }
  return numberOfVerifications
}


export function compareProfilesByVerifications(resultA, resultB) {
  const numVerificationsA = getNumberOfVerifications(resultA.profile)
  const numVerificationsB = getNumberOfVerifications(resultB.profile)
  if (numVerificationsA < numVerificationsB) {
    return 1
  } else if (numVerificationsA > numVerificationsB) {
    return -1
  } else {
    return 0
  }
}
