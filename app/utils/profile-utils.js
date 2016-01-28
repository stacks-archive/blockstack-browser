export function getName(profile) {
  let name = ''
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
  let accounts = []
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
  let filteredAccounts = []
  if (profile.account && verifications) {
    profile.account.map(function(account) {
      let proofUrl = ''
      verifications.map(function(verification) {
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

export function getOrganizations(profile) {
  if (!profile) {
    return null
  }

  let organizations = []

  if (profile.hasOwnProperty('worksFor')) {
    return profile.worksFor
  }

  return organizations
}

export function getConnections(profile) {
  if (!profile) {
    return null
  }

  let connections = []

  if (profile.hasOwnProperty('knows')) {
    connections = profile.knows
  }

  return connections
}

export function getAddress(profile) {
  if (!profile) {
    return null
  }

  let addressString = null

  if (profile.hasOwnProperty('address')) {
    let addressParts = []

    if (profile.address.hasOwnProperty('streetAddress')) {
      addressParts.push(profile.address.streetAddress)
    }
    if (profile.address.hasOwnProperty('addressLocality')) {
      addressParts.push(profile.address.addressLocality)
    }
    if (profile.address.hasOwnProperty('postalCode')) {
      addressParts.push(profile.address.postalCode)
    }
    if (profile.address.hasOwnProperty('addressCountry')) {
      addressParts.push(profile.address.addressCountry)
    }

    if (addressParts.length) {
      addressString = addressParts.join(', ')
    }
  }

  return addressString
}

export function getBirthDate(profile) {
  if (!profile) {
    return null
  }

  let monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  let birthDateString = null
  if (profile.hasOwnProperty('birthDate')) {
    let date = new Date(profile.birthDate)
    birthDateString = `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
  }
  return birthDateString
}
