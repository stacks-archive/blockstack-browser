export function getName(profile) {
  var name = ''
  if (profile.givenName || profile.familyName) {
    if (profile.givenName) {
      name = profile.givenName
    }
    if (profile.familyName) {
      name += ' ' + profile.familyName
    }
  } else if (profile.name) {
    name = profile.name
  }
  return name
}

export function getVerifiedAccounts(profile, verifications) {
  var filteredAccounts = []
  if (profile.account) {
    profile.account.forEach(function(account) {
      var proofUrl = ''
      verifications.forEach(function(verification) {
        if (verification.valid && verification.service === account.service
            && verification.identifier === account.identifier) {
          proofUrl = verification.proof_url
        }
      })
      account.proofUrl = proofUrl
      if (account.identifier && account.service) {
        filteredAccounts.push(account)
      }
    })
  }
  return filteredAccounts
}

export function getAvatarUrl(profile) {
  let avatarContentUrl = 'http://www.clker.com/cliparts/A/Y/O/m/o/N/placeholder-hi.png'
  if (profile.image) {
    profile.image.map(function(image) {
      if (profile.image[0].name === 'avatar') {
        avatarContentUrl = profile.image[0].contentUrl
        return
      }
    })
  }
  return avatarContentUrl
}
