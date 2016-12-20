import hasprop from 'hasprop'

export function compareProfilesByVerifications(resultA, resultB) {
  let numVerificationsA = getNumberOfVerifications(resultA.profile),
      numVerificationsB = getNumberOfVerifications(resultB.profile)
  if (numVerificationsA < numVerificationsB) {
    return 1
  } else if (numVerificationsA > numVerificationsB) {
    return -1
  } else {
    return 0
  }
}

export function getNumberOfVerifications(profile) {
  let numberOfVerifications = 0
  if (hasprop(profile, 'twitter.proof.url')) {
    numberOfVerifications += 1
  }
  if (hasprop(profile, 'facebook.proof.url')) {
    numberOfVerifications += 1
  }
  if (hasprop(profile, 'github.proof.url')) {
    numberOfVerifications += 1
  }
  return numberOfVerifications
}