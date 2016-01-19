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

export function getNameParts(profile) {
  let givenName = '',
      familyName = ''
  if (profile.givenName || profile.familyName) {
    if (profile.givenName) {
      givenName = profile.givenName
    }
    if (profile.familyName) {
      familyName = profile.familyName
    }
  } else if (profile.name) {
    let nameParts = profile.name.split(' ')
    givenName = nameParts[0]
    if (nameParts.length > 1) {
      familyName = nameParts[1]
    }
  }
  return givenName, familyName
}

export function getSocialAccounts(profile) {
  var accounts = []
  if (profile.account) {
    profile.account.map(function(account) {
      if (account.service === 'twitter' || account.service === 'facebook') {
        accounts.push(account)
      }
    })
  }
  return accounts
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
  let avatarContentUrl = 'https://s3.amazonaws.com/65m/avatar-placeholder.png'
  if (profile.image) {
    profile.image.map(function(image) {
      if (image.name === 'avatar') {
        avatarContentUrl = image.contentUrl
        return
      }
    })
  }
  return avatarContentUrl
}
